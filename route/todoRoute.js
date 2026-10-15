const express = require('express');

const {
    createTodo,
    getTodos,
    getTodo,
    updateTodo,
    deleteTodo
} = require('../controller/todoController');

const protect = require('../middleware/protect');

const {
    validateRequest,
    validateCreateTodo,
    validateUpdateTodo,
    validateTodoId
} = require('../validator/todoValidator');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Manajemen Todo pengguna
 */

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Membuat Todo baru
 *     description: Membuat Todo untuk pengguna yang sedang login.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoInput'
 *     responses:
 *       201:
 *         description: Todo berhasil dibuat
 *       400:
 *         description: Validasi input gagal
 *       401:
 *         description: Belum login atau token tidak valid
 *
 *   get:
 *     summary: Mendapatkan daftar Todo
 *     description: Mengambil daftar Todo milik pengguna yang sedang login.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Jumlah Todo per halaman
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         description: Filter berdasarkan status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter berdasarkan prioritas
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter berdasarkan ID kategori
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pencarian berdasarkan judul atau deskripsi
 *     responses:
 *       200:
 *         description: Daftar Todo berhasil diambil
 *       401:
 *         description: Belum login atau token tidak valid
 */

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Mendapatkan detail Todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Todo
 *     responses:
 *       200:
 *         description: Detail Todo berhasil diambil
 *       400:
 *         description: Format ID tidak valid
 *       401:
 *         description: Belum login atau token tidak valid
 *       404:
 *         description: Todo tidak ditemukan
 *
 *   patch:
 *     summary: Memperbarui Todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoInput'
 *     responses:
 *       200:
 *         description: Todo berhasil diperbarui
 *       400:
 *         description: Format ID atau validasi input tidak valid
 *       401:
 *         description: Belum login atau token tidak valid
 *       404:
 *         description: Todo tidak ditemukan
 *
 *   delete:
 *     summary: Menghapus Todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Todo
 *     responses:
 *       204:
 *         description: Todo berhasil dihapus
 *       400:
 *         description: Format ID tidak valid
 *       401:
 *         description: Belum login atau token tidak valid
 *       404:
 *         description: Todo tidak ditemukan
 */

router.use(protect);

router
    .route('/')
    .post(validateCreateTodo, validateRequest, createTodo)
    .get(getTodos);

router
    .route('/:id')
    .get(validateTodoId, validateRequest, getTodo)
    .patch(validateUpdateTodo, validateRequest, updateTodo)
    .delete(validateTodoId, validateRequest, deleteTodo);

module.exports = router;
