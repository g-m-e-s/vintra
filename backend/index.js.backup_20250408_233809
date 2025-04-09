const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Import Express app
const app = require('./src/server');

// Create and export the Firebase Function
exports.api = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '1GB'
  })
  .https.onRequest(app);
