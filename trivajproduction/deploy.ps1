## deploy.ps1 - Enhanced Deployment Script for Trivaj Production (Revised 2)

# Exit on errors and show verbose output
Set-StrictMode -Version 3.0
$ErrorActionPreference = "Stop"

# Configuration
$GITHUB_REPO = "https://github.com/sadamvenugopal/trivajproduction.git"
$APP_ROOT = "C:\var\www\trivajproduction"
$BRANCH = "main"
$NODE_PORT = 3001

# Directories
$ANGULAR_DIR = "$APP_ROOT\frontend"
$NODE_DIR = "$APP_ROOT\backend"
$ICACLS_PATH = "$env:SystemRoot\System32\icacls.exe"

# ✅ 1. Admin Check - Ensure script is running as administrator
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "[ADMIN] Restarting with elevated privileges..." -ForegroundColor Cyan
    Start-Process powershell "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

# ✅ 2. Repository Setup
try {
    if (Test-Path "$APP_ROOT\.git") {
        Write-Host "[GIT] Updating repository..." -ForegroundColor Yellow
        Push-Location $APP_ROOT
        git reset --hard HEAD
        git clean -fd
        git fetch origin $BRANCH
        git checkout $BRANCH
        git pull --ff-only
        Pop-Location
    }
    else {
        Write-Host "[GIT] Cloning repository..." -ForegroundColor Green
        git clone -b $BRANCH $GITHUB_REPO $APP_ROOT
    }
}
catch {
    Write-Host "[ERROR] Git operations failed: $_" -ForegroundColor Red
    exit 1
}

# ✅ 3. Angular Deployment - Modified
try {
    Push-Location $ANGULAR_DIR

    # Check Angular directory
    if (-not (Test-Path "$ANGULAR_DIR\package.json")) {
        throw "[ERROR] package.json not found in $ANGULAR_DIR. Aborting."
    }

    # Take ownership and grant full control
    Write-Host "[PERM] Taking ownership and granting full control to Administrators..." -ForegroundColor Cyan
    # Use single quotes to prevent PowerShell interpreting "OI" and "CI"
    & $ICACLS_PATH "$ANGULAR_DIR" /grant:r Administrators:'(OI)(CI)F' /T /C | Out-Null
    # Clean environment - skip node_modules removal due to persistent EPERM issues
    Write-Host "[CLEAN] Cleaning Angular workspace (skipping node_modules)..." -ForegroundColor Cyan
    Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

    # Install dependencies with retries and explicit PATH
    Write-Host "[NPM] Installing Angular dependencies..." -ForegroundColor Cyan
    $retries = 3
    for ($i = 1; $i -le $retries; $i++) {
        try {
            # Set PATH explicitly using a robust method
            $env:Path = [Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [Environment]::GetEnvironmentVariable("PATH", "User")

            npm cache clean --force
            npm install --legacy-peer-deps --force --no-audit
            break  # If successful, exit the loop
        } catch {
            Write-Host "[WARNING] npm install failed (attempt $i of $retries): $_" -ForegroundColor Yellow
            if ($i -eq $retries) {
                throw "[ERROR] npm install failed after multiple retries."
            }
            Start-Sleep -Seconds 10  # Wait before retrying
        }
    }

    # Build process - with explicit PATH and command execution
    Write-Host "[BUILD] Compiling Angular project..." -ForegroundColor Cyan
    try {
        # Set PATH explicitly for the build process
        $env:Path = [Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [Environment]::GetEnvironmentVariable("PATH", "User")

        # Directly invoke ng build command
        & npm run build -- --configuration production --aot
    } catch {
        Write-Host "[ERROR] ng build failed: $_" -ForegroundColor Red
    }

    if (-not (Test-Path "$ANGULAR_DIR\dist")) {
        throw "[ERROR] Angular build failed - no dist directory"
    }
}
catch {
    Write-Host "[ERROR] Angular deployment failed: $_" -ForegroundColor Red
    exit 2
}
finally {
    Pop-Location
}

# ✅ 4. Node.js Deployment
try {
    Push-Location $NODE_DIR

    # Clean environment
    Write-Host "[CLEAN] Node.js workspace..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

    # Copy Angular build
    Write-Host "[COPY] Transferring build artifacts..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force "$NODE_DIR\dist" -ErrorAction SilentlyContinue
    Copy-Item -Path "$ANGULAR_DIR\dist" -Destination $NODE_DIR -Recurse

    # Install dependencies
    Write-Host "[NPM] Installing Node dependencies..." -ForegroundColor Cyan
    npm install --omit=dev --no-audit

    # PM2 setup
    Write-Host "[PM2] Configuring process manager..." -ForegroundColor Cyan
    npm install -g pm2
    pm2 delete trivaj --silent
    $nodePath = (Get-Command node).Source
    pm2 start "server.js" --name trivaj --interpreter $nodePath
    pm2 save
    pm2 startup | Out-Null
}
catch {
    Write-Host "[ERROR] Node deployment failed: $_" -ForegroundColor Red
    exit 3
}
finally {
    Pop-Location
}

# ✅ 5. Post-Deployment Verification
try {
    Write-Host "[VERIFY] Checking deployment status..." -ForegroundColor Cyan
    $pm2Status = pm2 show trivaj
    $webStatus = Invoke-WebRequest "http://localhost:$NODE_PORT" -UseBasicParsing -TimeoutSec 5

    if ($pm2Status -match "online" -and $webStatus.StatusCode -eq 200) {
        Write-Host "[SUCCESS] Deployment verified! Service running on port $NODE_PORT" -ForegroundColor Green
    }
    else {
        throw "Deployment verification failed"
    }
}
catch {
    Write-Host "[WARN] Deployment verification issues: $_" -ForegroundColor Yellow
    exit 4
}

# Final cleanup
Write-Host "[CLEANUP] Removing temporary files..." -ForegroundColor Cyan
# Skip removing node_modules
#Remove-Item -Recurse -Force "$ANGULAR_DIR\node_modules" -ErrorAction SilentlyContinue

Write-Host "[COMPLETE] Deployment process finished" -ForegroundColor Green
