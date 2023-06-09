const { default: axios } = require('axios');
const {Order, ShoppingCart, Product, User, ProductDiscount} = require('../db.js');
const data = require('../utils/data.json')
const {HOST_BACK} = process.env

//FUNCTIONS
const createInitialData = async () => {

    //CREATE USERS
    await Promise.all(
        data.users.map(async (user) => {
            await axios.post(`${HOST_BACK}/user/createUser`, user)
        })
    )

    //CREATE TABLETS
    await Promise.all(
        data.products[0]["Tablets"].map(async (tablet) => {
            await axios.post(`${HOST_BACK}/tablet/createTablet`, tablet)
        })
    )

    //CREATE LAPTOPS
    await Promise.all(
        data.products[1]["Laptops"].map(async (laptop) => {
            await axios.post(`${HOST_BACK}/laptop/createLaptop`, laptop)
        })
    )
     //CREATE CELLPHONE
 await Promise.all(
    data.products[2]["CellPhone"].map(async (cellphone) => {
        await axios.post(`${HOST_BACK}/cellPhone/createCellPhone`, cellphone)
    })
)

    //CREATE TELEVISORES
    await Promise.all(
        data.products[3]["Television"].map(async(tv) =>{
            await axios.post(`${HOST_BACK}/tv/createTelevision`, tv)
        })
    )
}

//REMOVE PRODUCTS
const removeItemsFromProductStock = async (orderId) => {
    const order = await Order.findByPk(orderId, {include: {model: ShoppingCart} })
    
    const shoppingCartOrder = order.ShoppingCarts

    shoppingCartOrder.forEach( async (shopCart) => {

        const currentProduct = await Product.findByPk(shopCart.ProductId)
        await currentProduct.update({
            stock: currentProduct.stock - shopCart.amount
        })
        await currentProduct.save()

    })
}

//CHANGE STATUS
const ChangeOrderStatus = async (orderId, status) => {

    try {
        const order = await Order.findByPk( orderId )
        await order.update({
            orderStatus: status
        })
        await order.save()
        console.log(`Estado de orden actualizado: ${status}`)

    } catch (error) {
        console.log(error)
    }
    
}

const DeleteOrderById = async (orderId) => {

    try {
        const order = await Order.findByPk(orderId)
        if (!order) {
            console.log(`No se encontró la orden con el ID: ${orderId}`)
            return
        }else{
            if(order.orderStatus === 'Orden Rechazada'){
                await order.destroy()
                console.log(`Orden ${orderId} eliminada con éxito.`)
            }else{
                throw new Error("La orden debe estar en estado: 'Orden Rechazada'");
            }
        }

    } catch (error) {
        console.log(error)
    }
}

const emptyUserShoppingCart = async (orderId) => {

    try {
        const order = await Order.findByPk(orderId)
        const user = await User.findByPk(order.UserId)

        await user.setShoppingCarts([])
        console.log(`Carrito de compras del usuario ${user.email} vaciado correctamente`)
    } catch (error) {
        console.log(error)
    }
}

const deleteUserShoppingCart = async (orderId) => {

    try {
        const order = await Order.findByPk(orderId)
        const user = await User.findByPk(order.UserId)

        // Obtener los carritos de compra del usuario
        const shoppingCarts = await user.getShoppingCarts()
        // Borrar cada carrito de compra
        await Promise.all(shoppingCarts.map(async (shoppingCart) => {
            await shoppingCart.destroy()
        }))
        console.log(`Carrito de compras del usuario ${user.email} fue eliminado correctamente`)
    } catch (error) {
        console.log(error)
    }
}

const returnProductsToStock = async (orderId) => {

    try {
        const order = await Order.findByPk(orderId, {include: {model: ShoppingCart} })
        const shoppingCartOrder = order.ShoppingCarts

        shoppingCartOrder.forEach( async (product) => {

            const currentProduct = await Product.findByPk(product.id)
            await currentProduct.update({
                stock: currentProduct.stock + product.amount
            })
            await currentProduct.save()
    })
    console.log(`Producto de la orden ${orderId} devueltos al stock`)
    } catch (error) {
        console.log(error)
    }
}

const setPurchaseOrder = async (orderId) => {

    try {
        const order = await Order.findByPk(orderId)
        const userId = order.UserId

        const userShoppingCarts = await User.findByPk(userId,{include: {
            model: ShoppingCart,
            include: {
                model: Product,
                include: {
                    model: ProductDiscount
                }
            }
        }})

        await order.update({
            orderData: userShoppingCarts
        })
        await order.save()

        console.log(`La informacion de la orden ${orderId} fue guardada correctamente`)
    } catch (error) {
        console.log(error)
    }
}

const stockReserveTimeInterval = async ( minutes, orderId ) => {

    const currentOrder = await Order.findByPk(orderId)
    console.log(`Comienza el temporizador para la reserva de stock de la orden: ${orderId}, tiempo asignado: ${minutes} minutos`)
    timeoutId = setTimeout(async() => {
      console.log("MERCADOPAGO:", currentOrder.orderStatus)
      if(currentOrder.orderStatus === 'Procesando Orden'){
        console.log(`Tiempo de la orden ${orderId} expirado (${minutes} minutos)`)
        await ChangeOrderStatus(orderId, "Orden Rechazada")
        await returnProductsToStock(orderId)
        await DeleteOrderById(orderId)
      }else{
        console.log(`Para que el temporizador de la orden ${orderId} sea cancelado, la orden debe estar en proceso`)
      }
    }, minutes * 60 * 1000)

  }

  const cancelTimer = async (orderId) => {
      clearTimeout(timeoutId)
      console.log(`El temporizador de la orden ${orderId} ha sido cancelado`)
  }

  const addSoldProductsToAnalytics = async (orderId) => {
    
    const order = await Order.findByPk(orderId)
    if(!order){
        throw new Error(`El producto con el id ${orderId} no existe`);
    }
    const {orderData} = order

    await orderData.ShoppingCarts.map( async (shopCart) => {
        const product = await Product.findByPk(shopCart.ProductId)
        await product.update({
            analytical: { "sold": product.analytical.sold + shopCart.amount, "clicked": product.analytical.clicked }
        })
        await product.save()
        console.log(`Producto/s comprados. Analiticas del producto ${product.brand} ${product.model}: comprados: ${product.analytical.sold}, clickeados: ${product.analytical.clicked}`)
    })

  }


  const sumProductsById = (arr) => {
    const result = {}
  
    arr.forEach((subArr) => {
      subArr.forEach((obj) => {
        const productId = obj.productId
        const quantity = obj.quantity
  
        if (result[productId]) {
          result[productId].quantity += quantity
        } else {
          result[productId] = { productId, quantity }
        }
      })
    })
  
    return Object.values(result)
  }
  

module.exports= {
    createInitialData, 
    removeItemsFromProductStock, 
    ChangeOrderStatus, 
    emptyUserShoppingCart, 
    returnProductsToStock, 
    DeleteOrderById,
    deleteUserShoppingCart, 
    setPurchaseOrder, 
    stockReserveTimeInterval, 
    cancelTimer,
    addSoldProductsToAnalytics,
    sumProductsById
}