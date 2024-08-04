const express = require('express');
const routes = express();
const AppController = require('../controllers/AppController');

// Routes
routes.get('/status', AppController.getStatus);
routes.get('/stats', AppController.getStats);

module.exports = routes;
