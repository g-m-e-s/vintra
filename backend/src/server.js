<<<<<<< HEAD
﻿const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
=======
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
>>>>>>> parent of ea861c8 (commit to deploy)

// Handlers
const transcribeHandler = require('./api/transcribe');
const processHandler = require('./api/process');
const healthHandler = require('./api/health');
const statusHandler = require('./api/status');

// Config
dotenv.config({ path: path.join(__dirname, '../../.env') });

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

<<<<<<< HEAD
// Export for Firebase Functions
module.exports = app;
=======
// Para deploy na Vercel
export default app;
>>>>>>> parent of ea861c8 (commit to deploy)
