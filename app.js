const express = require('express');

const logger = require('./middleware/Logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const authRoute = require('./route/authRoute');
const todoRoute = require('./route/todoRoute');
const categoryRoute = require('./route/categoryRoute');
const statsRoute = require('./route/statsRoute');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

app.use(express.json());

// Logger dipasang sebelum seluruh route
app.use(logger);

// Dokumentasi API interaktif menggunakan Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Pendaftaran route API
app.use('/api/auth', authRoute);
app.use('/api/todos', todoRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/stats', statsRoute);

// Middleware penanganan error diletakkan paling akhir
app.use(notFound);
app.use(errorHandler);

module.exports = app;