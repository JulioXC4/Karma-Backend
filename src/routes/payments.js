const {Router} = require('express')
const { mercadoPagoPayment, approvedPaymentMercadoPago, failedPaymentMercadoPago } = require('../controllers/payments/mercadoPago.payments.controllers.js')
const router = Router()

// GET
router.get('/approvedPaymentMercadoPago', approvedPaymentMercadoPago )
router.get('/failedPaymentMercadoPago', failedPaymentMercadoPago )

// POST
router.post('/mercadoPago', mercadoPagoPayment )
//router.post('/mercadoPagoWebhook', handleMercadoPagoWebhook )

// PUT

// DELETE


module.exports = router;