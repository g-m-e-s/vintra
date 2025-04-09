import express from 'express';
import cors from 'cors';
import { processRouter } from './api/process';
import { statusRouter } from './api/status';
import { healthRouter } from './api/health';
import { storageRouter } from './api/storage';
import { transcribeRouter } from './api/transcribe';

declare module './process' {
  export const processRouter: any;
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/process', processRouter);
app.use('/api/status', statusRouter);
app.use('/api/health', healthRouter);
app.use('/api/storage', storageRouter);
app.use('/api/transcribe', transcribeRouter);

// Export for Firebase Functions
module.exports = app;