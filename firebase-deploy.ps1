# VINTRA Firebase Deployment Script
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "VINTRA Firebase Deployment Setup" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

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

# Check if Firebase CLI is installed
$firebaseInstalled = $null
try {
    $firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue
    if ($firebaseInstalled) {
        $firebaseVersion = (firebase --version) 2>&1
        Write-Host "Firebase CLI version: $firebaseVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "Firebase CLI not found. Installing Firebase CLI..." -ForegroundColor Yellow
    try {
        npm install -g firebase-tools
        if (-not $?) { throw "Failed to install Firebase CLI" }
    } catch {
        Write-Host "Failed to install Firebase CLI: $_" -ForegroundColor Red
        Write-Host "Please install Firebase CLI manually: npm install -g firebase-tools" -ForegroundColor Yellow
        return
    }
}

# Login to Firebase
Write-Host "Logging in to Firebase..." -ForegroundColor Yellow
try {
    firebase login
    if (-not $?) { throw "Failed to login to Firebase" }
} catch {
    Write-Host "Failed to login to Firebase: $_" -ForegroundColor Red
    return
}

# Initialize Firebase in the project
Write-Host "Initializing Firebase in your project..." -ForegroundColor Yellow
try {
    firebase init hosting functions firestore storage
    if (-not $?) { throw "Failed to initialize Firebase project" }
} catch {
    Write-Host "Failed to initialize Firebase project: $_" -ForegroundColor Red
    return
}

# Install project dependencies
Write-Host "`nInstalling project dependencies..." -ForegroundColor Yellow
try {
    npm ci
    if (-not $?) { throw "Failed to install dependencies" }
} catch {
    Write-Host "Failed to install dependencies: $_" -ForegroundColor Red
    Write-Host "Trying npm install instead..." -ForegroundColor Yellow
    try {
        npm install
        if (-not $?) { throw "Failed to install dependencies" }
    } catch {
        Write-Host "Failed to install dependencies: $_" -ForegroundColor Red
        return
    }
}

Write-Host "`nBuilding the project..." -ForegroundColor Yellow
npm run build

# Deploy to Firebase
Write-Host "Deploying to Firebase..." -ForegroundColor Yellow
firebase deploy --only hosting
if (-not $?) {
    Write-Host "Firebase deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host "`nFirebase deployment setup complete! Your application is ready for Firebase Hosting." -ForegroundColor Cyan
