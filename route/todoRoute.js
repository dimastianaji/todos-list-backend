
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
