const router = require('express').Router();
const { 
  getPersonajes, 
  getPersonajeByNombre, 
  getPersonajesByAnime,
  getImagenesByPersonaje 
} = require('../controllers/personajesController');

/**
 * @swagger
 * /api/personajes:
 *   get:
 *     summary: Obtiene todos los personajes
 *     tags: [Personajes]
 *     responses:
 *       200:
 *         description: Lista de todos los personajes
 */
router.get('/', getPersonajes);

/**
 * @swagger
 * /api/personajes/anime/{anime}:
 *   get:
 *     summary: Obtiene personajes por anime
 *     tags: [Personajes]
 *     parameters:
 *       - in: path
 *         name: anime
 *         required: true
 *         schema:
 *           type: string
 *         example: "Saint Seiya"
 *     responses:
 *       200:
 *         description: Lista de personajes del anime
 *       404:
 *         description: Anime no encontrado
 */
router.get('/anime/:anime', getPersonajesByAnime);

/**
 * @swagger
 * /api/personajes/{nombre}:
 *   get:
 *     summary: Busca un personaje por nombre
 *     tags: [Personajes]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         example: "Seiya"
 *       - in: query
 *         name: anime
 *         required: false
 *         schema:
 *           type: string
 *         example: "Saint Seiya"
 *     responses:
 *       200:
 *         description: Personaje encontrado
 *       404:
 *         description: Personaje no encontrado
 */
router.get('/:nombre', getPersonajeByNombre);

/**
 * @swagger
 * /api/personajes/{id}/imagenes:
 *   get:
 *     summary: Obtiene las 4 imagenes de un personaje
 *     tags: [Personajes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Imagenes del personaje
 *       404:
 *         description: Personaje no encontrado
 */
router.get('/:id/imagenes', getImagenesByPersonaje);

module.exports = router;