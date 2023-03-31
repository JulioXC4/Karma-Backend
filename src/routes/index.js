const express = require('express');
const homeRoutes = require('./home.js');
const userRoutes = require('./user.js');
const productRoutes = require('./product.js'); 
const orderRoutes = require('./order.js');
const shoppingCartRoutes = require ('./shoppingCart.js');
const commentsRatingRoutes = require ('./commentsRating.js');
const laptopRoutes = require('./laptop.js')
const tabletRoutes = require('./tablet.js')
const tvRoutes = require('./tv.js')
const CellPhoneRoutes  = require('./cellPhone.js');
const productPromoRoutes = require('./productPromotion');
const payments  = require('./payments.js');

const app = express();

app.use('/', homeRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/product', productPromoRoutes)
app.use('/order', orderRoutes);
app.use('/shoppingCart',shoppingCartRoutes);
app.use('/commentsRating',commentsRatingRoutes);
app.use('/laptop', laptopRoutes);
app.use('/tablet', tabletRoutes);
app.use('/tv',tvRoutes)
app.use('/cellPhone',CellPhoneRoutes);
app.use('/payments',payments);


module.exports = app;