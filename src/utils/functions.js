const { default: axios } = require('axios');
const {Order, ShoppingCart, Product, User} = require('../db.js');
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

    shoppingCartOrder.forEach( async (product) => {

        const currentProduct = await Product.findByPk(product.id)
        await currentProduct.update({
            stock: currentProduct.stock - product.amount
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
        console.log(`Estado de orden actualizada`)

    } catch (error) {
        console.log(error)
    }
    
}

const emptyUserShoppingCart = async (orderId) => {
    try {
        const order = await Order.findByPk(orderId)
        const user = await User.findByPk(order.userId)

        await user.setShoppingCarts([])
        console.log(`Carrito de compras del usuario ${user.email} vaciado correctamente`)
    } catch (error) {
        console.log(error)
    }
}
module.exports= {createInitialData, removeItemsFromProductStock, ChangeOrderStatus, emptyUserShoppingCart}