    //MERCADO PAGO
    const mercadopago = require("mercadopago")
    const { default: axios } = require("axios")
    const {Order, ShoppingCart, User, Product} = require('../../db.js')
    const { removeItemsFromProductStock } = require('../../utils/functions.js')

    const {HOST_FRONT, HOST_BACK, MERCADOPAGO_API_KEY} = process.env

    //Cuenta para probar mercado pago
    //TEST_USER_124639877
    //RLN7rg1vga

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
                  success: `${HOST_FRONT}/profile/orders`,
                  failure: `${HOST_BACK}/payments/failureMercadoPago`,
                  pending: ``,
                },
                auto_return: "approved",
                //Evitamos tener pagos pendientes
                binary_mode: true,
                notification_url: `${HOST_BACK}/payments/mercadoPagoWebhook`,
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

    const getPayment = async (paymentId) => {

      try {

        const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: {
            'Authorization': `Bearer ${MERCADOPAGO_API_KEY}`,
            'Content-Type': 'application/json'
          }
        })

       return response.data

      } catch (error) {

        console.error(error)
      }

    }

    const handleMercadoPagoWebhook = (req, res) => {

      const {topic} = req.query
      const {action, id} = req.body

      console.log(req.body)

      switch (topic) {
        case 'payment':
          if (action === 'payment.created') {
            const payment = getPayment(id)
            console.log(payment)
          } 

          else {
            console.log(`Se recibió un evento de pago con acción ${action}.`)
          }

          break
        default:
          console.log(`Se recibió un evento de tipo ${topic}.`)
      }
    
      return res.status(200)

    }

    const approvedPaymentMercadoPago = (req, res) => {

      //const {id} = req.query
      console.log(req.query)
      console.log("Dentro de la funcion si se aprueba el pago por mercadopago")

      return res.redirect(`${HOST_FRONT}/rutaFrontAprobada`);
    }

    const failedPaymentMercadoPago = (req, res) => {
      
      //const {id} = req.query
      console.log(req.query)
      console.log("Dentro de la funcion si falla el pago por mercadopago")

      return res.redirect(`${HOST_FRONT}/rutaFrontFallida`);
    }

    module.exports = {
        mercadoPagoPayment,
        handleMercadoPagoWebhook,
        approvedPaymentMercadoPago,
        failedPaymentMercadoPago
    }

  
