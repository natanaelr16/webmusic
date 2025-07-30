# 🛠️ Guía de Desarrollo - WebMusic Concert

Esta guía te ayudará a configurar y trabajar en el proyecto de manera eficiente usando diferentes entornos aislados.

## 🎯 Entornos de Desarrollo Disponibles

### 1. 🐳 Docker (Recomendado)
**Ventajas**: Entorno completamente aislado, mismo entorno en todos los equipos

```bash
# Configuración inicial
./scripts/dev-setup.sh

# Iniciar desarrollo con Docker
npm run docker:dev
# o
./scripts/docker-dev.sh start

# Comandos útiles
npm run docker:stop    # Detener servicios
npm run docker:build   # Reconstruir imágenes
npm run docker:clean   # Limpiar todo
```

### 2. 📦 VS Code Dev Containers
**Ventajas**: Integración perfecta con VS Code, extensiones preconfiguradas

```bash
# 1. Instala la extensión "Dev Containers" en VS Code
# 2. Abre el proyecto en VS Code
# 3. Presiona F1 → "Dev Containers: Reopen in Container"
# 4. ¡Listo! El entorno se configura automáticamente
```

### 3. 🔧 NVM (Node Version Manager)
**Ventajas**: Control preciso de versiones de Node.js

```bash
# Instalar la versión correcta de Node.js
nvm use

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

### 4. 📱 Node.js Local
**Ventajas**: Rápido para desarrollo local si ya tienes Node.js

```bash
# Verificar versión (debe ser 18.x)
node --version

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

## 🔧 Scripts Disponibles

### Desarrollo
```bash
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Construir para producción
npm run start            # Iniciar servidor de producción
npm run lint             # Verificar código con ESLint
npm run lint:fix         # Corregir errores de ESLint automáticamente
npm run type-check       # Verificar tipos de TypeScript
```

### Formateo de Código
```bash
npm run format           # Formatear todo el código
npm run format:check     # Verificar formato sin cambios
```

### Docker
```bash
npm run docker:dev       # Iniciar con Docker
npm run docker:stop      # Detener servicios Docker
npm run docker:build     # Reconstruir imágenes
npm run docker:clean     # Limpiar Docker completamente
```

### Configuración
```bash
npm run setup            # Configuración inicial interactiva
```

## 📁 Estructura de Archivos de Desarrollo

```
webmusic/
├── .devcontainer/           # Configuración de Dev Containers
├── .vscode/                 # Configuración de VS Code
├── scripts/                 # Scripts de desarrollo
│   ├── dev-setup.sh        # Configuración inicial
│   ├── docker-dev.sh       # Comandos Docker
│   └── init-db.sql         # Inicialización de BD
├── Dockerfile              # Imagen Docker para desarrollo
├── docker-compose.yml      # Servicios Docker
├── .nvmrc                  # Versión de Node.js
├── .prettierrc.json        # Configuración de Prettier
└── docs/                   # Documentación
```

## 🐛 Debugging

### Con VS Code
1. Abre el proyecto en VS Code
2. Ve a la pestaña "Run and Debug" (Ctrl+Shift+D)
3. Selecciona la configuración de debug que necesites:
   - "Next.js: debug server-side" - Para debugging del servidor
   - "Next.js: debug client-side" - Para debugging del cliente
   - "Next.js: debug full stack" - Para debugging completo

### Con Docker
```bash
# Abrir shell en el contenedor
./scripts/docker-dev.sh shell

# Ver logs en tiempo real
./scripts/docker-dev.sh logs-app
```

## 🔄 Workflow de Desarrollo

### 1. Configuración Inicial
```bash
# Clonar el repositorio
git clone <repo-url>
cd webmusic

# Ejecutar configuración
npm run setup
```

### 2. Desarrollo Diario
```bash
# Opción A: Con Docker
npm run docker:dev

# Opción B: Con Node.js local
npm run dev
```

### 3. Antes de Commit
```bash
# Verificar código
npm run lint
npm run type-check
npm run format:check

# Corregir automáticamente
npm run lint:fix
npm run format
```

## 🌐 URLs de Desarrollo

- **Frontend**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Supabase Studio**: http://localhost:54321
- **Supabase API**: http://localhost:54322

## 🔧 Configuración de Variables de Entorno

### Para Desarrollo Local
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Para Docker
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54322
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_local
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚨 Solución de Problemas

### Error: "Puerto 3000 ya está en uso"
```bash
# Encontrar proceso
lsof -ti:3000

# Terminar proceso
kill -9 $(lsof -ti:3000)

# O usar otro puerto
PORT=3001 npm run dev
```

### Error: "Docker no está ejecutándose"
```bash
# En Windows/Mac: Inicia Docker Desktop
# En Linux:
sudo systemctl start docker
```

### Error: "Dependencias desactualizadas"
```bash
# Limpiar caché e instalar
rm -rf node_modules package-lock.json
npm install

# Con Docker
npm run docker:clean
npm run docker:build
```

### Error: "Tipos de TypeScript"
```bash
# Regenerar tipos
rm -rf .next
npm run type-check
```

## 📚 Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Docker Compose](https://docs.docker.com/compose/)
- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)

## 🤝 Contribución

1. Usa el entorno de desarrollo aislado
2. Sigue las convenciones de código (ESLint + Prettier)
3. Escribe commits descriptivos
4. Prueba en diferentes dispositivos/navegadores
5. Actualiza documentación si es necesario

---

¿Problemas con la configuración? Contacta: natanaelr16@hotmail.com