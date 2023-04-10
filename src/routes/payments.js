const {Router} = require('express')
const { mercadoPagoPayment, approvedPaymentMercadoPago, failedPaymentMercadoPago } = require('../controllers/payments/mercadoPago.payments.controllers.js')
const { createOrderPaypal, captureOrderPaypal, cancelOrderPaypal} = require('../controllers/payments/paypal.payments.controllers.js')
const router = Router()

//MERCADO PAGO
// GET
router.get('/approvedPaymentMercadoPago', approvedPaymentMercadoPago )
router.get('/failedPaymentMercadoPago', failedPaymentMercadoPago )

// POST
router.post('/mercadoPago', mercadoPagoPayment )



//PAYPAL
// GET
router.get('/captureOrderPaypal', captureOrderPaypal )
router.get('/cancelOrderPaypal', cancelOrderPaypal )

// POST
router.post('/createOrderPaypal', createOrderPaypal )

module.exports = router;