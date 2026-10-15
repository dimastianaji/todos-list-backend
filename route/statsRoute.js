const express = require('express');

const { getTodoStats } = require('../controller/statsController');
const apiKeyAuth = require('../middleware/apiKeyAuth');

const router = express.Router();

router.use(apiKeyAuth);

router.get('/todos', getTodoStats);

module.exports = router;