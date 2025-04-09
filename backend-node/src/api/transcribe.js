import { errorHandler, logger, APIError } from './_utils';
import { parseFormData } from './_validation';
import { storeAudioFile, deleteAudioFile } from './storage';
import { updateStatus } from './status';
import { vertexai } from '@google-cloud/vertexai';
import { SpeechClient } from '@google-cloud/speech';
import fs from 'fs';
import axios from 'axios';

// Configuração do VertexAI
const location = process.env.VERTEX_AI_LOCATION || 'us-central1';
const project = process.env.GOOGLE_CLOUD_PROJECT;
const vertex = new vertexai({project, location});

// Inicializar Speech-to-Text client
const speechClient = new SpeechClient();

// URL do backend Python
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

const transcribeHandler = async (req, res) => {
  if (req.method !== 'POST') {
    throw new APIError('Method not allowed', 405);
  }

  // Parse form data
  const { files: audioFile, fields } = await parseFormData(req);
  const options = JSON.parse(fields.options || '{}');
  const consultationId = Date.now().toString();

  try {
    logger.info('Starting audio processing', { consultationId });
    updateStatus(consultationId, { status: 'initializing', progress: 0 });

    // Configurar requisição para Speech-to-Text
    const audioBytes = fs.readFileSync(audioFile.filepath).toString('base64');

    const request = {
      audio: {
        content: audioBytes,
      },
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: parseInt(process.env.SPEECH_SAMPLE_RATE || '48000'),
        languageCode: process.env.SPEECH_LANGUAGE || 'pt-BR',
        enableSpeakerDiarization: true,
        diarizationSpeakerCount: 2,
        model: process.env.SPEECH_RECOGNITION_MODEL || 'medical_conversation',
      },
    };

    updateStatus(consultationId, { status: 'audio_processing', progress: 20 });

    // Realizar transcrição com Speaker Diarization
    const [response] = await speechClient.recognize(request);
    updateStatus(consultationId, { status: 'transcribing', progress: 50 });

    // Processar resultado da diarização
    const diarizedText = processDiarization(response);
    updateStatus(consultationId, { status: 'diarizing', progress: 70 });

    // Processamento inicial com Claude se solicitado
    if (options.autoProcess) {
      // Verificar se deve usar o backend Python para análise VINTRA
      if (options.useVintraAnalysis && options.format === 'vintra') {
        try {
          // Chama o backend Python para análise VINTRA
          const pythonResponse = await axios.post(`${PYTHON_API_URL}/api/vintra/analisar`, {
            transcricao: diarizedText.map(s => `[${s.speaker}]: ${s.text}`).join('\n'),
            contexto_paciente: options.patientContext || null
          });
          
          updateStatus(consultationId, { status: 'analyzing', progress: 90 });
          
          // Cleanup
          await deleteAudioFile(audioFile.filepath);
          updateStatus(consultationId, { status: 'completed', progress: 100 });
          
          return res.status(200).json({
            success: true,
            consultationId,
            transcription: diarizedText,
            vintraAnalysis: pythonResponse.data,
            usedPythonBackend: true
          });
        } catch (pythonError) {
          logger.error('Error calling Python backend for VINTRA analysis', pythonError);
          
          // Fallback para análise com Claude diretamente
          logger.info('Falling back to Claude for analysis');
        }
      }
      
      // Usar Claude diretamente se não estiver usando análise VINTRA ou se houve erro
      const model = 'claude-3-sonnet';
      const context = vertex.preview.getGenerativeModel({
        model: model,
        generation_config: {
          max_output_tokens: 8192,
          temperature: 0.4,
          top_p: 0.8,
          top_k: 40
        },
      });

      const prompt = generatePrompt(diarizedText, { format: options.format || 'initial' });
      const result = await context.generateContent(prompt);
      const response = await result.response;
      const processedContent = response.text();
      updateStatus(consultationId, { status: 'analyzing', progress: 90 });

      // Cleanup
      await deleteAudioFile(audioFile.filepath);
      updateStatus(consultationId, { status: 'completed', progress: 100 });

      return res.status(200).json({
        success: true,
        consultationId,
        transcription: diarizedText,
        initialAnalysis: processedContent
      });
    }

    // Se não for autoProcess, retorna apenas a transcrição
    await deleteAudioFile(audioFile.filepath);
    updateStatus(consultationId, { status: 'completed', progress: 100 });

    return res.status(200).json({
      success: true,
      consultationId,
      transcription: diarizedText
    });

  } catch (error) {
    // Cleanup em caso de erro
    if (audioFile?.filepath) {
      await deleteAudioFile(audioFile.filepath).catch(() => {});
    }

    updateStatus(consultationId, { 
      status: 'failed', 
      progress: 0,
      error: error.message
    });
    throw error;
  }
};

// Helper para processar resultado da diarização do Speech-to-Text
const processDiarization = (response) => {
  const result = response.results[response.results.length - 1];
  const wordsInfo = result.alternatives[0].words;

  // Agrupar palavras por speaker tag
  let currentSpeaker = null;
  let currentText = [];
  const segments = [];

  wordsInfo.forEach((wordInfo) => {
    if (currentSpeaker === null) {
      currentSpeaker = wordInfo.speakerTag;
    }

    if (wordInfo.speakerTag !== currentSpeaker) {
      // Novo falante detectado, criar novo segmento
      segments.push({
        speaker: getSpeakerLabel(currentSpeaker),
        text: currentText.join(' '),
      });
      currentText = [];
      currentSpeaker = wordInfo.speakerTag;
    }

    currentText.push(wordInfo.word);
  });

  // Adicionar último segmento
  if (currentText.length > 0) {
    segments.push({
      speaker: getSpeakerLabel(currentSpeaker),
      text: currentText.join(' '),
    });
  }

  return segments;
};

// Helper para identificar falantes
const getSpeakerLabel = (speakerTag) => {
  // Como configuramos 2 falantes, assumimos que tag 1 é médico e tag 2 é paciente
  return speakerTag === 1 ? 'doctor' : 'patient';
};

// Helper para gerar prompt para Claude
const generatePrompt = (diarizedText, options) => {
  const basePrompt = `Você é um assistente especializado em documentação médica.
Analise a seguinte transcrição de consulta médica e gere a documentação solicitada.

Transcrição:
${diarizedText.map(s => `[${s.speaker}]: ${s.text}`).join('\n')}

`;

  if (options.format === 'soap') {
    return basePrompt + `
Gere uma nota SOAP (Subjetivo, Objetivo, Avaliação, Plano) baseada nesta consulta.
Estruture claramente cada seção.`;
  }

  if (options.format === 'vintra') {
    return basePrompt + `
Realize uma análise VINTRA completa, incluindo:
1. Dimensões psicológicas identificadas
2. Padrões de comunicação médico-paciente
3. Elementos narrativos relevantes
4. Recomendações para acompanhamento`;
  }

  return basePrompt + `
Gere uma análise geral da consulta, incluindo:
1. Principais queixas e sintomas
2. Diagnósticos considerados
3. Recomendações e tratamentos propostos
4. Elementos importantes da interação médico-paciente`;
};

export default errorHandler(transcribeHandler);