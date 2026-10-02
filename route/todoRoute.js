const express = require('express');

const {
    createTodo,
    getTodos,
    getTodo,
    updateTodo,
    deleteTodo
} = require('../controller/todoController');

const protect = require('../middleware/protect');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .post(createTodo)
    .get(getTodos);

router
    .route('/:id')
    .get(getTodo)
    .patch(updateTodo)
    .delete(deleteTodo);

module.exports = router;