FROM node:18.15.0
WORKDIR .
COPY ./rh.backend/index.js index.js
COPY ./rh.backend/package.json package.json
RUN npm install
ENTRYPOINT npm run start