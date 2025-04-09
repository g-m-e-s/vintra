const { getWhisperModel } = require('./_models');
const { errorHandler, logger } = require('./_utils');
const { vertexai } = require('@google-cloud/vertexai');

const healthHandler = async (_req, res) => {
  const status = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      whisper: false,
      vertexai: false
    }
  };

  try {
    // Verificar Whisper
    const whisper = await getWhisperModel();
    status.services.whisper = !!whisper;
  } catch (error) {
    logger.error('Whisper health check failed', error);
    status.services.whisper = false;
    status.status = 'degraded';
  }

  try {
    // Verificar VertexAI
    const location = process.env.VERTEX_AI_LOCATION || 'us-central1';
    const project = process.env.GOOGLE_CLOUD_PROJECT;
    const vertex = new vertexai({project, location});
    
    // Tenta inicializar o modelo
    const model = vertex.preview.getGenerativeModel({
      model: 'claude-3-sonnet'
    });
    
    status.services.vertexai = !!model;
  } catch (error) {
    logger.error('VertexAI health check failed', error);
    status.services.vertexai = false;
    status.status = 'degraded';
  }

  // Se algum serviço estiver down, retorna 503
  const statusCode = status.status === 'ok' ? 200 : 503;
  return res.status(statusCode).json(status);
};

module.exports = errorHandler(healthHandler);