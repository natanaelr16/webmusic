# Dockerfile para desarrollo con Node.js 18
FROM node:18-alpine

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache \
    git \
    curl

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Crear directorio .next con permisos correctos
RUN mkdir -p .next && chmod 777 .next

# Exponer puerto 3000
EXPOSE 3000

# Variable de entorno para desarrollo
ENV NODE_ENV=development

# Comando por defecto
CMD ["npm", "run", "dev"]