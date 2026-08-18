# ─── Etapa de Construcción y Ejecución ──────────────────────────────────────────
# Imagen base oficial y ligera de Node.js (Alpine Linux)
FROM node:20-alpine

# Crear y establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de manifiesto de dependencias
COPY package*.json ./

# Instalar dependencias de producción de forma limpia
RUN npm ci --only=production

# Copiar el código fuente y carpetas necesarias
COPY src ./src
RUN mkdir -p uploads

# Crear directorio para almacenamiento de logs
RUN mkdir -p logs

# Exponer el puerto en el que escucha la API
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar la aplicación
CMD ["node", "src/server.js"]
