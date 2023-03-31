const {Order,ShoppingCart,User,Product} = require('../db.js')

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
        const order = await Order.findByPk(id,{
            include:[{
                model:ShoppingCart,
                include:[{
                    model:Product
                }]
            }]
        })
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
        const {datePurchase,orderStatus,idUser} = req.body

        const UserCarts = await User.findByPk(idUser,{
            attributes:['id'],
            include:[{
                model:ShoppingCart,
                where:{
                    OrderId:null
                }
            }]
        })
        if (!UserCarts) {
            return res.status(400).json({error:"Debes ingresar un usuario existente"})
        }
        if (UserCarts.ShoppingCarts.length < 1) {
            return res.status(400).json({error:"El usuario no tiene carritos de compra"})
        }

        let idOrder=0;
        
        for (let i = 0; i < UserCarts.ShoppingCarts.length; i++) {
            let idShop=UserCarts.ShoppingCarts[i].id
            const ShopCart = await ShoppingCart.findByPk(idShop)
            if (!idOrder) {
                const newOrder = await Order.create({
                    datePurchase,
                    orderStatus,
                    UserId:ShopCart.UserId
                })
                idOrder = newOrder.id
            }
            const asignOrder = await Order.findByPk(idOrder)
            await ShopCart.update({
                OrderId:asignOrder.id
            })
        }

        const totalOrder = await Order.findByPk(idOrder,{
            include:[{
                model:ShoppingCart,
                include:[{model:Product}]
            }]
        })
        res.send(totalOrder)
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