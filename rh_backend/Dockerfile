FROM node:18.15.0
WORKDIR .
COPY ./index.js index.js
COPY ./package.json package.json
RUN npm install
ENTRYPOINT npm run start