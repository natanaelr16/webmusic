# 🎵 WebMusic Concert - Configuración de Entorno de Desarrollo (Windows)
# ================================================================

Write-Host "🎵 WebMusic Concert - Configuración de Entorno de Desarrollo" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# Función para imprimir mensajes coloreados
function Write-Status {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

# Verificar si Docker está instalado
function Check-Docker {
    try {
        $dockerVersion = docker --version 2>$null
        if ($dockerVersion) {
            Write-Status "Docker está disponible: $dockerVersion"
            
            # Verificar si Docker está ejecutándose
            try {
                docker info 2>$null | Out-Null
                Write-Status "Docker está ejecutándose"
                return $true
            }
            catch {
                Write-Error "Docker no está ejecutándose. Por favor inicia Docker Desktop."
                return $false
            }
        }
    }
    catch {
        Write-Error "Docker no está instalado. Por favor instala Docker Desktop primero."
        Write-Info "📖 Guía de instalación: https://docs.docker.com/desktop/windows/"
        return $false
    }
}

# Verificar si Node.js está instalado
function Check-Node {
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-Status "Node.js está disponible: $nodeVersion"
            
            # Verificar si npm está disponible
            $npmVersion = npm --version 2>$null
            if ($npmVersion) {
                Write-Status "npm está disponible: $npmVersion"
            }
            
            return $true
        }
    }
    catch {
        Write-Warning "Node.js no está instalado localmente"
        Write-Info "Puedes usar Docker para desarrollo o instalar Node.js"
        return $false
    }
}

# Crear archivo .env.local si no existe
function Setup-Environment {
    if (-not (Test-Path ".env.local")) {
        Write-Info "Creando archivo .env.local..."
        Copy-Item ".env.local.example" ".env.local"
        Write-Warning "Por favor actualiza .env.local con tus credenciales de Supabase"
    }
    else {
        Write-Status "Archivo .env.local ya existe"
    }
}

# Crear directorios necesarios
function Create-Directories {
    Write-Info "Creando directorios necesarios..."
    
    $directories = @("public/icons", "docs", ".vscode")
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
    }
    
    Write-Status "Directorios creados"
}

# Función principal
function Main {
    Write-Host ""
    Write-Info "Verificando dependencias del sistema..."
    
    $dockerAvailable = Check-Docker
    $nodeAvailable = Check-Node
    
    Write-Host ""
    Write-Info "Configurando proyecto..."
    
    Setup-Environment
    Create-Directories
    
    Write-Host ""
    Write-Status "¡Configuración completada!"
    Write-Host ""
    Write-Host "🚀 Opciones para ejecutar el proyecto:" -ForegroundColor Cyan
    Write-Host ""
    
    if ($dockerAvailable) {
        Write-Host "1️⃣  Con Docker (Recomendado para entorno aislado):" -ForegroundColor Yellow
        Write-Host "   docker-compose up --build" -ForegroundColor White
        Write-Host ""
    }
    
    if ($nodeAvailable) {
        Write-Host "2️⃣  Con Node.js local:" -ForegroundColor Yellow
        Write-Host "   npm install && npm run dev" -ForegroundColor White
        Write-Host ""
    }
    
    Write-Host "3️⃣  Con VS Code Dev Containers:" -ForegroundColor Yellow
    Write-Host "   Abre el proyecto en VS Code y selecciona 'Reopen in Container'" -ForegroundColor White
    Write-Host ""
    
    # Preguntar al usuario qué opción prefiere
    Write-Host "¿Qué opción prefieres usar?" -ForegroundColor Cyan
    
    $validOptions = @()
    if ($dockerAvailable) { $validOptions += "1" }
    if ($nodeAvailable) { $validOptions += "2" }
    $validOptions += @("3", "4")
    
    Write-Host "Opciones disponibles: $($validOptions -join ', '), 4 (salir)" -ForegroundColor Gray
    
    do {
        $choice = Read-Host "Opción"
    } while ($choice -notin $validOptions -and $choice -ne "4")
    
    switch ($choice) {
        "1" {
            if ($dockerAvailable) {
                Write-Info "Iniciando con Docker..."
                docker-compose up --build
            }
        }
        "2" {
            if ($nodeAvailable) {
                Write-Info "Iniciando con Node.js local..."
                npm install
                npm run dev
            }
        }
        "3" {
            Write-Info "Para usar Dev Containers:"
            Write-Info "1. Abre VS Code"
            Write-Info "2. Instala la extensión 'Dev Containers'"
            Write-Info "3. Abre este proyecto"
            Write-Info "4. Presiona F1 y busca 'Dev Containers: Reopen in Container'"
        }
        "4" {
            Write-Info "Puedes ejecutar manualmente cualquiera de los comandos mostrados arriba."
        }
        default {
            Write-Warning "Opción no válida. Puedes ejecutar manualmente cualquiera de los comandos mostrados arriba."
        }
    }
}

# Ejecutar función principal
Main