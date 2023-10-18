# Usa una imagen de Node.js como base
FROM node:18-alpine

# Instala Angular CLI e Ionic globalmente
RUN npm install -g @angular/cli@latest @ionic/cli@latest

# Cualquier otra configuración que necesites para tu aplicación

# Crea un volumen para almacenar los archivos del proyecto
VOLUME /app

# Establece el directorio de trabajo en /app
WORKDIR /src

# Copia los archivos del proyecto al contenedor
COPY . /src

# Instala las dependencias del proyecto
RUN npm install

# Copia los archivos de configuración del proyecto al contenedor
COPY .env /app

# Ejecuta la aplicación Angular Ionic
CMD ["npm", "run", "start"]