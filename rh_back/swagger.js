const swaggerJsdoc = require('swagger-jsdoc');
const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'RH',
        version: '1.0.0',
      },
    },
    apis: ['./index.js'], // files containing annotations as above
  };


exports.module = swaggerJsdoc(options);