import { vertexai } from '@google-cloud/vertexai';
import { errorHandler, logger, APIError } from './_utils';

const location = 'us-central1';
const project = process.env.GOOGLE_CLOUD_PROJECT;
const vertex = new vertexai({project, location});

const processHandler = async (req, res) => {
  if (req.method !== 'POST') {
    throw new APIError('Method not allowed', 405);
  }

  const { transcription, documentType } = req.body;
  
  if (!transcription || !documentType) {
    throw new APIError('Missing required fields', 400, {
      details: 'Both transcription and documentType are required'
    });
  }

  try {
    logger.info('Starting document processing', { documentType });

    // Processamento com Claude via VertexAI
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

    // Gerar prompt baseado no tipo de documento
    let prompt = '';
    switch (documentType) {
      case 'soap':
        prompt = `Como um especialista em documentação médica SOAP, analise a seguinte transcrição:

${transcription}

Gere uma nota SOAP estruturada (Subjetivo, Objetivo, Avaliação, Plano) seguindo estritamente o formato:

SUBJETIVO:
[Principais queixas, histórico, sintomas relatados pelo paciente]

OBJETIVO:
[Observações clínicas, sinais vitais, exames físicos]

AVALIAÇÃO:
[Diagnósticos considerados, análise dos achados]

PLANO:
[Tratamentos propostos, medicamentos, encaminhamentos]`;
        break;

      case 'vintra':
        prompt = `Como especialista em análise VINTRA (Visualização INtegrativa TRAjetorial), analise a seguinte transcrição:

${transcription}

Forneça uma análise VINTRA completa seguindo a estrutura:

1. DIMENSÕES PSICOLÓGICAS
- Cognitivas (atenção, memória, raciocínio)
- Afetivas (humor, ansiedade, expressão emocional)
- Comportamentais (padrões de ação, respostas adaptativas)

2. PADRÕES COMUNICACIONAIS
- Dinâmica médico-paciente
- Qualidade da troca de informações
- Elementos não-verbais relevantes

3. TRAJETÓRIA DIMENSIONAL
- Estado atual nas dimensões analisadas
- Evolução observada ou relatada
- Projeção de desenvolvimento

4. RECOMENDAÇÕES INTEGRATIVAS
- Pontos de atenção específicos
- Estratégias sugeridas
- Metas terapêuticas`;
        break;

      case 'ipissima':
        prompt = `Como especialista em análise de discurso clínico, analise a seguinte transcrição:

${transcription}

Forneça uma análise Ipsissima Verba (palavras exatas) destacando:

1. ELEMENTOS LINGUÍSTICOS RELEVANTES
- Escolhas lexicais significativas
- Padrões de fala recorrentes
- Expressões emocionalmente carregadas

2. NARRATIVA DO PACIENTE
- Construção do relato
- Elementos temporais
- Auto-percepção e significados

3. INTERAÇÃO CLÍNICA
- Momentos-chave do diálogo
- Padrões de pergunta-resposta
- Negociação de significados

4. INSIGHTS CLÍNICOS
- Elementos subjetivos relevantes
- Aspectos psicológicos implícitos
- Recomendações baseadas no discurso`;
        break;

      default:
        prompt = `Como especialista em análise clínica, analise a seguinte transcrição:

${transcription}

Forneça uma análise geral incluindo:

1. RESUMO DA CONSULTA
- Principais queixas e sintomas
- Achados relevantes
- Decisões clínicas

2. ASPECTOS PSICOLÓGICOS
- Estado emocional do paciente
- Preocupações manifestadas
- Necessidades identificadas

3. RECOMENDAÇÕES
- Orientações principais
- Pontos de atenção
- Próximos passos`;
    }

    logger.info('Sending prompt to Claude', { 
      documentType,
      promptLength: prompt.length 
    });

    // Gerar conteúdo com Claude
    const result = await context.generateContent(prompt);
    const response = await result.response;
    const processedContent = response.text();

    logger.info('Document processing completed', {
      documentType,
      contentLength: processedContent.length
    });

    return res.status(200).json({
      success: true,
      content: processedContent,
      metadata: {
        model: 'claude-3-sonnet',
        type: documentType,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Document processing failed', error, { documentType });
    throw error;
  }
};

export default errorHandler(processHandler);