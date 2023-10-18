# Usa una imagen de Node.js como base
FROM node:18.20

# Instala Angular CLI y Ionic globalmente
RUN npm install -g @angular/cli@latest @ionic/cli@latest

# Cualquier otra configuración que necesites para tu aplicación

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . /app

# Instala las dependencias del proyecto
RUN npm install

# Expone los puertos necesarios para Angular e Ionic
EXPOSE 4200 8100 35729

# Comando para ejecutar tu aplicación Angular o Ionic
CMD ["ng", "serve", "--host", "0.0.0.0"]
