FROM node:18.15.0

WORKDIR /var/www/app
COPY .env ./
COPY package*.json ./

RUN npm install


COPY index.js .
CMD [ "node", "index.js" ]