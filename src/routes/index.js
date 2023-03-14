const express = require('express');
const homeRoutes = require('./home.js');
const userRoutes = require('./user.js');
const productRoutes = require('./product.js');

const app = express();

app.use('/', homeRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);

module.exports = app;