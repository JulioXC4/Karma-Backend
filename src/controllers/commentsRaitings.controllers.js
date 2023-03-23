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

    const badWords = ['palabra1', 'palabra2', 'palabra3']; // lista de palabras prohibidas
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
  
          // Verificar si el comentario contiene palabras prohibidas
          const containsBadWords = badWords.some(word => comments.includes(word));
  
          if (containsBadWords) {
              return res.status(400).send('El comentario contiene palabras prohibidas');
          }
  
          // Crear un nuevo objeto de comentarios y calificación (rating)
          const newCommentRaiting = await CommentsRaiting.create({
              comments,
              raiting,
              user_id,
              product_id,
              reviewed: false // indicar que el comentario no ha sido revisado
          });
  
          // Calcular el rating promedio del producto
        const existingCommentRaitings = await CommentsRaiting.findAll({ where: { product_id } });
        const totalRaiting = existingCommentRaitings.reduce((sum, { raiting }) => sum + raiting, 0);
        const averageRaiting = totalRaiting / existingCommentRaitings.length;
        
        product.raiting = averageRaiting;
        await product.save();
        
  
          return res.status(200).json({
              message: 'Comentarios y calificación agregados con éxito y esperando revisión del administrador',
              newCommentRaiting,
              productRating: product.product_rating
          });
      } catch (error) {
          console.error(error);
          return res.status(500).send('Error interno del servidor');
      }
  };
  
  const updateCommentsRaiting = async (req, res) => {
    const { id } = req.params;
    const { comments, raiting, estado } = req.body; // agregar estado a la solicitud
    const user = req.user;
    const badWords = ['palabra1', 'palabra2', 'palabra3']; 
  
    try {
      const commentRaiting = await CommentsRaiting.findByPk(id);
  
      if (!commentRaiting) {
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
  
        commentRaiting.comments = comments;
      }
  
      if (raiting) {
        commentRaiting.raiting = raiting;
      }
  
      if (estado) { // actualizar el estado del comentario si se proporciona en la solicitud
        commentRaiting.estado = estado;
      }
  
      await commentRaiting.save();
  
      // Calcular el rating promedio del producto
      const existingCommentRaitings = await CommentsRaiting.findAll({ where: { product_id: commentRaiting.product_id } });
      const totalRaiting = existingCommentRaitings.reduce((sum, { raiting }) => sum + raiting, 0);
      const averageRaiting = totalRaiting / existingCommentRaitings.length;
      
      const product = await Product.findByPk(commentRaiting.product_id);
      product.raiting = averageRaiting;
      await product.save();
  
      return res.status(200).json({
        message: "Registro de comentarios y calificación actualizado con éxito",
        commentRaiting,
        productRating: product.raiting,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error interno del servidor");
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