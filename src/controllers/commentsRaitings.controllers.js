const { CommentsRaiting,User,Product } = require('../db.js');

const getCommentsRaitings=  async (req, res) => {
    try {
      const comments = await CommentsRaiting.findAll();
      res.status(200).json({comments  });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
  };
  
 
 
  const getCommentsRaiting = async (req, res) => {
    try {
      const {id} = req.query
      const commentsRaiting = await CommentsRaiting.findByPk(id)
      if (!commentsRaiting) {
          return res.status(400).send(`No existe el id ${id}`)
      } else {
          return res.status(200).json(commentsRaiting)
      }
  } catch (error) {
      return res.status(400).json({message: error.message})
  }
  };
  
 
  const createCommentsRaiting = async (req, res) => {
    try {
      const { comments, raiting, user_id, product_id } = req.body;
      const user = await User.findByPk(user_id);
      const product = await Product.findByPk(product_id);
  
      if (!user || !product) {
        return res.status(404).send('El usuario o el producto no existe');
      }
  
      if (!comments) {
        return res.status(400).send('El campo de "comments" es obligatorio');
      }
  
      const newCommentsRatings = await CommentsRaiting.create({
        comments: comments,
        raiting: raiting,
        user_id: user_id,
        product_id: product_id,
      });
  
      res.json(newCommentsRatings);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
    const updateCommentsRaiting = async (req, res) => {
      try {
        const { id } = req.params;
        const { comments, raiting, user_id, product_id } = req.body;
        
        const commentsRaiting = await CommentsRaiting.findByPk(id);
        if (!commentsRaiting) {
          return res.status(404).send("No existe");
        }
        
        await commentsRaiting.update({
          comments: comments,
          raiting: raiting,
          user_id: user_id,
          product_id: product_id,
        });
        await commentsRaiting.save()
        res.status(200).send('Actualizado correctamente');
      } catch (error) {
       
        res.status(400).json({ message: error.message });
      }
    };
    
    const deleteCommentsRaiting =  async (req, res) => {
      const { id } = req.query;
      
      try {
        const  commentsRaiting = await CommentsRaiting.findByPk(id);
        if (!commentsRaiting) {
          res.status(404).send({ message: 'No encontrado' });
        } else {
          await commentsRaiting.destroy()
          res.status(200).send('Eliminado con exito');
        }
      } catch (error) {
        res.status(400).json({message: error.message  });
      }
    };
    


  module.exports = {
    getCommentsRaitings,
    getCommentsRaiting,
    createCommentsRaiting,
    updateCommentsRaiting ,
    deleteCommentsRaiting,
    


  
  
  
  }