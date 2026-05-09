const router = require('express').Router();
const { getAnimes } = require('../controllers/animesController');

/**
 * @swagger
 * /api/animes:
 *   get:
 *     summary: Obtiene todos los animes
 *     tags: [Animes]
 *     responses:
 *       200:
 *         description: Lista de animes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 */
router.get('/', getAnimes);

module.exports = router;