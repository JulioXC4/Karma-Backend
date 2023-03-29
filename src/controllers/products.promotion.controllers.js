const {Product} = require('../db.js');
const {PromoProducts} = require('../utils/consts.js')
// const {getProducts} = require('./products.controllers')

const getAllProductPromo = async(req,res) => {
    try {
            let {quantity} = req.params;
            quantity = parseInt(quantity)
            if (isNaN(quantity)) {
                return res.status(400).send("Debe ser un numero en quantity") 
            }
            const productAssociations = await Product.associations
            const properties = Object.keys(productAssociations)

            let products = await Product.findAll({
                include: properties
            });
            const filteredProducts = products.map(product => {
            const filteredProduct = { ...product.toJSON() };
                for (const key in filteredProduct) {
                if (filteredProduct[key] === null) {
                    delete filteredProduct[key];
                    }
                }
                return filteredProduct;
            }).filter(product => {
            return product.Laptop !== undefined || product.Tablet !== undefined || product.Television !== undefined || product.CellPhone !== undefined;
            });

            if(products < 1){
                return res.status(400).send("No existen productos")
            }else{
                let newProductsPromo=PromoProducts(filteredProducts,quantity)
                return res.status(200).json(newProductsPromo);
            }

        } catch (error) {
            return res.status(400).json({message: error.message})
        }
}

module.exports={
    getAllProductPromo
}