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
