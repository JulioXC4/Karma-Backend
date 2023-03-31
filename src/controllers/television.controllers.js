const {Television,Product} = require('../db')

const createTelevision = async(req,res) =>{
    try {
        const {model,brand,description,price,images,stock,nameTV,typeResolution,systemOperating,screenSize} = req.body
        const newTV = await Television.create({
            name:nameTV,
            typeResolution,
            systemOperating,
            screenSize,
        })

        const newProduct = await Product.create({
            model,
            brand,
            description,
            price,
            images,
            stock
        })
    
        await newTV.setProduct(newProduct)
        return res.json("registrado correctamente")        

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const updateTelevision = async(req,res) =>{
    try {
        const {idProduct,model,brand,description,price,images,stock,nameTV,typeResolution,systemOperating,screenSize} = req.body
        const product = await Product.findByPk(idProduct,{
            include:Television
        })
        if (!product) {
            return res.status(400).send(`No existe el producto con la id:${idProduct}`)
        } else {
            await product.update({
                model,brand,description,price,images,stock
            })
            const productTV = await product.getTelevision()
            const tvID = productTV.dataValues.id

            const TV=await Television.findByPk(tvID)
            await TV.update({
                name:nameTV,typeResolution,systemOperating,screenSize
            })
            return res.status(200).json({message:"Actualizado correctamente"});
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports={
    createTelevision,
    updateTelevision
}