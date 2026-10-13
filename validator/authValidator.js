const { body } = require('express-validator');
const { validateRequest } = require('./todoValidator');

const validateRegister = [
    body('name')
        .isString()
        .withMessage('Nama harus berupa teks.')
        .trim()
        .notEmpty()
        .withMessage('Nama wajib diisi.')
        .isLength({ max: 100 })
        .withMessage('Nama maksimal 100 karakter.'),

    body('email')
        .isString()
        .withMessage('Email harus berupa teks.')
        .trim()
        .notEmpty()
        .withMessage('Email wajib diisi.')
        .isEmail()
        .withMessage('Format email tidak valid.')
        .normalizeEmail(),

    body('password')
        .isString()
        .withMessage('Password harus berupa teks.')
        .notEmpty()
        .withMessage('Password wajib diisi.')
        .isLength({ min: 8 })
        .withMessage('Password minimal 8 karakter.')
];

const validateLogin = [
    body('email')
        .isString()
        .withMessage('Email harus berupa teks.')
        .trim()
        .notEmpty()
        .withMessage('Email wajib diisi.')
        .isEmail()
        .withMessage('Format email tidak valid.')
        .normalizeEmail(),

    body('password')
        .isString()
        .withMessage('Password harus berupa teks.')
        .notEmpty()
        .withMessage('Password wajib diisi.')
];

module.exports = {
    validateRegister,
    validateLogin,
    validateRequest
};
