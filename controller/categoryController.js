const Category = require('../model/Category');
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');

const createCategory = catchAsync(async (req, res) => {
    const category = await Category.create({
        user: req.user._id,
        name: req.body.name,
        description: req.body.description
    });

    res.status(201).json({
        status: 'success',
        data: {
            category
        }
    });
});

const getCategories = catchAsync(async (req, res) => {
    const categories = await Category.find({
        user: req.user._id
    });

    res.status(200).json({
        status: 'success',
        results: categories.length,
        data: {
            categories
        }
    });
});

const getCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!category) {
        return next(
            new AppError(
                'Kategori tidak ditemukan atau Anda tidak memiliki akses.',
                404
            )
        );
    }

    res.status(200).json({
        status: 'success',
        data: {
            category
        }
    });
});

const updateCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!category) {
        return next(
            new AppError(
                'Kategori tidak ditemukan atau Anda tidak memiliki akses.',
                404
            )
        );
    }

    const allowedFields = [
        'name',
        'description'
    ];

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            category[field] = req.body[field];
        }
    });

    await category.save();

    res.status(200).json({
        status: 'success',
        data: {
            category
        }
    });
});

const deleteCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!category) {
        return next(
            new AppError(
                'Kategori tidak ditemukan atau Anda tidak memiliki akses.',
                404
            )
        );
    }

    await Category.findByIdAndDelete(category._id);

    res.status(204).send();
});

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
};