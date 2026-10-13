
const { body, param } = require('express-validator');
const { validateRequest } = require('./todoValidator');

const validateCreateCategory = [
    body('name')
        .isString()
        .withMessage('Nama kategori harus berupa teks.')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('Nama kategori wajib diisi.'),

    body('description')
        .optional()
        .isString()
        .withMessage('Deskripsi kategori harus berupa teks.')
        .bail()
        .trim()
];

const validateUpdateCategory = [
    param('id')
        .isMongoId()
        .withMessage('ID kategori tidak valid.'),

    body('name')
        .optional()
        .isString()
        .withMessage('Nama kategori harus berupa teks.')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('Nama kategori tidak boleh kosong.'),

    body('description')
        .optional()
        .isString()
        .withMessage('Deskripsi kategori harus berupa teks.')
        .bail()
        .trim()
];

const validateCategoryId = [
    param('id')
        .isMongoId()
        .withMessage('ID kategori tidak valid.')
];

module.exports = {
    validateRequest,
    validateCreateCategory,
    validateUpdateCategory,
    validateCategoryId
};
