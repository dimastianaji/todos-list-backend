const AppError = require('../util/AppError');

const apiKeyAuth = (req, res, next) => {
    const apiKey = req.get('x-api-key');

    if (!process.env.API_KEY) {
        return next(
            new AppError(
                'Konfigurasi API Key belum tersedia di server.',
                500
            )
        );
    }

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return next(
            new AppError(
                'API Key tidak valid atau tidak tersedia.',
                401
            )
        );
    }

    next();
};

module.exports = apiKeyAuth;
