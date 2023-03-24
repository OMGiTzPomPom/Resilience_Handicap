FROM node:18.15.0
WORKDIR /backend
COPY /backend/index.js index.js
COPY /backend/package.json package.json 
COPY /backend/package-lock.json package-lock.json
RUN npm install
ENTRYPOINT npm run start