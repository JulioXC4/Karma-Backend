const {Order,ShoppingCart} = require('../db.js')

const getAllOrder = async(req,res) =>{
    try {
        const order = await Order.findAll()
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
            return res.status(400).send(`No existe el pedido con la id:${id}`)
        } else {
            return res.status(200).json(order)
        }
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const createOrder = async(req,res) =>{
    try {
        const {datePurchase,orderStatus,idShoppingCart} = req.body
        const ShopCart = await ShoppingCart.findByPk(idShoppingCart)
        const newOrder = await Order.create({
            datePurchase,
            orderStatus,
            UserId:ShopCart.UserId
        })

        await ShopCart.update({
            OrderId:newOrder.id
        })

        return res.status(200).json(newOrder)
    } catch (error) {
        res.status(400).json({message: error.message})
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
        res.status(400).json({message: error.message})
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
        res.status(400).json({message: error.message})
    }
}

module.exports={
    getAllOrder,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder
}