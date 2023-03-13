const express = require('express');
const homeRoutes = require('./home.js');

const app = express();

app.use('/', homeRoutes);

module.exports = app;