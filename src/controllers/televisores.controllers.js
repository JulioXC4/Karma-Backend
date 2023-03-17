const {Televisor,Product} = require('../db')

const createTelevisor = async(req,res) =>{
    try {
        const {model,brand,description,price,images,nameTV,typeResolution,systemOperating,tamañoPantalla} = req.body
        const newTV = await Televisor.create({
            name:nameTV,
            typeResolution,
            systemOperating,
            tamañoPantalla,
        })

        const newProduct = await Product.create({
            model,
            brand,
            description,
            price,
            images,
        })
    
        await newTV.setProduct(newProduct)
        return res.json("registrado correctamente")        

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const updateTelevisor = async(req,res) =>{
    try {
        const {idProduct,model,brand,description,price,images,nameTV,typeResolution,systemOperating,tamañoPantalla} = req.body
        const product = await Product.findByPk(idProduct,{
            include:Televisor
        })
        if (!product) {
            return res.status(400).send(`No existe el producto con la id:${idProduct}`)
        } else {
            await product.update({
                model,brand,description,price,images,
            })
            const productTV = await product.getTelevisor()
            const tvID = productTV.dataValues.id

            const TV=await Televisor.findByPk(tvID)
            await TV.update({
                name:nameTV,typeResolution,systemOperating,tamañoPantalla
            })
            return res.status(200).json({message:"Actualizado correctamente"});
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports={
    createTelevisor,
    updateTelevisor
}