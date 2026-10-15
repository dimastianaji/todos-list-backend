const express = require('express');

const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
} = require('../controller/categoryController');

const protect = require('../middleware/protect');

const {
    validateRequest,
    validateCreateCategory,
    validateUpdateCategory,
    validateCategoryId
} = require('../validator/categoryValidator');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Manajemen kategori pengguna
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Membuat kategori baru
 *     description: Membuat kategori untuk pengguna yang sedang login.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Study
 *               description:
 *                 type: string
 *                 example: Kategori untuk aktivitas belajar
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
 *       400:
 *         description: Validasi input gagal
 *       401:
 *         description: Belum login atau token tidak valid
 *
 *   get:
 *     summary: Mendapatkan semua kategori
 *     description: Mengambil daftar kategori milik pengguna yang sedang login.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil diambil
 *       401:
 *         description: Belum login atau token tidak valid
 *
 * /api/categories/{id}:
 *   get:
 *     summary: Mendapatkan detail kategori
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori
 *     responses:
 *       200:
 *         description: Detail kategori berhasil diambil
 *       400:
 *         description: Format ID tidak valid
 *       401:
 *         description: Belum login atau token tidak valid
 *       404:
 *         description: Kategori tidak ditemukan
 *
 *   patch:
 *     summary: Memperbarui kategori
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Personal Study
 *               description:
 *                 type: string
 *                 example: Kategori belajar pribadi
 *     responses:
 *       200:
 *         description: Kategori berhasil diperbarui
 *       400:
 *         description: Format ID atau validasi input tidak valid
 *       401:
 *         description: Belum login atau token tidak valid
 *       404:
 *         description: Kategori tidak ditemukan
 *
 *   delete:
 *     summary: Menghapus kategori
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori
 *     responses:
 *       204:
 *         description: Kategori berhasil dihapus
 *       400:
 *         description: Format ID tidak valid
 *       401:
 *         description: Belum login atau token tidak valid
 *       404:
 *         description: Kategori tidak ditemukan
 */

router.use(protect);

router
    .route('/')
    .post(validateCreateCategory, validateRequest, createCategory)
    .get(getCategories);

router
    .route('/:id')
    .get(validateCategoryId, validateRequest, getCategory)
    .patch(validateUpdateCategory, validateRequest, updateCategory)
    .delete(validateCategoryId, validateRequest, deleteCategory);

module.exports = router;
