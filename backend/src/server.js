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

// Config
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../../.env') });

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
  app.listen(PORT, () => {
    console.log(`Development server running on port ${PORT}`);
  });
}

// Export for both Firebase Functions and ES modules
export default app;
export const api = app;
