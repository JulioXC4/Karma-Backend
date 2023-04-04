const { CommentsRating,User,Product } = require('../db.js');

const getCommentsRatings=  async (req, res) => {
    try {
      const comments = await CommentsRating.findAll();
      res.status(200).json({comments  });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
  };
  
 
 
  const getCommentsRating = async (req, res) => {
    try {
      const {id} = req.query
      const commentsRating = await CommentsRating.findByPk(id)
      if (!commentsRating) {
          return res.status(400).send(`No existe el id ${id}`)
      } else {
          return res.status(200).json(commentsRating)
      }
  } catch (error) {
      return res.status(400).json({message: error.message})
  }
  };
  
  const createCommentsRating = async (req, res) => {

    const badWords = ['palabra1', 'palabra2', 'palabra3']; // lista de palabras prohibidas
      try {
          const { comments, rating, UserId, ProductId,state = 'activo' } = req.body;
  
          const user = await User.findByPk(UserId);
          const product = await Product.findByPk(ProductId);
  
          if (!user || !product) {
              return res.status(404).send('El usuario o el producto no existe');
          }
  
          if (!comments) {
              return res.status(400).send('El campo de "comments" es obligatorio');
          }
  
          // Verificar si el comentario contiene palabras prohibidas
          const containsBadWords = badWords.some(word => comments.includes(word));
  
          if (containsBadWords) {
              return res.status(400).send('El comentario contiene palabras prohibidas');
          }
  
          // Crear un nuevo objeto de comentarios y calificación (rating)
          const newCommentRating = await CommentsRating.create({
              comments,
              rating,
              state,
              UserId,
              ProductId,
              reviewed: false // indicar que el comentario no ha sido revisado
          });
  
          // Calcular el rating promedio del producto
        const existingCommentRatings = await CommentsRating.findAll({ where: { ProductId } });
        const totalRating = existingCommentRatings.reduce((sum, { rating }) => sum + rating, 0);
        const averageRating = totalRating / existingCommentRatings.length;
        
        product.averageRating = averageRating;
        await product.save();
        
  
          return res.status(200).json({
              message: 'Comentarios y calificación agregados con éxito y esperando revisión del administrador',
              newCommentRating,
              productRating: product.averageRating
          });
      } catch (error) {
          console.error(error);
          return res.status(500).send('Error interno del servidor');
      }
  };
  
  const updateCommentsRating = async (req, res) => {
    const { id } = req.params;
    const { comments, rating, state } = req.body; // agregar estado a la solicitud
    const user = req.user;
    const badWords = ['palabra1', 'palabra2', 'palabra3']; 
  
    try {
      const commentRating = await CommentsRating.findByPk(id);
  
      if (!commentRating) {
        return res.status(404).send("No se encontró el registro de comentarios y calificación");
      }
  
      // Verificar el rol del usuario autenticado
      if (user && user.role !== 'admin') {
        return res.status(401).send("No tiene permiso para actualizar comentarios y calificaciones");
      }
  
      if (comments) {
        // Verificar si el comentario contiene palabras prohibidas
        const containsBadWords = badWords.some(word => comments.includes(word));
  
        if (containsBadWords) {
          return res.status(400).send('El comentario contiene palabras prohibidas');
        }
  
        commentRating.comments = comments;
      }
  
      if (rating) {
        commentRating.rating = rating;
      }
  
      if (state !== undefined) { // actualizar el estado del comentario si se proporciona en la solicitud
        commentRating.state = state;
      }
  
      await commentRating.save();
  
      // Calcular el rating promedio del producto
      const existingCommentRatings = await CommentsRating.findAll({ where: { ProductId: commentRating.ProductId } });
      const totalRating = existingCommentRatings.reduce((sum, { rating }) => sum + rating, 0);
      const averageRating = totalRating / existingCommentRatings.length;
      
      const product = await Product.findByPk(commentRating.ProductId);
      product.averageRating = averageRating;
      await product.save();
  
      return res.status(200).json({
        message: "Registro de comentarios y calificación actualizado con éxito",
        commentRating,
        productRating: product.averageRating,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error interno del servidor");
    }
  };
  
    
    const deleteCommentsRating =  async (req, res) => {
      const { id } = req.query;
      
      try {
        const  commentsRating = await CommentsRating.findByPk(id);
        if (!commentsRating) {
          res.status(404).send({ message: 'No encontrado' });
        } else {
          await commentsRating.destroy()
          res.status(200).send('Eliminado con exito');
        }
      } catch (error) {
        res.status(400).json({message: error.message  });
      }
    };

    const findCommentsByProductId = async (req, res) => {
      try {
        const { ProductId } = req.query;
        
        const comments = await CommentsRating.findAll({ where: { ProductId } });
    
        if (!comments || comments.length === 0) {
          return res.status(404).send(`No existen comentarios para el producto con ProductId ${ProductId}`);
        }
        return res.status(200).json(comments);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
      
      };
    


  module.exports = {
    getCommentsRatings,
    getCommentsRating,
    createCommentsRating,
    updateCommentsRating ,
    deleteCommentsRating,
    findCommentsByProductId,
    
  }