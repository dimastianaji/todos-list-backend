const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../model/User');
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');

const signToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        }
    );
};

const register = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return next(new AppError('Email sudah terdaftar', 400));
    }

    const user = await User.create({
        name,
        email,
        password
    });

    const token = signToken(user._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('Email atau password salah', 401));
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        return next(new AppError('Email atau password salah', 401));
    }

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    });
});

module.exports = {
    register,
    login
};