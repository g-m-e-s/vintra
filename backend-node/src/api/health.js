import { getWhisperModel } from './_models';
import { errorHandler, logger } from './_utils';
import { vertexai } from '@google-cloud/vertexai';
import axios from 'axios';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

const healthHandler = async (_req, res) => {
  const status = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      whisper: false,
      vertexai: false,
      python_backend: false
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

  try {
    // Verificar Backend Python
    const pythonResponse = await axios.get(`${PYTHON_API_URL}/health`, { timeout: 5000 });
    status.services.python_backend = pythonResponse.status === 200 && pythonResponse.data?.status === 'healthy';
  } catch (error) {
    logger.error('Python backend health check failed', error);
    status.services.python_backend = false;
    status.status = 'degraded';
  }

  // Se algum serviço estiver down, retorna 503
  const statusCode = status.status === 'ok' ? 200 : 503;
  return res.status(statusCode).json(status);
};

export default errorHandler(healthHandler);