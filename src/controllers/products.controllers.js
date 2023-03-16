const {Product, Laptop, Tablet, conn} = require('../db.js');

    const createProduct = async (req, res) => {

        try {

        const { model, brand, description, price, image } = req.body

        const errors = [];

        if (!model || typeof model !== 'string' || model.length < 2) {
          errors.push('El campo "model" debe tener al menos 2 caracteres.');
        }

        if (!brand || typeof brand !== 'string' || brand.length < 2) {
          errors.push('El campo "brand" debe tener al menos 2 caracteres.');
        }

        if (!description || typeof description !== 'string' || description.length < 2) {
          errors.push('El campo "description" debe tener al menos 2 caracteres.');
        }

        if (!price || typeof price !== 'number' || price <= 0) {
          errors.push('El campo "price" no es válido.');
        }

        if (!image || typeof image !== 'string' || image.length < 2) {
          errors.push('El campo "image" debe tener al menos 2 caracteres.');
        }

        if (errors.length > 0) {
          return res.status(400).json({ message: 'Error al crear producto.', errors });
        }

        else{

            const newProduct = await Product.create({

                model: model, 
                brand: brand,
                description: description, 
                price: price, 
                image: image
    
                })
    
            if(!newProduct){
    
                return res.status(400).send("No se pudo crear el producto")
    
            }else{
    
                return res.status(200).json(newProduct);
    
            }
        }

        } catch (error) {

                return res.status(500).json({ message: "Error interno del servidor" });

        }

    };

    const getProducts = async (req, res) => {

        try {

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
          return product.Laptop !== undefined || product.Tablet !== undefined;
        });

        if(!products){

            return res.status(400).send("No existen productos")

        }else{

            return res.status(200).json(filteredProducts);

        }

        } catch (error) {

            return res.status(400).json({message: error.message})

        }

    };

    const getProduct = async (req, res) => {

      try {

        const { id } = req.query;
        const product = await Product.findByPk(id);
    
        if (!product) {

          return res.status(400).send(`No existe el producto con la id ${id}`);

        } else {

          const productAssociations = await Product.associations;
          const properties = Object.keys(productAssociations);
          const productRelations = {};
    
          for (let index = 0; index < properties.length; index++) {
            const modelName = productAssociations[properties[index]].target.name;

            const relation = await conn.models[modelName].findAll({
              where: { ProductId: id },
            });

            if (relation.length) {
              productRelations[properties[index]] = relation;
            }
          }

          const productWithRelations = { ...product.toJSON(), ...productRelations };
    
          return res.status(200).json(productWithRelations);

        }
      } catch (error) {

        return res.status(400).json({ message: error.message });

      }

    };

    const updateProduct = async (req, res) => {

      try {

        const { id, model, brand, description, price, image  } = req.body

        const errors = [];

        if (!id) {
          errors.push('El campo "id" es obligatorio.');
        }

        if (!model || typeof model !== 'string' || model.length < 2) {
          errors.push('El campo "model" debe tener al menos 2 caracteres.');
        }

        if (!brand || typeof brand !== 'string' || brand.length < 2) {
          errors.push('El campo "brand" debe tener al menos 2 caracteres.');
        }

        if (!description || typeof description !== 'string' || description.length < 2) {
          errors.push('El campo "description" debe tener al menos 2 caracteres.');
        }

        if (!price || typeof price !== 'number' || price <= 0) {
          errors.push('El campo "price" no es válido.');
        }

        if (!image || typeof image !== 'string' || image.length < 2) {
          errors.push('El campo "image" debe tener al menos 2 caracteres.');
        }

        if (errors.length > 0) {
          return res.status(400).json({ message: 'Error al crear producto.', errors });
        }

      else{

          const product = await Product.findByPk(id)

          await product.update({

            id: id, 
            model: model, 
            brand: brand,
            description: description, 
            price: price, 
            image: image

            })

          await product.save()

          if(!product){

              return res.status(400).send(`No existe el producto con la id ${id}`)

          }else{

              return res.status(200).json(product);

          }
      }

      } catch (error) {

        console.log(error)

          return res.status(500).json({ message: "Error interno del servidor" });

      }

    };


    const deleteProduct = async (req, res) => {
    
      try {
      
      const {id} = req.query
      
      const product = await Product.findByPk(id)
      
      if(!product){
      
          return res.status(400).send(`No existe el producto con la id ${id}`)
      
      }else{
      
          await product.destroy()

          return res.status(200).send("Producto eliminado");
      
      }
    
      } catch (error) {
      
          return res.status(400).json({message: error.message})
      
      }
    
    };


    module.exports = {
        createProduct,
        getProducts,
        getProduct,
        updateProduct,
        deleteProduct
    };