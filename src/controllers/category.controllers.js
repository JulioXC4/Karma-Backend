const {Category} = require('../db.js')

const getAllCategory = async(req,res) =>{
    try {
        const categoria = await Category.findAll()
        if (categoria.length < 1) {
            return res.status(400).send("No existen registros de categorias")
        } else {
            return res.status(200).json(categoria);
        }
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const getCategory = async(req,res) =>{
    try {
        const {id} = req.query
        const categoria = await Category.findByPk(id)
        if (!categoria) {
            return res.status(400).send(`No existe la categoria con la id ${id}`)
        } else {
            return res.status(200).json(categoria)
        }
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const createCategory = async(req,res) =>{
    try {
        const {name} = req.body
        if (typeof name !== 'string' && name !== null) {
            return res.status(400).json({ message: 'Error el name no es un string'});
        }else{
            const newCategory = await Category.create({
                name
            })
            return res.status(200).json(newCategory)
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const updateCategory = async(req,res) =>{
    try {
        const {id,name} = req.body
        const category = await Category.findByPk(id)
        if (!category) {
            return res.status(400).send(`No existe la categoria con la id:${id}`)
        } else if (typeof name !== 'string' && name !== null) {
            return res.status(400).json({ message: 'Error el name no es un string'});
        } else {
            await category.update({
                name
            })
            return res.status(200).json(category);
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const deleteCategory = async(req,res) =>{
    try {
        const {id} = req.query
        const categoryDelete = await Category.findByPk(id)
        if (!categoryDelete) {
            return res.status(400).send(`No existe la categoria con la id:${id}`)
        } else {
            await categoryDelete.destroy()
            return res.status(200).send("Categoria eliminada");
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

module.exports = {
    getAllCategory,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}