const express = require('express');

const logger = require('./middleware/Logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const authRoute = require('./route/authRoute');
const todoRoute = require('./route/todoRoute');
const categoryRoute = require('./route/categoryRoute');
const statsRoute = require('./route/statsRoute');

const app = express();

app.use(express.json());

// Logger dipasang sebelum seluruh route
app.use(logger);

// Pendaftaran route
app.use('/api/auth', authRoute);
app.use('/api/todos', todoRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/stats', statsRoute);

// Middleware penanganan error diletakkan paling akhir
app.use(notFound);
app.use(errorHandler);

module.exports = app;
