    //MERCADO PAGO
    const mercadopago = require("mercadopago")
    const { default: axios } = require("axios")
    const {Order, ShoppingCart, User, Product} = require('../../db.js')
    const { removeItemsFromProductStock,ChangeOrderStatus } = require('../../utils/functions.js')

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

            removeItemsFromProductStock(orderId)
            myAsyncFunction()
            
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
                metadata: { "idOrder": `The order id is: ${orderId} `}
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

    const getMerchantOrder = async (merchantOrderId) => {
      try {
        const response = await axios.get(`https://api.mercadopago.com/merchant_orders/${merchantOrderId}`, {
          headers: {
            'Authorization': `Bearer ${MERCADOPAGO_API_KEY}`
          }
        })
       return response.data
      } catch (error) {
        console.error(error)
      }
    }

    const myAsyncFunction = async () => {
        console.log("Comienza el temporizador, 2 minutos")
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(console.log("! Pasaron 2 minutos ¡ Tiempo expirado"));
          }, 2*60*1000)
        })
      
    }

   /*  const handleMercadoPagoWebhook = async (req, res) => {
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
    } */

    const approvedPaymentMercadoPago = async (req, res) => {

      const {merchant_order_id, collection_status} = req.query

      const merchantData = await getMerchantOrder(merchant_order_id)

      if(merchantData.status === 'closed' && collection_status === 'approved'){

        console.log("merchDATA: ", merchantData)
        //ChangeOrderStatus(orderid, "Orden Pagada")
        console.log("Vaciar carrito de compras")
        console.log("Cambiar order status a pago validado")
      }else{
        console.log("Dentro de la funcion aprobado, Dentro del else")
      }
      return res.redirect(`${HOST_FRONT}/rutaFrontAprobada`);
    }

    const failedPaymentMercadoPago = (req, res) => {
      
      //devolver productos a stock o devolverlos hasta 5 minutos
      console.log("Query del payment fallido",req.query)
      console.log("Cancellar la Merchant Orden y devolver productos a stock")

      return res.redirect(`${HOST_FRONT}/rutaFrontFallida`);
    }

    module.exports = {
        mercadoPagoPayment,
        //handleMercadoPagoWebhook,
        approvedPaymentMercadoPago,
        failedPaymentMercadoPago
    }

  
