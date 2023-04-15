const {Order, ShoppingCart, User, Product, ProductDiscount} = require('../db.js')

const getAllOrder = async(req,res) =>{
    try {
        const order = await Order.findAll({
            include:[{
                model:ShoppingCart,
            }]
        })
        if (order.length < 1) {
            return res.status(400).send("No existen registros de Pedidos")
        } else {
            return res.status(200).json(order);
        }
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const getOrder = async(req,res) =>{
    try {
        const {id} = req.query
        const order = await Order.findByPk(id)
        if (!order) {
            return res.status(400).send(`No existe el pedido con el id ${id}`)
        } else {
            return res.status(200).json(order)
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const createOrder = async(req,res) =>{
    try {
        const {datePurchase, userId} = req.body

        const user = await User.findByPk(userId)

        if (!user) {
            return res.status(400).send(`El usuario con el id ${userId} no existe`)
        }

        const userShoppingCarts = await User.findByPk(userId,{include: {
            model: ShoppingCart,
            include: {
                model: Product,
                include: {
                    model: ProductDiscount
                }
            }
        }})

        const newOrder = await Order.create({
            datePurchase: datePurchase,
            orderData: null,
            UserId: userId
        })

        userShoppingCarts.ShoppingCarts.forEach( async (shopCart) => {
            const currentShopCart = await ShoppingCart.findByPk(shopCart.id)
            await currentShopCart.update({
                OrderId: newOrder.id
            })
            await currentShopCart.save()
        })
        
        return res.status(200).send(newOrder)

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const updateOrder = async(req,res) =>{
    try {
        const {id,datePurchase,orderStatus} = req.body
        const order = await Order.findByPk(id)
        if (!order) {
            return res.status(400).send(`No existe un pedido con la id:${id}`)
        } else {
            await order.update({
                datePurchase,
                orderStatus
            })
            return res.status(200).json(order);
        }
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const deleteOrder = async(req,res) =>{
    try {
        const {id} = req.query
        const orderDelete = await Order.findByPk(id)
        if (!orderDelete) {
            return res.status(400).send(`No existe el pedido con la id:${id}`)
        } else {
            await orderDelete.destroy()
            return res.status(200).send("Pedido eliminado");
        }
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

module.exports={
    getAllOrder,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder
}