# 🐳 Script para desarrollo con Docker (Windows PowerShell)
# =========================================================

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Función para mostrar ayuda
function Show-Help {
    Write-Host "🐳 Script de desarrollo con Docker para WebMusic Concert" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Uso: .\scripts\docker-dev.ps1 [COMANDO]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Comandos disponibles:" -ForegroundColor White
    Write-Host "  start    - Iniciar todos los servicios" -ForegroundColor Green
    Write-Host "  stop     - Detener todos los servicios" -ForegroundColor Red
    Write-Host "  restart  - Reiniciar todos los servicios" -ForegroundColor Yellow
    Write-Host "  build    - Construir imágenes" -ForegroundColor Blue
    Write-Host "  logs     - Ver logs de todos los servicios" -ForegroundColor Magenta
    Write-Host "  logs-app - Ver logs solo de la aplicación" -ForegroundColor Magenta
    Write-Host "  clean    - Limpiar contenedores e imágenes" -ForegroundColor Red
    Write-Host "  status   - Ver estado de los servicios" -ForegroundColor Cyan
    Write-Host "  install  - Instalar dependencias" -ForegroundColor Green
    Write-Host "  help     - Mostrar esta ayuda" -ForegroundColor White
    Write-Host ""
}

# Verificar si Docker está ejecutándose
function Check-Docker {
    try {
        docker info 2>$null | Out-Null
        return $true
    }
    catch {
        Write-Host "❌ Docker no está ejecutándose. Por favor inicia Docker Desktop." -ForegroundColor Red
        return $false
    }
}

# Funciones para cada comando
function Start-Services {
    Write-Host "ℹ️  Iniciando servicios de desarrollo..." -ForegroundColor Blue
    
    docker-compose up --build -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Servicios iniciados" -ForegroundColor Green
        Write-Host "ℹ️  Aplicación disponible en: http://localhost:3000" -ForegroundColor Blue
        Write-Host "ℹ️  PostgreSQL disponible en: localhost:5432" -ForegroundColor Blue
        Write-Host "ℹ️  Supabase Studio disponible en: http://localhost:54321" -ForegroundColor Blue
        
        Write-Host "ℹ️  Mostrando logs... (Ctrl+C para salir)" -ForegroundColor Blue
        docker-compose logs -f webmusic-frontend
    }
}

function Stop-Services {
    Write-Host "ℹ️  Deteniendo servicios..." -ForegroundColor Blue
    docker-compose down
    Write-Host "✅ Servicios detenidos" -ForegroundColor Green
}

function Restart-Services {
    Write-Host "ℹ️  Reiniciando servicios..." -ForegroundColor Blue
    docker-compose restart
    Write-Host "✅ Servicios reiniciados" -ForegroundColor Green
}

function Build-Images {
    Write-Host "ℹ️  Construyendo imágenes..." -ForegroundColor Blue
    docker-compose build --no-cache
    Write-Host "✅ Imágenes construidas" -ForegroundColor Green
}

function Show-Logs {
    docker-compose logs -f
}

function Show-App-Logs {
    docker-compose logs -f webmusic-frontend
}

function Clean-Docker {
    Write-Host "⚠️  Esto eliminará contenedores, imágenes y volúmenes de Docker" -ForegroundColor Yellow
    $response = Read-Host "¿Estás seguro? (y/N)"
    
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Host "ℹ️  Limpiando..." -ForegroundColor Blue
        docker-compose down -v --rmi all
        docker system prune -f
        Write-Host "✅ Limpieza completada" -ForegroundColor Green
    }
    else {
        Write-Host "ℹ️  Operación cancelada" -ForegroundColor Blue
    }
}

function Show-Status {
    Write-Host "ℹ️  Estado de los servicios:" -ForegroundColor Blue
    docker-compose ps
}

function Install-Dependencies {
    Write-Host "ℹ️  Instalando dependencias..." -ForegroundColor Blue
    docker-compose exec webmusic-frontend npm install
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
}

# Verificar Docker al inicio
if (-not (Check-Docker)) {
    exit 1
}

# Procesar comando
switch ($Command.ToLower()) {
    "start" { Start-Services }
    "stop" { Stop-Services }
    "restart" { Restart-Services }
    "build" { Build-Images }
    "logs" { Show-Logs }
    "logs-app" { Show-App-Logs }
    "clean" { Clean-Docker }
    "status" { Show-Status }
    "install" { Install-Dependencies }
    "help" { Show-Help }
    default {
        Write-Host "❌ Comando no reconocido: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help
        exit 1
    }
}