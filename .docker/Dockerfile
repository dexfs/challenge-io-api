FROM node:12.13
EXPOSE 3333

WORKDIR /var/www/app

COPY package*.json ./

RUN npm install

COPY . /app
