    const axios = require("axios")
    const { Order, User, Product, ShoppingCart } = require('../../db.js');
    const { removeItemsFromProductStock, ChangeOrderStatus, emptyUserShoppingCart, returnProductsToStock, DeleteOrderById, deleteUserShoppingCart } = require('../../utils/functions.js')

    const { HOST_BACK, HOST_FRONT } = process.env

    const PAYPAL_CLIENT_ID = "AfgyX1GpOMq8DFd-T1GrvwMyhCPEeIq_lqBjGl6ZJX6KPbiGQE5_HEAOQn-MtEW3TJkIqpgUvkDOZlog"
    const PAYPAL_SECRET = "EHSjOfBtmbAmS_5IiTGbLxGFDFRXCdIDsQRbIJD5wFW7KdX6Msx7e1F5yI86Om5AgIjbuUNbBxCn7qmP"
    const PAYPAL_API = 'https://api-m.sandbox.paypal.com'

    const stockReserveTimeInterval = async ( minutes, orderId ) => {
      console.log(`Comienza el temporizador para la reserva de stock de la orden: ${orderId}, tiempo asignado: ${minutes} minutos`)
      timeoutId = setTimeout(() => {
          console.log(`Tiempo de la orden ${orderId} expirado (${minutes} minutos)`)
          ChangeOrderStatus(orderId, "Orden Rechazada")
          returnProductsToStock(orderId)
      }, minutes * 60 * 1000)
    }

    const cancelTimer = (orderId) => {
      clearTimeout(timeoutId)
      console.log(`El temporizador de la orden ${orderId} ha sido cancelado`)
    }

    const createOrderPaypal = async (req, res ) =>{

      const { userId, orderId } = req.body
      //const encodedUserId = encodeURIComponent(userId)

      await ChangeOrderStatus(orderId, "Procesando Orden")
      await removeItemsFromProductStock(orderId)
      await stockReserveTimeInterval(5, orderId, res)

      let itemsConvertProperties = []
      let orderTotalValue = 0
      const user = await User.findByPk(userId, { include:{model: Order, include: ShoppingCart } })
      const userOrder = await user.Orders.find(order => order.id === orderId)

      if(!user){
        return res.status(400).send(`El usuario con la id ${userId} no existe`)
      }if(!userOrder || userOrder.length === 0){
        return res.status(400).send(`No se encontro ninguna orden con la id ${orderId}`)
      }else{
        const order = await Order.findByPk(orderId)
        if(!order){
          return res.status(404).send("La orden no se encontro en la base de datos")
        }else{
          try {

            itemsConvertProperties = await Promise.all(userOrder.ShoppingCarts.map( async (product) => {
              const productInShoppingCart = await Product.findByPk(product.id)
              orderTotalValue = orderTotalValue + (productInShoppingCart.price * product.dataValues.amount)
  
              return {
                 id: productInShoppingCart.id,
                 name: `${productInShoppingCart.brand} ${productInShoppingCart.model}`,
                 category_id: productInShoppingCart.constructor.name,
                 quantity: product.dataValues.amount,
                 unit_amount: {
                  currency_code: 'USD',
                  value: productInShoppingCart.price,
                },
              }
            }))

            const paypalOrder = {
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: orderTotalValue,
                    breakdown: {
                      item_total: {
                        currency_code: 'USD',
                        value: orderTotalValue
                      }
                  }
                  },
                  items: itemsConvertProperties
                },
              ],
              application_context: {
                brand_name: `${HOST_FRONT}`,
                landing_page: "NO_PREFERENCE",
                user_action: "PAY_NOW",
                return_url: `${HOST_BACK}/payments/captureOrderPaypal?orderId=${orderId}`,
                cancel_url: `${HOST_BACK}/payments/cancelOrderPaypal?orderId=${orderId}`,
              },
            };
              //Obtener token
              const params = new URLSearchParams();
              params.append("grant_type", "client_credentials")
          
              const { data: { access_token },} = await axios.post(
                `${PAYPAL_API}/v1/oauth2/token`,
                params,
                {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  auth: {
                    username: PAYPAL_CLIENT_ID,
                    password: PAYPAL_SECRET,
                  },
                }
              );

              //Enviar la orden
              const response = await axios.post(
                `${PAYPAL_API}/v2/checkout/orders`,
                paypalOrder,
                {
                  headers: {
                    Authorization: `Bearer ${access_token}`,
                  },
                }
              );

              return res.json(response.data.links[1])
    
          } catch (error) {
            return res.status(400).json({message: error.message})
          } 
        }
      }
    }

    const captureOrderPaypal = async (req, res ) =>{
    
      const { token, orderId } = req.query

      if(!token ){

        return res.status(400).send("Parametros por query faltantes o incorrectos")

      }else{

        try {

          const response = await axios.post(
            `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
            {},
            {
              auth: {
                username: PAYPAL_CLIENT_ID,
                password: PAYPAL_SECRET,
              },
            }
          )
          if(response.data.status === 'COMPLETED'){
  
            //Lo que pasa una vez si el pago esta aprobado
            cancelTimer(orderId)
            await ChangeOrderStatus(orderId, "Orden Pagada")
            await emptyUserShoppingCart(orderId)

            return res.redirect(`${HOST_FRONT}/profile/orders`)
            
          }else{
            return res.status(400).send(`PAGO PENDIENTE`)
          }
        } catch (error) {
  
          return res.status(500).json({message: error.message})

        }
      }

    };
     
    const cancelOrderPaypal = async (req, res ) =>{
 
      const { orderId } = req.query

      cancelTimer(orderId)
      await ChangeOrderStatus(orderId, "Orden Rechazada")
      await returnProductsToStock(orderId)
      await DeleteOrderById(orderId)

      return res.redirect(`${HOST_FRONT}/profile/orders`)
    }

module.exports = {
    createOrderPaypal,
    captureOrderPaypal,
    cancelOrderPaypal
  }