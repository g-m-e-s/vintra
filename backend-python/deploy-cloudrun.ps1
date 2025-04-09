# Cloud Run Deployment Script
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "VINTRA Python Backend Cloud Run Setup" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Check if gcloud CLI is installed
$gcloudInstalled = $null
try {
    $gcloudInstalled = Get-Command gcloud -ErrorAction SilentlyContinue
    if ($gcloudInstalled) {
        $gcloudVersion = (gcloud --version)[0]
        Write-Host "Google Cloud SDK version: $gcloudVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "Google Cloud SDK not found." -ForegroundColor Red
    Write-Host "Please install from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Get project ID from .firebaserc if it exists
$projectId = ""
$firebaserc = "../.firebaserc"
if (Test-Path -Path $firebaserc) {
    $firebaseConfig = Get-Content -Path $firebaserc -Raw | ConvertFrom-Json
    $projectId = $firebaseConfig.projects.default
} else {
    $projectId = Read-Host -Prompt "Enter your Google Cloud project ID"
}

# Set the project
Write-Host "Setting Google Cloud project..." -ForegroundColor Yellow
gcloud config set project $projectId

# Configure Docker to use Artifact Registry
Write-Host "Configuring Docker authentication..." -ForegroundColor Yellow
gcloud auth configure-docker us-central1-docker.pkg.dev

# Build and push the container
Write-Host "Building and pushing container..." -ForegroundColor Yellow
$region = "us-central1"
$repoName = "vintra-docker"
$imageName = "vintra-python-backend"
$imageUrl = "$region-docker.pkg.dev/$projectId/$repoName/$imageName"

# Build the image
docker build -t $imageUrl .

# Push to Artifact Registry
docker push $imageUrl

# Deploy to Cloud Run
Write-Host "Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $imageName `
    --image $imageUrl `
    --platform managed `
    --region $region `
    --allow-unauthenticated

Write-Host "Cloud Run deployment completed successfully" -ForegroundColor Green
