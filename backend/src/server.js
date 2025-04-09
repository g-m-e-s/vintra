import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Handlers
import transcribeHandler from './api/transcribe.js';
import processHandler from './api/process.js';
import healthHandler from './api/health.js';
import statusHandler from './api/status.js';
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

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/transcribe', transcribeHandler);
app.post('/api/process', processHandler);
app.get('/api/status/:id', statusHandler);
app.get('/api/health', healthHandler);

// Local development server
if (process.env.NODE_ENV !== 'production') {
  // Firebase Functions handle the listening => {
    console.log(`Development server running on port ${PORT}`);
  });
}

// Para deploy na Vercel
module.exports = app;
