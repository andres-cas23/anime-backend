const router = require('express').Router();
const { 
  getPersonajes, 
  getPersonajeByNombre, 
  getPersonajesByAnime,
  getImagenesByPersonaje,
  crearPersonaje,
  actualizarPersonaje,
  eliminarPersonaje
} = require('../controllers/personajesController');
const { verificarToken } = require('../middlewares/auth');

/**
 * @swagger
 * /personajes:
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
 * /personajes/anime/{anime}:
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
 * /personajes/{nombre}:
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
 * /personajes/{id}/imagenes:
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

/**
 * @swagger
 * /personajes:
 *   post:
 *     summary: Crear un nuevo personaje con imágenes
 *     tags: [Personajes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               edad:
 *                 type: integer
 *               poder:
 *                 type: string
 *               anime_id:
 *                 type: integer
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["url1", "url2", "url3", "url4"]
 *     responses:
 *       201:
 *         description: Personaje creado correctamente
 */
router.post('/', verificarToken, crearPersonaje);

/**
 * @swagger
 * /personajes/{id}:
 *   put:
 *     summary: Actualizar un personaje
 *     tags: [Personajes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               edad:
 *                 type: integer
 *               poder:
 *                 type: string
 *               anime_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Personaje actualizado
 */
router.put('/:id', verificarToken, actualizarPersonaje);

/**
 * @swagger
 * /personajes/{id}:
 *   delete:
 *     summary: Eliminar un personaje
 *     tags: [Personajes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Personaje eliminado
 */
router.delete('/:id', verificarToken, eliminarPersonaje);

module.exports = router;