const mongoose = require('mongoose');

const errorHandler = (err, req, res, next) => {
    let error = err;

    // Error ID MongoDB tidak valid
    if (error instanceof mongoose.Error.CastError) {
        error = {
            statusCode: 400,
            status: 'fail',
            message: 'Format ID tidak valid.'
        };
    }

    // Error validasi schema Mongoose
    else if (error instanceof mongoose.Error.ValidationError) {
        error = {
            statusCode: 400,
            status: 'fail',
            message: 'Data yang dikirim tidak valid.'
        };
    }

    // Error duplikasi data, misalnya email unik
    else if (error.code === 11000) {
        error = {
            statusCode: 409,
            status: 'fail',
            message: 'Data sudah terdaftar.'
        };
    }

    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';

    // Error internal tidak boleh membocorkan detail saat production
    const message =
        error.isOperational || process.env.NODE_ENV !== 'production'
            ? error.message
            : 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';

    // Catat detail error di server untuk kebutuhan debugging
    if (statusCode >= 500) {
        console.error(err);
    }

    res.status(statusCode).json({
        status,
        message
    });
};

module.exports = errorHandler;
