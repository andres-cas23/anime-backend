const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🎌 Anime Characters API',
      version: '1.0.0',
      description: 'API REST para consultar personajes de Saint Seiya, Hunter x Hunter y One Piece',
    },
    servers: [
      { 
        url: 'http://localhost:3000/api', 
        description: 'Servidor local' 
      },
      { 
  url: 'https://anime-backend-pnf2.onrender.com/api', 
  description: 'Produccion Render' 
},
    ],
    tags: [
      { name: 'Auth', description: 'Autenticación de usuarios' },
      { name: 'Categorias', description: 'Operaciones con categorías de anime' },
      { name: 'Animes', description: 'Operaciones con animes' },
      { name: 'Personajes', description: 'Operaciones con personajes' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const setupSwagger = (app) => {
  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { background-color: #1a1a2e }',
    customSiteTitle: 'Anime API Docs',
  }));
};

module.exports = { setupSwagger };
