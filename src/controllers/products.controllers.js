const {User, Product, Laptop, Tablet, ProductDiscount,Order, conn} = require('../db.js');
const {Op} = require('sequelize')
const {PromoProducts} = require('../utils/consts.js')
const { sumProductsById } = require('../utils/functions.js')

    const createProduct = async (req, res) => {

        try {

        const { model, brand, description, price, images, stock, dateCreated } = req.body

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

        if (!images || !Array.isArray(images) || images.length === 0) {
          errors.push('El campo "image" debe ser un arreglo y debe contener como minimo un elemento.');
        }

        if (!stock || typeof stock !== 'number' || stock <= 0) {
          errors.push('El campo "stock" no es válido.');
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
                images: images,
                stock: stock,
                dateCreated: dateCreated
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
        const {start, end} = req.query
        const productAssociations = await Product.associations
        const properties = Object.keys(productAssociations)

        let products = await Product.findAll({

          include: properties
        })
        const filteredProducts = products.map(product => {
          const filteredProduct = { ...product.toJSON() }

          for (const key in filteredProduct) {
            if (filteredProduct[key] === null) {
              delete filteredProduct[key]
            }
          }
          return filteredProduct;
        }).filter(product => {
          return product.Laptop !== undefined || product.Tablet !== undefined || product.Television !== undefined || product.CellPhone;
        })
        if(!products){
            return res.status(400).send("No existen productos")
        }else{
          if(start && end){
            const startInteger = parseInt(start)
            const endInteger = parseInt(end)
            if(isNaN(startInteger) || isNaN(endInteger)){
              return res.status(400).send(`start y end no pueden ser de tipo string`)
            }
            if(startInteger < 0 || startInteger >= endInteger){
              return res.status(400).send(`Parametro start invalido, ingrese un numero mayor a 0 y menor que "end" `)
            }
            if(endInteger < 0 || endInteger > filteredProducts.length){
              return res.status(400).send(`Parametro end invalido, ingrese un numero mayor a 0 y menor que la cantidad de elementos de productos`)
            }
            if(startInteger < endInteger){
              const sliceFilteredProducts = filteredProducts.slice(startInteger, endInteger + 1)
              return res.status(200).json(sliceFilteredProducts)
            }
          }else{
            return res.status(200).json(filteredProducts);
          }
        }
        } catch (error) {
            return res.status(400).json({message: error.message})
        }
    }

    const getProduct = async (req, res) => {

      try {

        const { id } = req.query;
        const product = await Product.findByPk(id);
    
        if (!product) {

          return res.status(400).send(`No existe el producto con la id ${id}`);

        } else {

          const productAssociations = await Product.associations;
          const properties = Object.keys(productAssociations);
          const excludeProperties = properties.filter(elemento => elemento !== "Users");
          const productRelations = {};
    
          for (let index = 0; index < excludeProperties.length; index++) {
            const modelName = productAssociations[excludeProperties[index]].target.name;
            const relation = await conn.models[modelName].findAll({
              where: { ProductId: id },
            });

            if (relation.length) {
              productRelations[excludeProperties[index]] = relation;
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

        const { id, model, brand, description, price, images, stock  } = req.body

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

        if (!images || !Array.isArray(images) || images.length === 0) {
          errors.push('El campo "image" debe ser un arreglo y debe contener como minimo un elemento.');
        }

        if (!stock || typeof stock !== 'number' || stock <= 0) {
          errors.push('El campo "stock" no es válido.');
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
            images: images,
            stock: stock
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

    const getProductsByCategory = async (req, res) => {

      try {
        const {category} = req.query

        const productAssociations = await Product.associations
        const properties = Object.keys(productAssociations)

        const errors = [];

        if (!category || typeof category !== 'string' || category.length < 2) {
          errors.push('El campo "category" debe tener al menos 2 caracteres, ser un string o debe estar presente en el query.');
        }

        if (errors.length > 0) {
          return res.status(400).json({ message: 'Error al encontrar la categoria.', errors });
        }

        else {
          
          const categoryFound = properties.filter(element => element.includes(category))

          if(categoryFound.length === 0){

            return res.status(400).send("Categoria no encontrada")

          }else{

            const modelName = productAssociations[categoryFound].target.name
            //modelName.push("ProductDiscount")
            const products = await conn.models[modelName].findAll({
              where: { ProductId: { [Op.ne]: null } },
            });
            const producstIds = products.map(obj => obj.ProductId)

            const productsFiltered = await Product.findAll({where: {id: producstIds}, include:[conn.models[modelName],  {
              model: ProductDiscount
            }] })

            return res.status(200).json(productsFiltered)

          }

        }

      } catch (error) {

        return res.status(400).json({message: error.message})

      }
    }

    const getProductsByInput = async (req, res) => {

      try {
        const {input} = req.query

        const lowCharacterInput = input.toLowerCase()
        const productAssociations = await Product.associations
        const productAssociationsKeys = Object.keys(productAssociations)

        const excludedModels = ['ShoppingCarts','CommentsRatings','Users']

        //Funcion excluir modelos
        excludedModels.map((model) => {
          const index = productAssociationsKeys.indexOf(model)
          productAssociationsKeys.splice(index, 1); 
        })
        productAssociationsKeys.push("ProductDiscount")

        if(!input || typeof input !== 'string' || input.length < 2){

          return res.status(400).send("Parametros incompletos o informacion invalida")

        }else{
          
          const products = await Product.findAll({

            where: {
              [Op.or]: [
                conn.where(conn.fn('LOWER', conn.col('model')), 'LIKE', `%${lowCharacterInput}%`),
                conn.where(conn.fn('LOWER', conn.col('brand')), 'LIKE', `%${lowCharacterInput}%`)
              ]
              
            },  include: productAssociationsKeys.map(modelName => ({
                model: conn.models[modelName],
                required: false
            }))
          })

          if(products.length === 0){
            return res.status(404).send("No existen productos con ese nombre")
          } else {
          
            const filteredProducts = products.map(product => {
              for (const property of productAssociationsKeys) {
                if(product.dataValues[property] === null){
                  delete product.dataValues[property]
                }
              }
              
              return product.dataValues
            });

            return res.status(200).send(filteredProducts)
          }
        }

      } catch (error) {

        return res.status(400).json({message: error.message})
      }
    }

    const getProductsFromUserShoppingCart = async (req, res) => {

      try {
        const {id} = req.query

        if(!id){
          return res.status(400).send('Debe ingresar la id del usuario por query')
        }
        else {
          const user = await User.findByPk(id)

          if(!user){

            return res.status(404).send(`El usuario con la id ${id} no existe`)

          }else{
            const userShoppingList = await user.getShoppingCarts({
              include: {
                model: Product,
                include: [
                  {
                    model: ProductDiscount
                  }
                ]
              }
            })
            
            return res.status(200).json(userShoppingList)
          }
        }
      } catch (error) {

        return res.status(400).json({message: error.message})

      }

    }

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

  const addProductToUser = async (req, res) => {

    try {
      const {userId, productId} = req.body
      const user = await User.findByPk(userId)
      const product = await Product.findByPk(productId, {include: {
        model: ProductDiscount
      }})

      if(!user){
        return res.status(400).send(`El usuario con el id ${userId} no existe`)
      }
      if(!product){
        return res.status(400).send(`El producto con el id ${productId} no existe`)
      }
      await user.addProduct(product)

      return res.status(200).send(`El producto ${product.brand} ${product.model} fue agregado correctamente a la lista de favoritos del usuario ${user.id}`)
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  }

  const removeProductToUser = async (req, res) => {

    try {
      const {userId, productId} = req.body
      const user = await User.findByPk(userId)
      const product = await Product.findByPk(productId, {include: {
        model: ProductDiscount
      }})

      if(!user){
        return res.status(400).send(`El usuario con el id ${userId} no existe`)
      }
      if(!product){
        return res.status(400).send(`El producto con el id ${productId} no existe`)
      }
      await user.removeProduct(product)

      return res.status(200).send(`El producto ${product.brand} ${product.model} fue removido correctamente de la lista de favoritos del usuario ${user.id}`)
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  }

  const getUserProducts = async(req, res) => {
    try {
      const {userId} = req.query
      const userWithProducts = await User.findByPk(userId, {
        include: {
          model: Product,
          include: { model: ProductDiscount },
        },
        attributes: { exclude: ['UserProduct'] } 
      })  
      return res.status(200).json(userWithProducts)
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  }

  const updateProductClicks = async (req, res) => {

    try {
      const {productId} = req.body
      const product = await Product.findByPk(productId)
      if(!product){
        return res.status(400).send(`El producto con el id ${productId} no existe`)
      }
      await product.update({
        analytical: { "sold": product.analytical.sold, "clicked": product.analytical.clicked + 1 }
      })
      await product.save()
      return res.status(200).json(product.analytical)
    } catch (error) {
      return res.status(500).json({message: error.message})
    }

  }

  const getProductAnalytics = async (req, res) => {

    try {
      const{productId} =req.query
      const product = await Product.findByPk(productId, { attributes: { exclude: ['description','images','price','stock'] }})
      if(!product){
        return res.status(400).send(`El producto con el id ${productId} no existe`)
      }else{
        return res.status(200).json(product)
      }
    } catch (error) {
      return res.status(500).json({message: error.message})
    }

  }

  const getAllProductAnalytics = async (req, res) => {

    try {
      const products = await Product.findAll({ attributes: { exclude: ['description','images','price','stock'] }})
      if(!products){
        return res.status(400).send(`No existen productos registrados`)
      }else{
        return res.status(200).json(products)
      }
    } catch (error) {
      return res.status(500).json({message: error.message})
    }

  }

  const getProductAnalyticsByCategory = async (req, res) => {

    try {
      const {category} = req.query

      const productAssociations = await Product.associations
      const properties = Object.keys(productAssociations)
      console.log(properties)
      const errors = []

      if (!category || typeof category !== 'string' || category.length < 2) {
        errors.push('El campo "category" debe tener al menos 2 caracteres, ser un string o debe estar presente en el query.');
      }
      if (errors.length > 0) {
        return res.status(400).json({ message: 'Error al encontrar la categoria.', errors });
      }
      else {
        const categoryFound = properties.filter(element => element.includes(category))

        if(categoryFound.length === 0){
          return res.status(400).send("Categoria no encontrada")
        }else{

          const compararSold = (a, b) => {
            return a.analytical.sold - b.analytical.sold
          }

          const modelName = productAssociations[categoryFound].target.name

          const products = await conn.models[modelName].findAll({
            where: { ProductId: { [Op.ne]: null } },
          })
          const producstIds = products.map(obj => obj.ProductId)
          const productsFiltered = await Product.findAll({where: {id: producstIds},  attributes: { exclude: ['description','images','price','stock'] } })
          const productsSort = productsFiltered.sort(compararSold)

          return res.status(200).json(productsSort)
        }
      }
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  }

  const getAnalyticsByCategory = async (req, res) => {

    try {
      const productAssociations = await Product.associations
      const productAssociationsKeys = Object.keys(productAssociations)
      const excludedModels = ['ShoppingCarts','CommentsRatings','Users','ProductDiscount']

      let array = []

      excludedModels.map((model) => {
        const index = productAssociationsKeys.indexOf(model)
        productAssociationsKeys.splice(index, 1); 
      })
      for (let i = 0; i < productAssociationsKeys.length; i++) {
        let analyticalObject = {sold: 0, clicked: 0}
        const modelName = productAssociationsKeys[i]
        const products = await conn.models[modelName].findAll({
          where: { ProductId: { [Op.ne]: null } },
        })
        const producstIds = products.map(obj => obj.ProductId)
        const productsByCurrentModel = await Product.findAll({where: {id: producstIds},  attributes: { exclude: ['description','images','price','stock'] } })
        productsByCurrentModel.map((product) => {
          analyticalObject = {sold: analyticalObject.sold + product.analytical.sold, clicked: analyticalObject.clicked + product.analytical.clicked}
        })
        array.push({[modelName]:analyticalObject})
      }
      return res.status(200).json(array) 
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  }

  const getProductsSoldPerDay = async (req, res) => {

    try {
      const {startDate, endDate} = req.query
      
      if(!startDate){
        return res.status(400).send(`Debes ingresar por query la fecha de inicio `)
      }
      if(startDate && !endDate){
       
        const orders = await Order.findAll({where: {
          datePurchase : {
            [Op.eq]: startDate 
          }
        }})
        if(!orders || orders.length === 0){
          return res.status(400).send(`No se encontro ningun registro de compra con la fecha ${startDate}`)
        }else{
          const products = orders.map((order) => {
            const orderProducts = order.orderData.ShoppingCarts.map( shopCart => {
              return {productId: shopCart.ProductId, quantity: shopCart.amount}
            })
            return orderProducts
          })
          const summedProducts = sumProductsById(products)

          const productsWithQuantity = summedProducts.map(async(product) => {
            const prod = await Product.findByPk(product.productId)
            const productData = {id: prod.id, name: `${prod.brand} ${prod.model}`, quantity: product.quantity}
            
            return productData
          })
          const productsData = await Promise.all(productsWithQuantity)
          
          return res.status(200).json(productsData)
        }
      }if(startDate && endDate){
      
        const orders = await Order.findAll({where: {
          datePurchase : {
            [Op.between]: [startDate, endDate]
          }
        }})
        if(!orders || orders.length === 0){
          return res.status(400).send(`No se encontro ningun registro de compra entre las fechas ${startDate} y ${endDate}`)
        }else{
          const products = orders.map((order) => {
            const orderProducts = order.orderData.ShoppingCarts.map( shopCart => {
              return {productId: shopCart.ProductId, quantity: shopCart.amount}
            })
            return orderProducts
          })
          const summedProducts = sumProductsById(products)

          const productsWithQuantity = summedProducts.map(async(product) => {
            const prod = await Product.findByPk(product.productId)
            const productData = {id: prod.id, name: `${prod.brand} ${prod.model}`, quantity: product.quantity}
            
            return productData
          })
          const productsData = await Promise.all(productsWithQuantity)
          
          return res.status(200).json(productsData)
        }
      }else{
        return res.status(400).send(`Debes ingresar por query la fecha de inicio y fin (opcional)`)
      }
    } catch (error) {
      return res.status(500).json({message: error.message})
    }

  }

  const getDetailsFromProductsSoldPerDay = async (req, res) => {

    try {
      const {startDate, endDate} = req.query
      
      if(!startDate){
        return res.status(400).send(`Debes ingresar por query la fecha de inicio `)
      }
      if(startDate && !endDate){
       
        const orders = await Order.findAll({where: {
          datePurchase : {
            [Op.eq]: startDate 
          }
        }})
        if(!orders || orders.length === 0){
          return res.status(400).send(`No se encontro ningun registro de compra con la fecha ${startDate}`)
        }else{
          const products = orders.map((order) => {
            const orderProducts = order.orderData.ShoppingCarts.map( shopCart => {
              return {
                id: shopCart.ProductId, 
                name: `${shopCart.Product.brand} ${shopCart.Product.model}`,
                quantity: shopCart.amount,
                buyer: order.orderData.id,
                date: order.datePurchase
              }
            })
            return orderProducts
          })
          
          return res.status(200).json(products)
        }
      }if(startDate && endDate){
      
        const orders = await Order.findAll({where: {
          datePurchase : {
            [Op.between]: [startDate, endDate]
          }
        }})
        if(!orders || orders.length === 0){
          return res.status(400).send(`No se encontro ningun registro de compra con la fecha ${startDate}`)
        }else{
          const products = orders.map((order) => {
            const orderProducts = order.orderData.ShoppingCarts.map( shopCart => {
              return {
                id: shopCart.ProductId, 
                name: `${shopCart.Product.brand} ${shopCart.Product.model}`,
                quantity: shopCart.amount,
                buyer: order.orderData.id,
                date: order.datePurchase
              }
            })
            return orderProducts
          })
          
          return res.status(200).json(products)
        }
      }else{
        return res.status(400).send(`Debes ingresar por query la fecha de inicio y fin (opcional)`)
      }
    } catch (error) {
      return res.status(500).json({message: error.message})
    }

  }
    module.exports = {
        createProduct,
        getProducts,
        getProduct,
        updateProduct,
        deleteProduct,
        getProductsByCategory,
        getProductsByInput,
        getProductsFromUserShoppingCart,
        getAllProductPromo,
        addProductToUser,
        removeProductToUser,
        getUserProducts,
        updateProductClicks,
        getProductAnalytics,
        getAllProductAnalytics,
        getProductAnalyticsByCategory,
        getAnalyticsByCategory,
        getProductsSoldPerDay,
        getDetailsFromProductsSoldPerDay
    }