const express = require('express');

const {
    register,
    login
} = require('../controller/authController');

const {
    validateRegister,
    validateLogin,
    validateRequest
} = require('../validator/authValidator');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Registrasi dan autentikasi pengguna
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrasi pengguna baru
 *     description: Membuat akun pengguna baru. Endpoint ini tidak memerlukan autentikasi.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pengguna Baru
 *               email:
 *                 type: string
 *                 format: email
 *                 example: pengguna@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Rahasia123
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Validasi input gagal
 *       409:
 *         description: Email sudah terdaftar, jika ditangani demikian oleh controller
 *
 * /api/auth/login:
 *   post:
 *     summary: Login pengguna
 *     description: Memverifikasi kredensial dan mendapatkan token autentikasi.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: pengguna@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Rahasia123
 *     responses:
 *       200:
 *         description: Login berhasil
 *       400:
 *         description: Validasi input gagal
 *       401:
 *         description: Email atau password salah
 */

router.post(
    '/register',
    validateRegister,
    validateRequest,
    register
);

router.post(
    '/login',
    validateLogin,
    validateRequest,
    login
);

module.exports = router;
