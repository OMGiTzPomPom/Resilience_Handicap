FROM node:18.15.0
WORKDIR /backend
COPY /index.js package.json package-lock.json
RUN npm install
ENTRYPOINT npm run start