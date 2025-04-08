import { getWhisperModel } from './_models';
import { errorHandler, logger, APIError } from './_utils';
import { validateAudioFile, parseFormData } from './_validation';
import { storeAudioFile, deleteAudioFile } from './storage';
import { updateStatus } from './status';
import { vertexai } from '@google-cloud/vertexai';
import axios from 'axios';

// Configuração do VertexAI
const location = process.env.VERTEX_AI_LOCATION || 'us-central1';
const project = process.env.GOOGLE_CLOUD_PROJECT;
const vertex = new vertexai({project, location});

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

    // Validate and get audio stream
    const audioStream = await validateAudioFile(audioFile);
    updateStatus(consultationId, { status: 'audio_processing', progress: 20 });

    // Transcrição com Whisper
    const whisper = await getWhisperModel();
    const transcriptionResult = await whisper(audioStream, {
      task: 'transcribe',
      language: process.env.WHISPER_LANGUAGE || 'portuguese',
      return_timestamps: true
    });
    updateStatus(consultationId, { status: 'transcribing', progress: 50 });

    // Diarização
    const diarizedText = await processDiarization(transcriptionResult);
    updateStatus(consultationId, { status: 'diarizing', progress: 70 });

    // Processamento inicial com Claude
    if (options.autoProcess) {
      // Verifica se deve usar o backend Python para análise VINTRA
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

export default errorHandler(transcribeHandler);

// Helpers mantidos do código anterior
const processDiarization = async (transcriptionResult) => {
  const segments = transcriptionResult.segments || [];
  return segments.map(segment => ({
    speaker: detectSpeaker(segment.text),
    text: segment.text,
    start: segment.start,
    end: segment.end
  }));
};

const detectSpeaker = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText.startsWith('dr:') || lowerText.startsWith('doutor:')) {
    return 'doctor';
  } else if (lowerText.startsWith('p:') || lowerText.startsWith('paciente:')) {
    return 'patient';
  }
  return 'unknown';
};

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