const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { setupSwagger } = require('./src/docs/swagger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger
setupSwagger(app);

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/categorias', require('./src/routes/categorias'));
app.use('/api/animes', require('./src/routes/animes'));
app.use('/api/personajes', require('./src/routes/personajes'));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '🎌 Anime API running!',
    endpoints: {
      auth: '/api/auth',
      categorias: '/api/categorias',
      animes: '/api/animes',
      personajes: '/api/personajes',
      swagger: '/api-docs'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server corriendo en http://localhost:${PORT}`);
  console.log(`📚 Swagger en http://localhost:${PORT}/api-docs`);
});