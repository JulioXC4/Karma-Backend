    //MERCADO PAGO
    const mercadopago = require("mercadopago")
    const { default: axios } = require("axios")
    const {Order, ShoppingCart, User, Product} = require('../../db.js')
    const { removeItemsFromProductStock } = require('../../utils/functions.js')

    const {HOST_FRONT, HOST_BACK, MERCADOPAGO_API_KEY, MERCADOPAGO_DOMAIN_TO_REDIRECT} = process.env
    let timer = 0
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
                  success: `${HOST_BACK}/payments/approvedPaymentMercadoPago`,
                  failure: `${HOST_BACK}/payments/failedPaymentMercadoPago`,
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

/*     const getPayment = async (paymentId) => {

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
 */
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

    const disableMerchantOrderById = async (merchantOrderId) => {
      try {
        await axios.put(`https://api.mercadopago.com/merchant_orders/${merchantOrderId}`, 
        { notification_url: MERCADOPAGO_DOMAIN_TO_REDIRECT},
        {
          headers: {
            'Authorization': `Bearer ${MERCADOPAGO_API_KEY}`,
            'Content-Type': 'application/json'
          }
        })
      } catch (error) {
        console.error(error)
      }
    }

    const runOnce = () => {
      console.log("Dentro de runOnce")
      let executed = false;
      return async () => {
        console.log("Dentro del asyn de runOnce")
        if (!executed) {
          executed = true;
          console.log("execite cambia a true");
          await new Promise((resolve) => setTimeout(resolve, 1 * 60 * 1000));
          console.log('La función se ejecutó después de 1 minuto1');
        }
      };
    };
    
    const myAsyncFunction = async (t) => {

      if(t === 0){
        t = 1
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(console.log("TEMPORIZADOR 20 segundos "));
          }, 20*1000)
        })
      }else{
        console.log("El temporizador ya ha iniciado")
      }
    }

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

    const approvedPaymentMercadoPago = async (req, res) => {

      const {merchant_order_id, collection_status} = req.query

      const merchantData = await getMerchantOrder(merchant_order_id)

      if(merchantData.status === 'closed' && collection_status === 'approved'){
        console.log("Dentro de la funcion aprobado, Pago aprobado")
         //Primero verificar si el status order ya se cambio
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
        handleMercadoPagoWebhook,
        approvedPaymentMercadoPago,
        failedPaymentMercadoPago
    }

  
