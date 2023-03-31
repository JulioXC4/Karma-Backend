
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
};

// Agregar un nuevo carrito de compras

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

          const userProductsInShoppingCart = await user.getShoppingCarts()

          if(userProductsInShoppingCart.length === 0){

             const newCart = await ShoppingCart.create({
              amount: amount,
              UserId: UserId,
              ProductId: ProductId,
            }); 

            await product.update({
              stock: product.stock - amount
            })
            await product.save()

            return res.status(200).json(newCart);

          }else{

            const shoppingCart = await ShoppingCart.findOne({where: {
              ProductId: ProductId
            }})

            if(!shoppingCart){

              const newCart = await ShoppingCart.create({
                amount: amount,
                UserId: UserId,
                ProductId: ProductId,
              })

              await product.update({
                stock: product.stock - amount
              })

              await product.save()

              return res.status(200).json(newCart);
            } else {

              await shoppingCart.update({
                amount: shoppingCart.amount + amount
              })

              await shoppingCart.save()

              await product.update({
                stock: product.stock - amount
              })
              await product.save()

              return res.status(200).json(shoppingCart);
            }
           
          }
        }
    
      } catch (error) {

        res.status(400).send({message: 'Ocurrió un error al agregar el carrito de compras'});

      }
  };
  

 
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
};


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

module.exports = {
  
    getShoppingCarts,
    getShoppingCart,
    createShoppingCart,
    updateShoppingCart,
    deleteShoppingCart,
    restoreProductsFromShoppingCart
  };
 
  
  /* try {
      const { user_id, product_id, amount } = req.body;
      console.log(`user_id: ${user_id}, product_id: ${product_id}`);
  
      const user = await User.findByPk(user_id);
      const product = await Product.findByPk(product_id);
      console.log(`user: ${user}, product: ${product}`);
  
      if (!user || !product) {
        return res.status(404).send('El usuario o el producto no existe');
      }
  
      const newCart = await ShoppingCart.create({
        amount,
        user_id,
        product_id,
      });
      res.json(newCart);
    } catch (error) {
      console.error(error);
      res.status(400).send({
        message: 'Ocurrió un error al agregar el carrito de compras',
      });
    }*/