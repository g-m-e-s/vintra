# VINTRA Complete Deployment Script
# This script orchestrates the deployment of all VINTRA components to Google Cloud/Firebase

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "VINTRA Complete Deployment Setup" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Check if Firebase CLI is installed
$firebaseInstalled = $null
try {
    $firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue
    if ($firebaseInstalled) {
        $firebaseVersion = (firebase --version) 2>&1
        Write-Host "Firebase CLI version: $firebaseVersion" -ForegroundColor Green
        
        # Update if needed
        Write-Host "Checking for Firebase CLI updates..." -ForegroundColor Yellow
        npm update -g firebase-tools
    }
} catch {
    Write-Host "Error checking Firebase CLI: $_" -ForegroundColor Red
    Write-Host "Installing Firebase CLI..." -ForegroundColor Yellow
    try {
        npm install -g firebase-tools
        if (-not $?) { throw "Failed to install Firebase CLI" }
    } catch {
        Write-Host "Failed to install Firebase CLI: $_" -ForegroundColor Red
        Write-Host "Please install Firebase CLI manually: npm install -g firebase-tools" -ForegroundColor Yellow
        return
    }
}

# Check if gcloud CLI is installed
$gcloudInstalled = $null
try {
    $gcloudInstalled = Get-Command gcloud -ErrorAction SilentlyContinue
} catch {
    # Command not found, continue with installation
}

if (-not $gcloudInstalled) {
    Write-Host "Google Cloud SDK not found. Please install it first:" -ForegroundColor Red
    Write-Host "https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    Write-Host "After installation, run 'gcloud init' to initialize." -ForegroundColor Yellow
    return
}

# Login to services
Write-Host "Logging in to Firebase..." -ForegroundColor Yellow
firebase login

Write-Host "Logging in to Google Cloud..." -ForegroundColor Yellow
gcloud auth login

# Ask for project ID
$projectId = Read-Host -Prompt "Enter your Firebase/GCP project ID"

# Set the active project in GCP
Write-Host "Setting active project to $projectId in Google Cloud..." -ForegroundColor Yellow
gcloud config set project $projectId

# Enable required APIs
Write-Host "Enabling required Google Cloud APIs..." -ForegroundColor Yellow
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable firestore.googleapis.com

# Install frontend dependencies and build
Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "Building Frontend..." -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
npm install
npm run build

# Deploy frontend to Firebase
Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "Deploying Frontend to Firebase..." -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
./firebase-deploy.ps1

# Setup and deploy Firebase Functions for Node.js backend
Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "Setting up and deploying Node.js Backend..." -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Set-Location -Path "backend"
./firebase-functions.ps1
Set-Location -Path ".."

# Build and deploy Python backend to Cloud Run
Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "Building and deploying Python Backend..." -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Set-Location -Path "backend-python"
./deploy-cloudrun.ps1
Set-Location -Path ".."

Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "VINTRA Deployment Setup Complete!" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Your application has been built and deployed successfully." -ForegroundColor Green
