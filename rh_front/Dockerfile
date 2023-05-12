FROM node:18.15.0

WORKDIR /var/www/app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "dev" ]
