FROM node:18-alpine

# Instala las dependencias de NodeJS
RUN npm install -g @ionic/cli

# Copia el código del proyecto al contenedor
COPY . /app

# Instala las dependencias de Angular
RUN cd /app && npm install

# Compila la aplicación Angular
RUN cd /app && ionic build

# Ejecuta la aplicación
CMD ["ionic", "serve"]
