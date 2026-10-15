const express = require('express');

const { getTodoStats } = require('../controller/statsController');
const apiKeyAuth = require('../middleware/apiKeyAuth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Statistik Todo
 */

/**
 * @swagger
 * /api/stats/todos:
 *   get:
 *     summary: Mendapatkan statistik Todo
 *     description: Mengambil ringkasan statistik Todo menggunakan API key yang valid.
 *     tags: [Stats]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Statistik Todo berhasil diambil
 *       401:
 *         description: API key tidak ada atau tidak valid
 *       500:
 *         description: Terjadi kesalahan pada server
 */

router.use(apiKeyAuth);

router.get('/todos', getTodoStats);

module.exports = router;
