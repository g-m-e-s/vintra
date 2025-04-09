# VINTRA Firebase Functions Configuration Script
# This script configures the backend to run as Firebase Functions

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "VINTRA Firebase Functions Setup" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Check current directory
$currentDir = Split-Path -Path (Get-Location) -Leaf
if ($currentDir -ne "backend") {
    Write-Warning "This script should be run from the 'backend' directory!"
    Write-Host "Changing to backend directory..." -ForegroundColor Yellow
    try {
        Set-Location -Path "backend"
    } catch {
        Write-Host "Failed to change to backend directory: $_" -ForegroundColor Red
        return
    }
}

# Function to backup a file with timestamp
function Backup-File {
    param (
        [string]$FilePath
    )
    if (Test-Path -Path $FilePath) {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupPath = "$FilePath.backup_$timestamp"
        try {
            Copy-Item -Path $FilePath -Destination $backupPath -Force
            Write-Host "Created backup at $backupPath" -ForegroundColor Green
            return $true
        } catch {
            Write-Host "Failed to create backup of $FilePath : $_" -ForegroundColor Red
            return $false
        }
    }
    return $true
}

# Create backups
Write-Host "Creating backups of existing configuration files..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

if (Test-Path "package.json") {
    Copy-Item "package.json" "package.json.backup_$timestamp"
    Write-Host "Created backup at package.json.backup_$timestamp" -ForegroundColor Green
}

# Install dependencies one by one
Write-Host "Installing required dependencies..." -ForegroundColor Yellow
npm install firebase-admin --save
npm install firebase-functions --save
npm install typescript --save-dev
npm install @types/node --save-dev

Write-Host "Dependencies installed successfully" -ForegroundColor Green

# Check for required dependencies in package.json
function Test-Dependencies {
    param (
        [string]$PackageJsonPath
    )
    
    if (-not (Test-Path -Path $PackageJsonPath)) {
        return $false
    }
    
    $packageJson = Get-Content -Path $PackageJsonPath -Raw | ConvertFrom-Json
    $requiredDeps = @(
        'firebase-admin',
        'firebase-functions',
        'express'
    )
    
    $missingDeps = @()
    foreach ($dep in $requiredDeps) {
        if (-not $packageJson.dependencies.$dep) {
            $missingDeps += $dep
        }
    }
    
    return $missingDeps
}

# Backup existing files
Write-Host "Creating backups of existing configuration files..." -ForegroundColor Yellow
$filesToBackup = @(
    "package.json",
    "src/server.js",
    "index.js"
)

$backupSuccess = $true
foreach ($file in $filesToBackup) {
    if (-not (Backup-File -FilePath $file)) {
        $backupSuccess = $false
        break
    }
}

if (-not $backupSuccess) {
    Write-Host "Failed to create backups. Aborting setup." -ForegroundColor Red
    return
}

# Check and install required dependencies
Write-Host "Checking required dependencies..." -ForegroundColor Yellow
$missingDeps = Test-Dependencies -PackageJsonPath "package.json"
if ($missingDeps.Count -gt 0) {
    Write-Host "Installing missing dependencies: $($missingDeps -join ', ')" -ForegroundColor Yellow
    try {
        npm install --save $missingDeps
        if (-not $?) { throw "Failed to install dependencies" }
    } catch {
        Write-Host "Failed to install dependencies: $_" -ForegroundColor Red
        return
    }
}

# Create/Update package.json
Write-Host "Updating package.json configuration..." -ForegroundColor Yellow
$packageJsonContent = Get-Content -Path "package.json" -Raw | ConvertFrom-Json

# Create empty objects if they don't exist
if (-not $packageJsonContent.PSObject.Properties['engines']) {
    $packageJsonContent | Add-Member -NotePropertyName "engines" -NotePropertyValue @{} -Force
}
$packageJsonContent.engines = @{ "node" = "18" }

if (-not $packageJsonContent.PSObject.Properties['scripts']) {
    $packageJsonContent | Add-Member -NotePropertyName "scripts" -NotePropertyValue @{} -Force
}

# Add scripts
$packageJsonContent.scripts | Add-Member -NotePropertyName "serve" -NotePropertyValue "npm run build && firebase emulators:start --only functions" -Force
$packageJsonContent.scripts | Add-Member -NotePropertyName "build" -NotePropertyValue "tsc" -Force
$packageJsonContent.scripts | Add-Member -NotePropertyName "deploy" -NotePropertyValue "npm run build && firebase deploy --only functions" -Force
$packageJsonContent.scripts | Add-Member -NotePropertyName "test" -NotePropertyValue "jest" -Force

# Convert back to JSON and write to file
$packageJsonContent | ConvertTo-Json -Depth 10 | Out-File -FilePath "package.json" -Encoding utf8

# Create tsconfig.json if it doesn't exist
$tsconfigContent = @"
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "target": "es2017",
    "skipLibCheck": true
  },
  "compileOnSave": true,
  "include": [
    "src"
  ]
}
"@

if (-not (Test-Path "tsconfig.json")) {
    $tsconfigContent | Out-File -FilePath "tsconfig.json" -Encoding utf8
    Write-Host "Created tsconfig.json configuration" -ForegroundColor Green
}

# Validate Firebase project
$firebaserc = "../.firebaserc"
if (-not (Test-Path -Path $firebaserc)) {
    Write-Host "Firebase project not initialized in parent directory!" -ForegroundColor Red
    Write-Host "Please run the main firebase-deploy.ps1 script first." -ForegroundColor Yellow
    return
}

# Read the project ID from .firebaserc
$firebaseConfig = Get-Content -Path $firebaserc -Raw | ConvertFrom-Json
$projectId = $firebaseConfig.projects.default

# Update server.js for Firebase Functions
Write-Host "Updating server.js for Firebase Functions compatibility..." -ForegroundColor Yellow
$serverJsPath = "src/server.js"
if (Test-Path -Path $serverJsPath) {
    $serverContent = Get-Content -Path $serverJsPath -Raw
    if (-not ($serverContent -match "module.exports = app")) {
        $updatedContent = $serverContent
        if ($serverContent -match "app.listen\(.*\)") {
            $updatedContent = $serverContent -replace "app.listen\(.*\)", "// Firebase Functions handle the listening"
        }
        
        # Ensure we export the app for Firebase Functions
        if ($updatedContent -match "export default app") {
            $updatedContent = $updatedContent -replace "export default app", "module.exports = app"
        } else {
            $updatedContent += "`n// Export for Firebase Functions`nmodule.exports = app;"
        }
        
        try {
            $updatedContent | Out-File -FilePath $serverJsPath -Encoding utf8
            Write-Host "Updated server.js successfully" -ForegroundColor Green
        } catch {
            Write-Host "Failed to update server.js: $_" -ForegroundColor Red
            return
        }
    }
}

# Create index.js for Firebase Functions
Write-Host "Creating/Updating index.js for Firebase Functions..." -ForegroundColor Yellow
$indexJs = @"
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
"@

try {
    $indexJs | Out-File -FilePath "index.js" -Encoding utf8
    Write-Host "Created/Updated index.js successfully" -ForegroundColor Green
} catch {
    Write-Host "Failed to create/update index.js: $_" -ForegroundColor Red
    return
}

# Create/Update .env.firebase
Write-Host "Creating .env.firebase for environment configurations..." -ForegroundColor Yellow
$envFirebase = @"
# Firebase Environment Configuration
GOOGLE_CLOUD_PROJECT=$projectId
VERTEXAI_LOCATION=us-central1
FIRESTORE_EMULATOR_HOST=localhost:8080
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
FUNCTIONS_EMULATOR=true
"@

try {
    $envFirebase | Out-File -FilePath ".env.firebase" -Encoding utf8
    Write-Host "Created .env.firebase configuration" -ForegroundColor Green
} catch {
    Write-Host "Failed to create .env.firebase: $_" -ForegroundColor Red
}

Write-Host "Building TypeScript files..." -ForegroundColor Yellow
npm run build

Write-Host "`nDeploying functions..." -ForegroundColor Yellow
npm run deploy

# Instructions for next steps
Write-Host "`nFirebase Functions setup completed!" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor White
Write-Host "1. Deploy your functions to Firebase:" -ForegroundColor Yellow
Write-Host "   npm run deploy" -ForegroundColor White
Write-Host "2. Test your functions locally:" -ForegroundColor Yellow
Write-Host "   npm run serve" -ForegroundColor White
Write-Host "3. Access your functions at:" -ForegroundColor Yellow
Write-Host "   https://$projectId.web.app/api" -ForegroundColor White
