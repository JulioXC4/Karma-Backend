const {Router} = require('express')
const {createProductDiscount, getDiscountedProducts, updateDiscountByProductId, removeDiscountByProductId} = require('../controllers/productDiscount.controllers.js')
const router = Router()

// GET
router.get('/getDiscountedProducts', getDiscountedProducts)

// POST
router.post('/createProductDiscount', createProductDiscount)
// PUT
router.put('/updateDiscountByProductId', updateDiscountByProductId)
// DELETE
router.delete('/removeDiscountByProductId', removeDiscountByProductId)

module.exports = router;