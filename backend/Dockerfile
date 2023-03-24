FROM node:18.15.0
WORKDIR /backend
COPY index.js index.js
COPY package.json package.json 
COPY package-lock.json package-lock.json
RUN npm install
ENTRYPOINT npm run start