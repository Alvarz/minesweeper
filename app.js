const express = require('express');
const path = require('path');
const cors = require('cors');
const boom = require('express-boom');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const config = require('config');
const routes = require('./routes');

const app = express();

const corsOptions = {
  origin: config.get('corsAllow'),
  credentials: true,
  preflightContinue: false,
  exposedHeaders: ['x-authorization', 'x-refresh', 'Content-disposition'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(boom());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// parse application/json

app.use(express.static(path.join(__dirname, 'public')));

const swaggerDefinition = {
  openapi: '3.0.1',
  info: {
    title: 'Above Lending API docs', // Title of the documentation
    version: '0.1.0', // Version of the app
    description: 'REST API documentation', // short description of the app
  },
  servers: [{
    url: '/api', // the basepath of your endpoint
  }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      external_app_auth: {
        type: 'oauth2',
        flows: {
          clientCredentials: {
            tokenUrl: '/api/oauth/token',
          },
        },
      },
    },
  },
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./swagger/**/*.yaml'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    res.boom.internal('an error occurred');
    // res.status(500).json({ statusCode: 500, error: 'an error occurred', message: 'an error occurred' });
  }
});

module.exports = app;
