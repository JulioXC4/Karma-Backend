const {Router} = require('express')
const { mercadoPagoPayment, handleMercadoPagoWebhook } = require('../controllers/payments/mercadoPago.payments.controllers.js')
const router = Router()

// GET

// POST
router.post('/mercadoPago', mercadoPagoPayment )
router.post('/mercadoPagoWebhook', handleMercadoPagoWebhook )

// PUT

// DELETE


module.exports = router;