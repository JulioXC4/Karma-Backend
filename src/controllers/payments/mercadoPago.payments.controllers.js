    //MERCADO PAGO
    const mercadopago = require("mercadopago")
    const { default: axios } = require("axios")
    const {Order, ShoppingCart, User, Product, ProductDiscount} = require('../../db.js')
    const { 
      removeItemsFromProductStock, 
      ChangeOrderStatus, 
      emptyUserShoppingCart, 
      returnProductsToStock, 
      DeleteOrderById, 
      deleteUserShoppingCart, 
      stockReserveTimeInterval, 
      cancelTimer, 
      setPurchaseOrder,
      addSoldProductsToAnalytics 
    } = require('../../utils/functions.js')
    const {  sendPaymentConfirmationEmail } = require('../../utils/emailer.js')
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
            await stockReserveTimeInterval(9, orderId)
            
            const currentDate = new Date()
            const year = currentDate.getFullYear()
            const month = String(currentDate.getMonth() + 1).padStart(2, '0')
            const day = String(currentDate.getDate()).padStart(2, '0')

            const formattedDate = `${year}-${month}-${day}`

            itemsConvertProperties = await Promise.all(userOrder.ShoppingCarts.map( async (shopCart) => {
              const productInShoppingCart = await Product.findByPk(shopCart.ProductId, {include: {model: ProductDiscount}})
              
            /*   if(productInShoppingCart.stock < shopCart.amount ){

                return res.status(400).send(`Stock agotado en producto: ${productInShoppingCart.brand}  ${productInShoppingCart.model}, stock actual: ${productInShoppingCart.stock}, stock requerido en la orden: ${shopCart.amount} `)
              } */

              if(productInShoppingCart.ProductDiscount !== null && productInShoppingCart.ProductDiscount.startingDate <= formattedDate && productInShoppingCart.ProductDiscount.endingDate >= formattedDate ){

                const price = productInShoppingCart.price
                const discountVal = productInShoppingCart.ProductDiscount.discountValue
                const discount = (price * discountVal) / 100

                const priceWithDiscount = price - discount

                return {
                  id: productInShoppingCart.id,
                  title: `${productInShoppingCart.brand} ${productInShoppingCart.model}`,
                  currency_id: 'USD',
                  picture_url: productInShoppingCart.images[0],
                  description: 'Descripcion del producto',
                  category_id: productInShoppingCart.constructor.name,
                  quantity: shopCart.dataValues.amount,
                  unit_price: parseFloat(priceWithDiscount.toFixed(2))
               }
              }else{

                return {
                   id: productInShoppingCart.id,
                   title: `${productInShoppingCart.brand} ${productInShoppingCart.model}`,
                   currency_id: 'USD',
                   picture_url: productInShoppingCart.images[0],
                   description: 'Descripcion del producto',
                   category_id: productInShoppingCart.constructor.name,
                   quantity: shopCart.dataValues.amount,
                   unit_price: productInShoppingCart.price
                }
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


const approvedPaymentMercadoPago = async (req, res) => {
  try {
    const { merchant_order_id, collection_status } = req.query;
    const merchantData = await getMerchantOrder(merchant_order_id);
   
    const order = await Order.findOne({
      where: { orderStatus: 'Procesando Orden' },
      include: [{ model: User }]
    });

    if (merchantData.status === 'closed' && collection_status === 'approved') {
      const orderId = order.id;

       // consulta SELECT para obtener los datos de compra del usuario
       const shoppingCartItems = await ShoppingCart.findAll({
        where: {
          OrderId: orderId
        },
        include: [
          { model: Product },
          { model: User }
        ]
      });

      // aquí puedes hacer algo con los datos de compra del usuario, por ejemplo, enviarlos por correo electrónico

      // enviar correo electrónico de confirmación de pago al usuario
      const email = order.User.email;
      const orderDate = order.createdAt.toLocaleDateString();
      const orderNumber = order.id;
      const productDescription = shoppingCartItems.map(item => item.Product).join(", ");
      const totalPrice = order.totalPrice;
      await sendPaymentConfirmationEmail({ email, shoppingCartItems, orderDate,  orderNumber, productDescription, totalPrice });

      await cancelTimer(orderId);
      await ChangeOrderStatus(orderId, 'Orden Pagada');
      await setPurchaseOrder(orderId);
      await addSoldProductsToAnalytics (orderId);
      await deleteUserShoppingCart(orderId);
      await cancelMerchOrder(merchant_order_id);

     //test

      return res.redirect(`${HOST_FRONT}/profile/orders`);
    } else {
      throw new Error('El pago no ha sido aprobado');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


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
