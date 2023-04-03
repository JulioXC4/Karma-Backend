
  const { ShoppingCart,User,Product } = require('../db.js');

  const getShoppingCarts = async (req, res) => {
    try {
      const cartShoppings = await ShoppingCart.findAll();
      if (!cartShoppings) {
        return res.status(400).send({ error: "No existen Carrito de compras" });
      } else {
        return res.status(200).json({ cartShoppings });
      }
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }

    };
     // Obtener un carrito de compras por su ID

  const getShoppingCart = async (req, res) => {

    try {
      const { id } = req.query;
      const cartShoppingId = await ShoppingCart.findOne({
        where: {id}
      });
      if (!cartShoppingId)return res.status(404).json({massage:'No se encontró el carrito de compras'});
      return res.json(cartShoppingId) ;

    } catch (error) {
    return res.status(400).json({message: error.message});
    }
  }

  const createShoppingCart = async (req, res) => {

      try {
        const { UserId, ProductId, amount } = req.body;
        
        if (!amount|| typeof amount !== 'number' || amount <= 0) {
          return res.status(400).json({ message: 'La cantidad debe existir y no puede ser negativa o 0.' });
        }
        
        if (!UserId || !ProductId) {
          return res.status(404).send('Debe ingresar el id del usuario y producto');
        } 
        
        else {

          const user = await User.findByPk(UserId)
          const product = await Product.findByPk(ProductId)

          if(!user){
            return res.status(400).send(`No existe el usuario con la id ${UserId}`)
          }
          if(!product){
            return res.status(400).send(`No existe el producto con la id ${ProductId}`)
          }
          if(amount > product.stock){
            return res.status(400).send(`El producto no cuenta con esa cantidad de stock, existentes: ${product.stock}`)
          }

          const newShoppingCart = await ShoppingCart.create({
            amount: amount,
            UserId: UserId,
            ProductId: ProductId,
          })

          return res.status(200).json(newShoppingCart);

        }
    
      } catch (error) {

        return res.status(400).send({message: 'Ocurrió un error al agregar el carrito de compras'});

      }
  }
 
  const  updateShoppingCart = async( req, res)=>{

      try {
        const { id } = req.params;
    const { UserId,ProductId, amount } = req.body;
      
        const cartShopping = await ShoppingCart.findByPk(id);
        if (!cartShopping) {
          return res.status(404).json({ message: 'Carrito de compras no encontrado' });
        }
        cartShopping.amount = amount,
        cartShopping.UserId = UserId,
        cartShopping.ProductId = ProductId,
      
        await cartShopping.save();
        return res.status(200).send('Modificado con exito');
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
  }

  const deleteShoppingCart =  async (req, res) => {
    try {
      const { id } = req.query;
      await ShoppingCart.destroy({
        where:{
          id,
      }
      });
      return res.status(200).send('Carrito de compras eliminado con éxito');
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  const restoreProductsFromShoppingCart = async (req, res) => {

    try {

      const { id } = req.query

      const shoppingCart = await ShoppingCart.findByPk(id)
      const productId = shoppingCart.ProductId
      const amountToReturn = shoppingCart.amount

      const product = await Product.findByPk(productId)
      await product.update({
        stock: product.stock + shoppingCart.amount
      })

      await product.save()

      await ShoppingCart.destroy({
        where: {
          id: shoppingCart.id
        }
      })

      return res.status(200).send(`${amountToReturn} producto/s agregado/s a el stock del producto ${product.brand} ${product.model}`)

    } catch (error) {

      return res.status(400).json({ message: error.message })

    }
  }

  const addItemsToShoppingCartByProduct = async (req, res) => {

    try {

      const { UserId, ProductId, amount } = req.body

      if (!amount|| typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'La cantidad debe existir y no puede ser negativa o 0.' });
      }

      if (!UserId || !ProductId) {
        return res.status(404).send('Debe ingresar el id del usuario y producto');
      } 

      else {

        const user = await User.findByPk(UserId)
        const product = await Product.findByPk(ProductId)
        const userProductsInShoppingCart = await user.getShoppingCarts()

        if(!user){
          return res.status(400).send(`No existe el usuario con la id ${UserId}`)
        }
        if(!product){
          return res.status(400).send(`No existe el producto con la id ${ProductId}`)
        }
        if(amount > product.stock){
          return res.status(400).send(`El producto no cuenta con esa cantidad de stock, existentes: ${product.stock}`)
        }

        if(userProductsInShoppingCart.length === 0){

          return res.status(400).send("El usuario no tiene carritos de compra asignados")

        }else{

          const productShoppingCart = await ShoppingCart.findOne({where: {
            ProductId: ProductId
          }})

          if(!productShoppingCart){
            return res.status(404).send(`No existe el producto con id ${ProductId} en el carrito de compras del usuario`)
          }

          if(productShoppingCart.amount + amount > product.stock){
            return res.status(400).send(`La cantidad de item/s a agregar excede la cantidad de stock disponible del producto, actualmente en stock: ${product.stock}`)
          }

          else{

            await productShoppingCart.update({
              amount: productShoppingCart.amount + amount
            })
            await productShoppingCart.save()
          
            return res.status(200).send(`Item/s agregado/s correctamente, cantidad actual del producto ${product.brand} ${product.model}: ${productShoppingCart.amount}`)
          }

        }
      }

    } catch (error) {

      return res.status(400).send({message: 'Ocurrió un error al agregar el carrito de compras'});

    }
  }

  const removeItemsToShoppingCartByProduct = async (req, res) => {

    try {

      const { UserId, ProductId, amount } = req.body

      if (!amount|| typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'La cantidad debe existir y no puede ser negativa o 0.' });
      }

      if (!UserId || !ProductId) {
        return res.status(404).send('Debe ingresar el id del usuario y producto');
      } 

      else {

        const user = await User.findByPk(UserId)
        const product = await Product.findByPk(ProductId)
        const userProductsInShoppingCart = await user.getShoppingCarts()

        if(!user){
          return res.status(400).send(`No existe el usuario con la id ${UserId}`)
        }
        if(!product){
          return res.status(400).send(`No existe el producto con la id ${ProductId}`)
        }

        if(userProductsInShoppingCart.length === 0){

          return res.status(400).send("El usuario no tiene carritos de compra asignados")

        }else{

          const productShoppingCart = await ShoppingCart.findOne({where: {
            ProductId: ProductId
          }})

          if(!productShoppingCart){
            return res.status(404).send(`No existe el producto con id ${ProductId} en el carrito de compras del usuario`)
          }

          if(productShoppingCart.amount - amount < 1){
            return res.status(400).send(`La cantidad de item/s a remover es menor que uno, cantidad actual en el carrito: ${productShoppingCart.amount}`)
          }

          else{

            await productShoppingCart.update({
              amount: productShoppingCart.amount - amount
            })
            await productShoppingCart.save()
          
            return res.status(200).send(`Item/s removido/s correctamente, cantidad actual del producto ${product.brand} ${product.model}: ${productShoppingCart.amount}`)
          }

        }
      }

    } catch (error) {

      return res.status(400).send({message: 'Ocurrió un error al agregar el carrito de compras'});

    }
  }

module.exports = {
  
    getShoppingCarts,
    getShoppingCart,
    createShoppingCart,
    updateShoppingCart,
    deleteShoppingCart,
    restoreProductsFromShoppingCart,
    addItemsToShoppingCartByProduct,
    removeItemsToShoppingCartByProduct,

  }
 