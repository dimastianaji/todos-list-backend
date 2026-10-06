const express = require('express');

const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
} = require('../controller/categoryController');

const protect = require('../middleware/protect');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .post(createCategory)
    .get(getCategories);

router
    .route('/:id')
    .get(getCategory)
    .patch(updateCategory)
    .delete(deleteCategory);

module.exports = router;