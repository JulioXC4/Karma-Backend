const express = require('express');
const homeRoutes = require('./home.js');
const userRoutes = require('./user.js');
const productRoutes = require('./product.js');
const shoppingCartRoutes = require ('./shoppingCart.js');
const commentsRaitingRoutes = require('./commentsRaiting.js');
const app = express();

app.use('/', homeRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/shoppingCart',shoppingCartRoutes);
app.use('/commentsRaiting',commentsRaitingRoutes)


module.exports = app;