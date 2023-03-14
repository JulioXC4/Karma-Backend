const {Product} = require('../db.js');

    const createProduct = async (req, res) => {

        try {

        const { name, description, price, image } = req.body

        const errors = [];

        if (!name || typeof name !== 'string' || name.length < 2) {
          errors.push('El campo "name" debe tener al menos 2 caracteres.');
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

                name: name, 
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

        const products = await Product.findAll()

        if(!products){

            return res.status(400).send("No existen productos")

        }else{

            return res.status(200).json(products);

        }

        } catch (error) {

            return res.status(400).json({message: error.message})

        }

    };

    const getProduct = async (req, res) => {

      try {

      const {id} = req.query

      const product = await Product.findByPk(id)

      if(!product){

          return res.status(400).send(`No existe el producto con la id ${id}`)

      }else{

          return res.status(200).json(product);

      }

      } catch (error) {

          return res.status(400).json({message: error.message})

      }

  };

    const updateProduct = async (req, res) => {

      try {

        const { id, name, description, price, image } = req.body

        const errors = [];

        if (!id) {
            errors.push('El campo "id" es obligatorio.');
          }

        if (!name || typeof name !== 'string' || name.length < 2) {
          errors.push('El campo "name" debe tener al menos 2 caracteres.');
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
            name: name, 
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