const Todo = require('../model/Todo');
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');

const createTodo = catchAsync(async (req, res) => {
    const todo = await Todo.create({
        user: req.user._id,
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        dueDate: req.body.dueDate
    });

    res.status(201).json({
        status: 'success',
        data: {
            todo
        }
    });
});

const getTodos = catchAsync(async (req, res) => {
    const todos = await Todo.find({
        user: req.user._id
    }).populate('category');

    res.status(200).json({
        status: 'success',
        results: todos.length,
        data: {
            todos
        }
    });
});

const getTodo = catchAsync(async (req, res, next) => {
    const todo = await Todo.findOne({
        _id: req.params.id,
        user: req.user._id
    }).populate('category');

    if (!todo) {
        return next(
            new AppError(
                'Todo tidak ditemukan atau Anda tidak memiliki akses.',
                404
            )
        );
    }

    res.status(200).json({
        status: 'success',
        data: {
            todo
        }
    });
});

const updateTodo = catchAsync(async (req, res, next) => {
    const todo = await Todo.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!todo) {
        return next(
            new AppError(
                'Todo tidak ditemukan atau Anda tidak memiliki akses.',
                404
            )
        );
    }

    const allowedFields = [
        'category',
        'title',
        'description',
        'status',
        'priority',
        'dueDate'
    ];

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            todo[field] = req.body[field];
        }
    });

    if (
        req.body.status === 'completed' &&
        todo.completedAt === null
    ) {
        todo.completedAt = new Date();
    }

    if (
        req.body.status &&
        req.body.status !== 'completed'
    ) {
        todo.completedAt = null;
    }

    await todo.save();

    res.status(200).json({
        status: 'success',
        data: {
            todo
        }
    });
});

const deleteTodo = catchAsync(async (req, res, next) => {
    const todo = await Todo.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!todo) {
        return next(
            new AppError(
                'Todo tidak ditemukan atau Anda tidak memiliki akses.',
                404
            )
        );
    }

    await Todo.findByIdAndDelete(todo._id);

    res.status(204).send();
});

module.exports = {
    createTodo,
    getTodos,
    getTodo,
    updateTodo,
    deleteTodo
};