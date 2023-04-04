    //MERCADO PAGO
    const mercadopago = require("mercadopago");
    const {Order, ShoppingCart, User, Product} = require('../../db.js')
    const { removeItemsFromProductStock } = require('../../utils/functions.js')

    const {HOST_FRONT, HOST_BACK} = process.env

    //Cuenta para probar mercado pago
    //TEST_USER_124639877
    //RLN7rg1vga

    mercadopago.configure({
    
        access_token:
          //Marcelo 
          //"TEST-5611898071281389-031618-a473ed55ef3e607e910a22367f29b042-1332275363",
          //Julio 
          //"TEST-2732806097343775-040312-71707d7f468d52ae903740a978a46192-281720927",
          //KARMA TEST
          "TEST-6210022801027439-040413-27f58e123b683a364cfc81bf0a917085-1345491369",
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
          //integrar metadata para pasarle id de order
            let preference = {
                items: itemsConvertProperties,
                back_urls: {
                  success: `${HOST_FRONT}/profile/orders`,
                  failure: `${HOST_FRONT}/cart`,
                  pending: `${HOST_FRONT}/contact`,
                },
                auto_return: "approved",
                binary_mode: false,
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

    const handleMercadoPagoWebhook = (req, res) => {
      const topic = req.query.topic
      const paymentId = req.query.id
      const body = req.body

      console.log(req.query)
      console.log(body)

      switch (topic) {
        case 'payment':
          if (body.action === 'payment.cancel') {
            // Pago cancelado
            console.log(`El pago ${paymentId} ha sido cancelado.`)
          } else if (body.action === 'payment.approved') {
            // Pago aprobado
            console.log(`El pago ${paymentId} ha sido aprobado.`)
          } else {
            console.log(`Se recibió un evento de pago con acción ${body.action}.`)
          }
          break
        default:
          console.log(`Se recibió un evento de tipo ${topic}.`)
      }
    
      res.sendStatus(200)
    }

    module.exports = {
        mercadoPagoPayment,
        handleMercadoPagoWebhook
    }

  
