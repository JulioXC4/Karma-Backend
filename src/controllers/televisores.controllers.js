const {Televisores,Product} = require('../db.js')

const getAllTelevisor = async(req,res) =>{
    try {
        const tv = await Televisores
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