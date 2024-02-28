console.log(`import swagger.js`);
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
require('dotenv').config();
const config = process.env;

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: `Trader`,
      version: '1.0.0', 
      description: 'RESTFul APIs Document',
    },
    servers: [
      {url: `https://${config.HOST}:${config.PORT}`, description: 'Trader server'},
    ],
  },
  apis: [`./*.js`,'./route/*.js']
}

const specs = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
}