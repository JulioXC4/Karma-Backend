const {Router} = require('express')
const {getAllOrder,getOrder,createOrder,updateOrder,deleteOrder} = require('../controllers/order.controllers.js')
const router = Router()

// GET
router.get('/getOrder',getOrder)
router.get('/getAllOrder',getAllOrder)
// POST
router.post('/createOrder', createOrder)
// PUT
router.put('/updateOrder', updateOrder)
// DELETE
router.delete('/deleteOrder', deleteOrder)

module.exports = router;