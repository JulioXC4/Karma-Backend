    //MERCADO PAGO
    const mercadopago = require("mercadopago")
    const { default: axios } = require("axios")
    const {Order, ShoppingCart, User, Product} = require('../../db.js')
    const { removeItemsFromProductStock, ChangeOrderStatus, emptyUserShoppingCart, returnProductsToStock } = require('../../utils/functions.js')

    const {HOST_FRONT, HOST_BACK, MERCADOPAGO_API_KEY} = process.env
    let timeoutId

    mercadopago.configure({
    
        access_token:
        MERCADOPAGO_API_KEY,
        sandbox: true,
        
    })

    const mercadoPagoPayment = async (req, res) => {

        try {
          const { userId, orderId } = req.body

          const user = await User.findByPk(userId, { include:{model: Order, include: ShoppingCart } })
          const userOrder = user.Orders.find(order => order.id === orderId)
          let itemsConvertProperties = []

          if(userOrder){

            removeItemsFromProductStock(orderId)
            stockReserveTimeInterval(3, orderId)
            
            itemsConvertProperties = await Promise.all(userOrder.ShoppingCarts.map( async (product) => {
              const productInShoppingCart = await Product.findByPk(product.id)
  
              return {
                 id: productInShoppingCart.id,
                 title: `${productInShoppingCart.brand} ${productInShoppingCart.model}`,
                 currency_id: 'USD',
                 picture_url: productInShoppingCart.images[0],
                 description: 'Descripcion del producto',
                 category_id: productInShoppingCart.constructor.name,
                 quantity: product.dataValues.amount,
                 unit_price: productInShoppingCart.price
              }
            }))

          }else{

            return res.status(400).send("El id de la orden no corresponde al usuario seleccionado")
          }

            let preference = {
                items: itemsConvertProperties,
                back_urls: {
                  success: `${HOST_BACK}/payments/approvedPaymentMercadoPago`,
                  failure: `${HOST_BACK}/payments/failedPaymentMercadoPago`,
                  pending: ``,
                },
                auto_return: "approved",
                binary_mode: true,
                external_reference: orderId.toString()
            }
    
            const response = await mercadopago.preferences.create(preference)

            if (!response) {
                throw new Error('No se pudo crear la preferencia en MercadoPago');
            }

            return res.status(200).json( response.body )

        } catch (error) {

            return res.status(400).send({ error: error.message })

        }
       
    }

    const getMerchantOrder = async (merchOrderId) => {
      try {
        const response = await axios.get(`https://api.mercadopago.com/merchant_orders/${merchOrderId}`, {
          headers: {
            'Authorization': `Bearer ${MERCADOPAGO_API_KEY}`
          }
        })
       return response.data
      } catch (error) {
        console.error(error)
      }
    }

    const cancelMerchOrder = async (merchOrderId) => {
      try {
        await axios.put(`https://api.mercadopago.com/merchant_orders/${merchOrderId}`, {cancelled: true},{
          headers: {
            'Authorization': `Bearer ${MERCADOPAGO_API_KEY}`
          }
        })
        console.log(`Orden de mercado pago ${merchOrderId} cancelada`)
      } catch (error) {
        console.error(error)
      }
    }

    const stockReserveTimeInterval = async ( minutes, orderId ) => {
      console.log(`Comienza el temporizador para la reserva de stock de la orden: ${orderId}, tiempo asignado: ${minutes} minutos`)
      timeoutId = setTimeout(() => {
          console.log(`Tiempo de la orden ${orderId} expirado (${minutes} minutos)`)
      }, minutes * 60 * 1000)
    }

    const cancelTimer = (orderId) => {
      clearTimeout(timeoutId)
      console.log(`El temporizador de la orden ${orderId} ha sido cancelado`)
    }

    const approvedPaymentMercadoPago = async (req, res) => {

      const {merchant_order_id, collection_status} = req.query
      const merchantData = await getMerchantOrder(merchant_order_id)
      const orderId = parseInt(merchantData.external_reference)

      if(merchantData.status === 'closed' && collection_status === 'approved'){

        cancelTimer(orderId)
        await ChangeOrderStatus(orderId, "Orden Pagada")
        await emptyUserShoppingCart(orderId)
        
      }
      return res.redirect(`${HOST_FRONT}/rutaFrontAprobada`);
    }

    const failedPaymentMercadoPago = async (req, res) => {
      
      const {merchant_order_id, collection_status} = req.query
      const merchantData = await getMerchantOrder(merchant_order_id)
      const orderId = parseInt(merchantData.external_reference)

      if(merchantData.status === 'opened' && collection_status === 'rejected'){

        cancelTimer(orderId)
        await cancelMerchOrder(merchant_order_id)
        await ChangeOrderStatus(orderId, "Orden Rechazada")
        await returnProductsToStock(orderId)

      }

      return res.redirect(`${HOST_FRONT}/rutaFrontFallida`);
    }

    module.exports = {
        mercadoPagoPayment,
        approvedPaymentMercadoPago,
        failedPaymentMercadoPago
    }

    /*  
    const handleMercadoPagoWebhook = async (req, res) => {
      const {topic, id} = req.query

        console.log("El query: ", req.query)

      switch (topic) {
        case 'merchant_order':

          const merchantData = await getMerchantOrder(id)
          if(merchantData.status === 'closed' && merchantData.notification_url != MERCADOPAGO_DOMAIN_TO_REDIRECT.toString()){

            await disableMerchantOrderById(id)
            console.log("Merchant Order cerrada, pagado. notificacion de Merchant Order deshabilitada")
            //Primero verificar si el status order ya se cambio
            //Cambiar order status a pago validado
            return res.status(200)
          }else if (merchantData.status === 'opened' && merchantData.order_status === "payment_required"){
            // IF "order_status": "payment_required" Empezar el contador
            await myAsyncFunction(timer)
            console.log("Merchant Order abierta, esperando pago. Comienza el temporizador de 5 minutos antes de delvolver productos al stock")
            return res.status(200)
          }
          else{
            return res.status(200)
          }
      
        default:
          return res.status(200)
      }
      return res.status(200)
    } 
    */
