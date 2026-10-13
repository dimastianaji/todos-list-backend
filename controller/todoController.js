const mongoose = require('mongoose');
const Todo = require('../model/Todo');
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');
const logActivity = require('../service/activityLogService');


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

    await logActivity({
        user: req.user._id,
        action: 'create',
        resource: 'Todo',
        resourceId: todo._id,
        description: `Membuat Todo: ${todo.title}`,
        metadata: {
            title: todo.title,
            status: todo.status,
            priority: todo.priority
        }
    });

    res.status(201).json({
        status: 'success',
        data: {
            todo
        }
    });
});


const getTodos = catchAsync(async (req, res, next) => {
    // =========================
    // PAGINATION
    // =========================
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
        Math.max(parseInt(req.query.limit, 10) || 10, 1),
        100
    );

    const skip = (page - 1) * limit;

    // =========================
    // FILTER
    // =========================
    const filter = {
        user: req.user._id
    };

    // Filter berdasarkan status
    if (req.query.status) {
        const allowedStatus = [
            'pending',
            'in_progress',
            'completed'
        ];

        if (!allowedStatus.includes(req.query.status)) {
            return next(
                new AppError(
                    'Status tidak valid. Gunakan pending, in_progress, atau completed.',
                    400
                )
            );
        }

        filter.status = req.query.status;
    }

    // Filter berdasarkan priority
    if (req.query.priority) {
        const allowedPriority = [
            'low',
            'medium',
            'high'
        ];

        if (!allowedPriority.includes(req.query.priority)) {
            return next(
                new AppError(
                    'Priority tidak valid. Gunakan low, medium, atau high.',
                    400
                )
            );
        }

        filter.priority = req.query.priority;
    }

    // Filter berdasarkan category
    if (req.query.category) {
        if (!mongoose.Types.ObjectId.isValid(req.query.category)) {
            return next(
                new AppError(
                    'Category ID tidak valid.',
                    400
                )
            );
        }

        filter.category = req.query.category;
    }

    // =========================
    // SEARCH
    // =========================
    if (req.query.search) {
        const search = req.query.search.trim();

        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ];
        }
    }

    // =========================
    // SORTING
    // =========================
    const allowedSortFields = [
        'createdAt',
        'updatedAt',
        'dueDate',
        'title',
        'priority',
        'status'
    ];

    let sort = '-createdAt';

    if (req.query.sort) {
        const requestedSort = req.query.sort;

        const sortField = requestedSort.startsWith('-')
            ? requestedSort.substring(1)
            : requestedSort;

        if (!allowedSortFields.includes(sortField)) {
            return next(
                new AppError(
                    `Field sorting tidak valid. Gunakan: ${allowedSortFields.join(', ')}.`,
                    400
                )
            );
        }

        sort = requestedSort;
    }

    // =========================
    // QUERY
    // =========================
    const [todos, total] = await Promise.all([
        Todo.find(filter)
            .populate('category')
            .sort(sort)
            .skip(skip)
            .limit(limit),

        Todo.countDocuments(filter)
    ]);

    // =========================
    // PAGINATION INFO
    // =========================
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
        status: 'success',
        results: todos.length,
        pagination: {
            currentPage: page,
            limit,
            totalItems: total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        },
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

    // Simpan data sebelum perubahan untuk Activity Log
    const previousData = {
        title: todo.title,
        status: todo.status,
        priority: todo.priority
    };

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

    // Catat aktivitas setelah Todo berhasil diperbarui
    await logActivity({
        user: req.user._id,
        action: 'update',
        resource: 'Todo',
        resourceId: todo._id,
        description: `Memperbarui Todo: ${todo.title}`,
        metadata: {
            before: previousData,
            after: {
                title: todo.title,
                status: todo.status,
                priority: todo.priority
            }
        }
    });

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

    // Simpan informasi Todo sebelum dihapus
    const deletedTodo = {
        _id: todo._id,
        title: todo.title,
        status: todo.status,
        priority: todo.priority
    };

    await Todo.findByIdAndDelete(todo._id);

    // Catat aktivitas setelah Todo berhasil dihapus
    await logActivity({
        user: req.user._id,
        action: 'delete',
        resource: 'Todo',
        resourceId: deletedTodo._id,
        description: `Menghapus Todo: ${deletedTodo.title}`,
        metadata: {
            title: deletedTodo.title,
            status: deletedTodo.status,
            priority: deletedTodo.priority
        }
    });

    res.status(204).send();
});


module.exports = {
    createTodo,
    getTodos,
    getTodo,
    updateTodo,
    deleteTodo
};