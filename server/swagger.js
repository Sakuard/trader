console.log(`import swagger.js`);
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const path = require('path');

const rootDir = path.join(__dirname);

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My APIs',
      version: '1.0.0', 
      description: 'My RESTFul APIs',
    },
    servers: [
      {url: 'http://localhost:7777', description: 'Trader server'},
      // {url: 'http://127.0.0.1:7778', description: 'Test server'},
    ],
  },
  // apis: [`${rootDir}/*.js`]
  apis: [`./*.js`,'./route/*.js']
}

const specs = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
}