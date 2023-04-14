    const {ProductDiscount, Product} = require('../db.js')

    const createProductDiscount = async(req,res) =>{
        try {
            const {productId, startingDate, endingDate, discountValue} = req.body
            const product = await Product.findByPk(productId)
            if(!product){
                return res.status(400).send(`El producto con id ${productId} no existe`)
            }else{
                await ProductDiscount.create({
                    startingDate: startingDate,
                    endingDate: endingDate,
                    discountValue: discountValue,
                    ProductId: productId
                })
                return res.status(200).send(`Se creo un descuento del ${discountValue}% para el producto ${product.brand} ${product.model}`)
            }
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }

     const getDiscountedProducts = async (req, res) => {
        try {
            const discountedProducts = await ProductDiscount.findAll()
            const discountedProductsIds = discountedProducts.map(discount => {
                return discount.ProductId
            })

            const productsById = await Product.findAll({where: {
                id: discountedProductsIds
            }, include: {model: ProductDiscount, attributes: { exclude: ['id', 'ProductId'] }}})
            if(!productsById || productsById.length === 0){
                return res.status(200).send(`Actualmente no hay productos con descuentos`)
            }else{
                return res.status(200).json(productsById)
            }
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }  

    const removeDiscountByProductId = async (req, res) => {
        try {
            const {productId} = req.query
            const product = await Product.findByPk(productId)
            if(!product){
                return res.status(400).send(`El producto con id ${productId} no existe`)
            }else{
                const discount = await ProductDiscount.findOne({where: {
                    ProductId: product.id
                }})
                await discount.destroy()
                return res.status(200).send(`El descuento del producto ${product.brand} ${product.model} fue removido exitosamente`)
            }
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }

    const updateDiscountByProductId = async  (req, res) => {
        try {
            const {productId, startingDate, endingDate, discountValue} = req.body
            const product = await Product.findByPk(productId)
            if(!product){
                return res.status(400).send(`El producto con id ${productId} no existe`)
            }else{
                const discount = await ProductDiscount.findOne({ where: {
                    ProductId: productId
                }})
                await discount.update({
                    startingDate: startingDate,
                    endingDate: endingDate,
                    discountValue: discountValue
                })
                await discount.save()
                return res.status(200).send(`El descuento del producto ${product.brand} ${product.model} fue actualizado correctamente`)
            }
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }

    module.exports = {
        createProductDiscount,
        getDiscountedProducts,
        removeDiscountByProductId,
        updateDiscountByProductId
    }
