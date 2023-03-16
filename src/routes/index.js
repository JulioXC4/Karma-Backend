const express = require('express');
const homeRoutes = require('./home.js');
const userRoutes = require('./user.js');
const productRoutes = require('./product.js');
const laptopRoutes = require('./laptop.js')
const tabletRoutes = require('./tablet.js')
const categoryRoutes = require('./category.js')
const orderRoutes = require('./order.js')

const app = express();

app.use('/', homeRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/laptop', laptopRoutes);
app.use('/tablet', tabletRoutes);
app.use('/category', categoryRoutes)
app.use('/order', orderRoutes)

module.exports = app;