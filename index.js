require('dotenv').config();

const express = require('express');

const connectDB = require('./config/database');

const logger = require('./middleware/Logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const protect = require('./middleware/protect');

const app = express();

const authRoute = require('./route/authRoute');

app.use(express.json());

app.use('/api/auth', authRoute);

app.use(logger);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server berjalan pada port ${PORT}`);
        console.log('Aplikasi berhasil terhubung ke MongoDB');
    });
};

startServer();