# VINTRA Deployment Guide

This document outlines the deployment process for the VINTRA application, which consists of three main components:

1. **Frontend**: React application deployed to Firebase Hosting
2. **Node.js Backend**: API deployed as Firebase Functions
3. **Python Backend**: Advanced processing deployed to Google Cloud Run

## Prerequisites

- Firebase CLI: `npm install -g firebase-tools`
- Google Cloud SDK: [Installation Guide](https://cloud.google.com/sdk/docs/install)
- Node.js and npm
- Python 3.8+
- Docker (for Cloud Run deployments)

## Setup

1. **Firebase Project Setup**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable necessary services (Hosting, Functions, Firestore)
   - Initialize Firebase in the project: `firebase init`

2. **Google Cloud Setup**:
   - Enable required APIs:
     ```
     gcloud services enable cloudbuild.googleapis.com
     gcloud services enable run.googleapis.com
     gcloud services enable artifactregistry.googleapis.com
     gcloud services enable aiplatform.googleapis.com
     ```
   - Set up service account credentials

## Environment Configuration

1. **Production Environment**:
   - Update `.env.production` with your project-specific values
   - Set the correct `VITE_PYTHON_API_URL` after deploying the Python backend

## Deployment Process

### Automated Deployment

The simplest way to deploy all components is to use the provided script:

```
./deploy-all.ps1
```

This script will:
- Build the frontend
- Deploy to Firebase Hosting
- Deploy Node.js backend to Firebase Functions
- Deploy Python backend to Cloud Run

### Manual Deployment

#### Frontend Deployment

1. Build the frontend:
   ```
   npm install
   npm run build
   ```

2. Deploy to Firebase Hosting:
   ```
   firebase deploy --only hosting
   ```

#### Node.js Backend Deployment

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build and deploy:
   ```
   npm run deploy
   ```

#### Python Backend Deployment

1. Navigate to the backend-python directory:
   ```
   cd backend-python
   ```

2. Deploy to Cloud Run:
   ```
   ./deploy-cloudrun.ps1
   ```

## Verifying Deployment

After deployment, visit these URLs to verify:

- Frontend: `https://your-project-id.web.app`
- Backend API: `https://your-project-id.web.app/api/health`
- Python Backend: `https://vintra-python-backend-{projectID}.a.run.app/health`

## Troubleshooting

### Common Issues

1. **Website Not Loading**:
   - Check Firebase Hosting deployment status
   - Verify correct project configuration in `.firebaserc`
   - Check for console errors in browser developer tools

2. **API Connection Failures**:
   - Verify the `VITE_API_URL` in environment files
   - Check Firebase Functions deployment status
   - Examine function logs in Firebase Console

3. **Python Backend Issues**:
   - Verify Cloud Run service is running
   - Check logs in Google Cloud Console
   - Ensure the URL is correctly set in `.env.production`

### Fixing Failed Deployments

If deployment fails, try:

1. Running `./fix-deploy.ps1` to clean up and redeploy
2. Checking logs for specific error messages
3. Verifying all required APIs are enabled
4. Ensuring proper permissions for your Google Cloud account

## Maintenance

- Regularly check the Firebase Console and Google Cloud Console for service health
- Monitor function logs for errors
- Keep dependencies updated in all components

