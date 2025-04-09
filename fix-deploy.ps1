
# VINTRA FIX DEPLOYMENT SCRIPT
# This script fixes build and deployment issues

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "VINTRA - Fix Build and Deployment Issues" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    return
}

# Clear build folders
Write-Host "`nCleaning build folders..." -ForegroundColor Yellow
if (Test-Path -Path ".\dist") {
    Remove-Item -Path ".\dist" -Recurse -Force
    Write-Host "Cleaned dist folder." -ForegroundColor Green
}

if (Test-Path -Path ".\y") {
    Remove-Item -Path ".\y" -Recurse -Force
    Write-Host "Cleaned y folder." -ForegroundColor Green
}

# Check if firebase.json is correctly configured
$firebaseJson = Get-Content -Path ".\firebase.json" | ConvertFrom-Json
if ($firebaseJson.hosting.public -ne "dist") {
    Write-Host "Fixing firebase.json configuration..." -ForegroundColor Yellow
    $firebaseJson.hosting.public = "dist"
    $firebaseJson | ConvertTo-Json -Depth 4 | Set-Content -Path ".\firebase.json"
    Write-Host "Fixed firebase.json configuration." -ForegroundColor Green
}

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
npm install

# Build the project
Write-Host "`nBuilding the project..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if (-not (Test-Path -Path ".\dist\index.html")) {
    Write-Host "Build failed! Could not find dist/index.html" -ForegroundColor Red
    return
}

# Deploy to Firebase
Write-Host "`nDeploying to Firebase..." -ForegroundColor Yellow
Write-Host "Note: You may need to login to Firebase first." -ForegroundColor Yellow

try {
    $firebaseStatus = firebase --version
    Write-Host "Firebase CLI version: $firebaseStatus" -ForegroundColor Green
} catch {
    Write-Host "Firebase CLI not found. Installing Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Login to Firebase if needed
firebase login

# Configure Firebase hosting targets
Write-Host "Configuring Firebase hosting targets..." -ForegroundColor Yellow
try {
    firebase target:apply hosting frontend vintra-project
} catch {
    Write-Host "Error setting target. Continuing with deployment..." -ForegroundColor Yellow
}

# Deploy functions first
Write-Host "Deploying backend functions..." -ForegroundColor Yellow
if (Test-Path -Path "backend") {
    Set-Location -Path "backend"
    npm install
    npm run build
    Set-Location -Path ".."
    firebase deploy --only functions
}

# Deploy hosting
Write-Host "Deploying frontend..." -ForegroundColor Yellow
firebase deploy --only hosting

Write-Host "`n==============================================" -ForegroundColor Cyan
Write-Host "VINTRA - Deployment Fix Complete" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "The site should now be accessible." -ForegroundColor Green
Write-Host "If you experience any issues, please check the Firebase console." -ForegroundColor Yellow
