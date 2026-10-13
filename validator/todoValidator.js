const { body, param, validationResult } = require('express-validator');

// Middleware untuk mengirim error validasi dengan format konsisten
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'fail',
            message: 'Validasi input gagal.',
            errors: errors.array().map((error) => ({
                field: error.path,
                message: error.msg
            }))
        });
    }

    next();
};

// Validasi saat membuat Todo
const validateCreateTodo = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Judul Todo wajib diisi.'),

    body('description')
        .optional()
        .isString()
        .withMessage('Deskripsi harus berupa teks.')
        .trim(),

    body('status')
        .optional()
        .isIn(['pending', 'in_progress', 'completed'])
        .withMessage('Status harus pending, in_progress, atau completed.'),

    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority harus low, medium, atau high.'),

    body('category')
        .optional({ values: 'falsy' })
        .isMongoId()
        .withMessage('Category harus menggunakan ID MongoDB yang valid.'),

    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('dueDate harus berupa tanggal yang valid.')
];

// Validasi saat memperbarui Todo
const validateUpdateTodo = [
    param('id')
        .isMongoId()
        .withMessage('ID Todo tidak valid.'),

    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Judul Todo tidak boleh kosong.'),

    body('description')
        .optional()
        .isString()
        .withMessage('Deskripsi harus berupa teks.')
        .trim(),

    body('status')
        .optional()
        .isIn(['pending', 'in_progress', 'completed'])
        .withMessage('Status harus pending, in_progress, atau completed.'),

    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority harus low, medium, atau high.'),

    body('category')
        .optional({ values: 'falsy' })
        .isMongoId()
        .withMessage('Category harus menggunakan ID MongoDB yang valid.'),

    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('dueDate harus berupa tanggal yang valid.')
];

// Validasi ID untuk mengambil atau menghapus Todo
const validateTodoId = [
    param('id')
        .isMongoId()
        .withMessage('ID Todo tidak valid.')
];

module.exports = {
    validateRequest,
    validateCreateTodo,
    validateUpdateTodo,
    validateTodoId
};
