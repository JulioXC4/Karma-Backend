    //MERCADO PAGO
    const mercadopago = require("mercadopago");

    const {HOST_FRONT} = process.env

    //Cuenta para probar mercado pago
    //TEST_USER_124639877
    //RLN7rg1vga

    mercadopago.configure({
    
        access_token:
          "TEST-5611898071281389-031618-a473ed55ef3e607e910a22367f29b042-1332275363",
        sandbox: true,
        
    })

    const mercadoPagoPayment = async (req, res) => {

        try {
          const { itemsOrderArray } = req.body
          const itemsConvertProperties = await itemsOrderArray.map( product => {
            return {
               id: product.ProductId,
               title: `${product.Product.brand} ${product.Product.model}`,
               currency_id: 'USD',
               picture_url: product.Product.images[0],
               //description: product.Product.description,
               description: 'Descripcion del producto',
               category_id: Object.keys(product)[4],
               quantity: product.amount,
               unit_price: product.Product.price
            }
          })

            let preference = {
                items: itemsConvertProperties,
                back_urls: {
                  success: `${HOST_FRONT}/profile/orders`,
                  failure: `${HOST_FRONT}/cart`,
                  pending: `${HOST_FRONT}/contact`,
                },
                auto_return: "approved",
                binary_mode: true,
            }
    
            const response = await mercadopago.preferences.create(preference)

            if (!response) {
                throw new Error('No se pudo crear la preferencia en MercadoPago');
            }

            return res.status(200).json( response.body.sandbox_init_point )

        } catch (error) {

            return res.status(400).send({ error: error.message })

        }
       
    }

    module.exports = {
        mercadoPagoPayment,
    }

  
