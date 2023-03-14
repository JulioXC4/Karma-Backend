const express = require('express');
const userRoutes = require('./user.js');
const homeRoutes = require('./home.js');

const app = express();

app.use('/', homeRoutes);
app.use('/user', userRoutes);

module.exports = app;