const {Router} = require('express')
const {mercadoPagoPayment} = require('../controllers/payments/mercadoPago.payments.controllers.js')
const router = Router()

// GET

// POST
router.post('/mercadoPago', mercadoPagoPayment)

// PUT

// DELETE


module.exports = router;