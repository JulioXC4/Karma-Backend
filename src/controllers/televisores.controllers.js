const {Televisores,Product} = require('../db')

const getAllTelevisor = async(req,res) =>{
    try {
        const tv = await Televisores.findAll()

        if (tv.length < 1) {
            return res.status(400).send("No existen registros de TV")
        } else {
            return res.status(200).json(tv);
        }
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const getTelevisor = async(req,res) =>{
    try {
        const {id} = req.query
        const tv = await Product.findByPk(id,{
            include:Televisores
        })
        if (!tv) {
            return res.status(400).send(`No existe un TV con la id ${id}`)
        }else{
            return res.status(200).json(tv)
        }
        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const createTelevisor = async(req,res) =>{
    try {
        const {nameTV,typeResolution,systemOperating,tamañoPantalla,nameProduct,description,price,image} = req.body
        const newTV = await Televisores.create({
            name:nameTV,
            typeResolution,
            systemOperating,
            tamañoPantalla,
        })

        if (!newTV) {
            return res.status(400).send("No se pudo crear la TV")
        } else {
            const newProduct = await Product.create({
                name:nameProduct,
                description,
                price,
                image,
            })
    
            await newTV.setTelevisores(newProduct)
            return res.send("Registrado correctamente")
        }
        

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports={
    getAllTelevisor,
    getTelevisor,
    createTelevisor
}