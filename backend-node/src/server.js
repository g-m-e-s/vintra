import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import axios from 'axios';

// Handlers
import transcribeHandler from './api/transcribe.js';
import processHandler from './api/process.js';
import healthHandler from './api/health.js';
import statusHandler from './api/status.js';

// Config
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/transcribe', transcribeHandler);
app.post('/api/process', processHandler);
app.get('/api/status/:id', statusHandler);
app.get('/api/health', healthHandler);

// Proxy para o backend Python
app.all('/api/python/*', async (req, res) => {
  try {
    const pythonPath = req.path.replace('/api/python', '');
    const pythonUrl = `${PYTHON_API_URL}${pythonPath}`;
    
    const response = await axios({
      method: req.method,
      url: pythonUrl,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        // Encaminhar headers de autenticação, se existirem
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
      },
      params: req.query
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erro ao encaminhar requisição para o backend Python:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Erro ao processar requisição no backend Python',
      details: error.response?.data || error.message
    });
  }
});

// Local development server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Development server running on port ${PORT}`);
    console.log(`Python backend proxy configurado para: ${PYTHON_API_URL}`);
  });
}

// Para deploy na Vercel
export default app;