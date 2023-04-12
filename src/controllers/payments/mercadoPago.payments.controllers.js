    //MERCADO PAGO
    const mercadopago = require("mercadopago")
    const { default: axios } = require("axios")
    const {Order, ShoppingCart, User, Product} = require('../../db.js')
    const { removeItemsFromProductStock, ChangeOrderStatus, emptyUserShoppingCart, returnProductsToStock, DeleteOrderById, deleteUserShoppingCart } = require('../../utils/functions.js')

    const {HOST_FRONT, HOST_BACK, MERCADOPAGO_API_KEY} = process.env

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

            await ChangeOrderStatus(orderId, "Procesando Orden")
            await removeItemsFromProductStock(orderId)
            await stockReserveTimeInterval(2, orderId)
            
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

            return res.status(200).json( response.body.init_point )
            //return res.redirect(response.body.init_point)

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
      const currentOrder = await Order.findByPk(orderId)
      console.log(`Comienza el temporizador para la reserva de stock de la orden: ${orderId}, tiempo asignado: ${minutes} minutos`)
      timeoutId = setTimeout(() => {
        console.log("MERCADOPAGO:", currentOrder.orderStatus)
        if(currentOrder.orderStatus === 'Procesando Orden'){
          console.log(`Tiempo de la orden ${orderId} expirado (${minutes} minutos)`)
          ChangeOrderStatus(orderId, "Orden Rechazada")
          returnProductsToStock(orderId)
        }else{
          console.log(`Para que el temporizador de la orden ${orderId} sea cancelado, la orden debe estar en proceso`)
        }
      }, minutes * 60 * 1000)
    }

    const cancelTimer = async (orderId) => {
        clearTimeout(timeoutId)
        console.log(`El temporizador de la orden ${orderId} ha sido cancelado`)
    }

    const approvedPaymentMercadoPago = async (req, res) => {

      const {merchant_order_id, collection_status} = req.query
      const merchantData = await getMerchantOrder(merchant_order_id)
      const orderId = parseInt(merchantData.external_reference)

      if(merchantData.status === 'closed' && collection_status === 'approved'){

        await cancelTimer(orderId)
        await ChangeOrderStatus(orderId, "Orden Pagada")
        await emptyUserShoppingCart(orderId)
        await cancelMerchOrder(merchant_order_id)
        //await deleteUserShoppingCart(orderId)
        //enviar correo
      }
      return res.redirect(`${HOST_FRONT}/profile/orders`);
    }

    const failedPaymentMercadoPago = async (req, res) => {
      
      const {merchant_order_id, collection_status} = req.query
      const merchantData = await getMerchantOrder(merchant_order_id)
      const orderId = parseInt(merchantData.external_reference)

      if(merchantData.status === 'opened' && collection_status === 'rejected'){

        await cancelTimer(orderId)
        await cancelMerchOrder(merchant_order_id)
        await ChangeOrderStatus(orderId, "Orden Rechazada")
        await returnProductsToStock(orderId)
        await DeleteOrderById(orderId)

      }

      return res.redirect(`${HOST_FRONT}/profile/orders`);
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
