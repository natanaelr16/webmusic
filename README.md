# WebMusic Concert - Frontend

Sistema de venta de boletas para conciertos desarrollado con Next.js y Supabase.

## 🚀 Características

- **Página de Landing**: Información del concierto con diseño moderno
- **Sistema de Compra**: Formulario simple (email + cantidad) conectado a Edge Functions
- **Autenticación**: Login automático post-compra con Supabase Auth
- **Gestión de Boletas**: Vista de boletas digitales con códigos QR
- **PWA de Validación**: App para escanear y validar boletas en el evento
- **Diseño Responsive**: Optimizado para móviles, tablets y desktop

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database/Auth**: Supabase
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **QR Generation**: react-qr-code
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router pages
├── components/
│   ├── pages/             # Page components
│   ├── forms/             # Form components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── hooks/             # Custom hooks
│   ├── providers/         # Context providers
│   ├── supabase.ts        # Supabase client & API
│   └── utils.ts           # Utility functions
└── styles/
    └── globals.css        # Global styles
```

## ⚡ Instalación y Desarrollo

### 🚀 Opción 1: Setup Automático (Recomendado)

#### Windows 🪟
```cmd
# Opción A: Doble clic en el archivo
setup-windows.cmd

# Opción B: En PowerShell/CMD
npm run setup
```

#### Linux/Mac 🐧🍎
```bash
# Configuración inicial interactiva
npm run setup:linux
```

**El script te guiará para elegir el mejor entorno:**
1. Docker (Recomendado - Entorno aislado)
2. Node.js local
3. VS Code Dev Containers
4. NVM (Node Version Manager)

### 🐳 Opción 2: Docker (Entorno Aislado)
```bash
# Iniciar con Docker (incluye PostgreSQL y Supabase local)
npm run docker:dev

# Detener servicios
npm run docker:stop

# Limpiar todo si necesitas empezar de cero
npm run docker:clean
```

### 💻 Opción 3: Desarrollo Local
```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir en el navegador: http://localhost:3000
```

### 📦 Opción 4: VS Code Dev Containers
1. Instala la extensión "Dev Containers" en VS Code
2. Abre el proyecto en VS Code
3. Presiona F1 → "Dev Containers: Reopen in Container"
4. ¡Listo! El entorno se configura automáticamente

## 🔗 Rutas Principales

- `/` - Landing page del concierto
- `/login` - Página de inicio de sesión
- `/mis-boletas` - Vista de boletas del usuario (protegida)
- `/pago-exitoso` - Página de confirmación de pago
- `/pago-fallido` - Página de error de pago
- `/validar` - PWA de validación de boletas

## 🔧 Integración con Backend

Este frontend está diseñado para trabajar con las siguientes Edge Functions de Supabase:

### ✅ Implementadas (Según documentación)
1. **`iniciar-compra`**: ✅ **YA DESPLEGADA**
   - Input: `{ email, cantidad, concierto_id }`
   - Output: `{ payment_link }`
   - Estado: Funcional con link de pago simulado

### ⏳ Pendientes de implementar
2. **`get_precio_actual`**: RPC Function para calcular precio dinámico
   - Input: `{ concierto_id }`
   - Output: `65000` o `85000` (según fecha de preventa)

3. **`validar-boleta`**: Validación de boletas en el evento
   - Input: `{ qr_content }`
   - Output: `{ valid, ticket, message }`

4. **`procesar-pago-webhook`**: Procesa confirmaciones de pago
   - Webhook automático desde la pasarela de pagos
   - Crea boletas y envía PDFs por email

📖 **Guía completa de integración**: [docs/BACKEND-INTEGRATION.md](docs/BACKEND-INTEGRATION.md)

## 🎨 Características de Diseño

- **Colores**: Gradientes púrpura/azul para música y creatividad
- **Tipografía**: Inter para legibilidad moderna
- **Animaciones**: Micro-interacciones con Framer Motion
- **Responsive**: Mobile-first design
- **Accesibilidad**: Contraste adecuado y navegación por teclado

## 📱 PWA (Progressive Web App)

La aplicación incluye funcionalidades PWA para la validación de boletas:

- **Instalable**: Puede instalarse como app nativa
- **Offline Ready**: Funcionalidad básica sin conexión
- **Cámara**: Acceso a cámara para escaneo QR
- **Manifest**: Configuración completa de PWA

## 🔒 Seguridad

- **Row Level Security**: Implementado en Supabase
- **Validación**: Formularios validados con React Hook Form
- **Sanitización**: Inputs sanitizados antes de envío
- **HTTPS**: Requerido en producción

## 🚀 Deployment

### Vercel (Recomendado)

1. **Conectar repositorio**: Importa desde GitHub/GitLab
2. **Variables de entorno**: Configura en el dashboard de Vercel
3. **Deploy**: Automático en cada push a main

### Variables de Entorno en Producción

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_produccion
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_produccion
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

## 📊 Flujo de Usuario

1. **Descubrimiento**: Usuario visita landing page
2. **Compra**: Llena formulario (email + cantidad)
3. **Pago**: Redirigido a pasarela de pagos
4. **Confirmación**: Regresa a página de éxito/fallo
5. **Acceso**: Login para ver boletas digitales
6. **Evento**: Personal usa PWA para validar entrada

## 🔄 Estado de Desarrollo

### ✅ Frontend Completado

- [X] Configuración del proyecto Next.js con Docker
- [X] Página de landing responsive con datos mock
- [X] Formulario de compra conectado a Edge Function
- [X] Sistema de autenticación con Supabase Auth
- [X] Páginas de estado de pago (éxito/fallo)
- [X] Vista de boletas de usuario con RLS
- [X] PWA de validación con escaneo QR
- [X] Integración completa con APIs del backend
- [X] Comentarios detallados para el equipo de backend
- [X] Entorno de desarrollo aislado con Docker

### ⏳ Esperando Backend

- [ ] Función RPC `get_precio_actual` 
- [ ] Edge Function `validar-boleta`
- [ ] Edge Function `procesar-pago-webhook`
- [ ] Datos reales en tabla `conciertos`

### 🔄 Por Completar Juntos

- [ ] Testing de integración frontend-backend
- [ ] Configuración de URLs de retorno de pasarela
- [ ] Testing end-to-end completo
- [ ] Deploy a producción

### 📝 Documentación Disponible

- [X] **[Guía de Desarrollo](docs/DEVELOPMENT.md)** - Entornos y workflow
- [X] **[Guía de Contenedores](docs/CONTAINERS-GUIDE.md)** - Docker explicado
- [X] **[Integración Backend](docs/BACKEND-INTEGRATION.md)** - APIs y conexiones

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 🎯 Próximos Pasos para Integración

### Para el Equipo de Backend:
1. **Implementar función RPC**: `get_precio_actual` para precios dinámicos
2. **Crear datos de prueba**: Insertar registro real en tabla `conciertos`
3. **Descomentar en frontend**: Líneas 31-32 en `LandingPage.tsx`
4. **Testing conjunto**: Probar flujo completo de compra

### Para Testing:
```bash
# 1. Iniciar entorno de desarrollo
npm run setup

# 2. Verificar conexión con backend
# Abrir DevTools Console y buscar logs: 🎵 🔄 📡 ✅

# 3. Probar flujo de compra
# Landing → Comprar Boletas → Llenar formulario → Ver logs
```

## 📞 Soporte

Para soporte técnico o preguntas:

- **Email**: natanaelr16@hotmail.com
- **Documentación**: Ver archivos en `/docs/`
- **Issues**: Reportar problemas en el repositorio

## 📚 Recursos Útiles

- **[Guía de Desarrollo](docs/DEVELOPMENT.md)** - Entornos de trabajo y comandos
- **[Guía de Docker](docs/CONTAINERS-GUIDE.md)** - Contenedores explicados paso a paso  
- **[Integración Backend](docs/BACKEND-INTEGRATION.md)** - APIs, endpoints y testing
- **[Setup Windows](docs/WINDOWS-SETUP.md)** - 🪟 Configuración específica para Windows

---

**✨ El frontend está listo y completamente documentado. Solo faltan las conexiones finales con el backend para tener el sistema completo funcionando.**
