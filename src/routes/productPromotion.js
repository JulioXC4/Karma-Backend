const {Router} = require('express')
const {getAllProductPromo} = require('../controllers/products.promotion.controllers')
const router = Router()

// GET
router.get('/getproductPromo/:quantity',getAllProductPromo)

module.exports = router;