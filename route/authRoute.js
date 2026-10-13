
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
