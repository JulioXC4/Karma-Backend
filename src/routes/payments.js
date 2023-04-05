const {Router} = require('express')
const { mercadoPagoPayment, handleMercadoPagoWebhook, failureMercadoPago } = require('../controllers/payments/mercadoPago.payments.controllers.js')
const router = Router()

// GET
router.get('/failureMercadoPago', failureMercadoPago )
// POST
router.post('/mercadoPago', mercadoPagoPayment )
router.post('/mercadoPagoWebhook', handleMercadoPagoWebhook )

// PUT

// DELETE


module.exports = router;