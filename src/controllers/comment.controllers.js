    const { Comment, User } = require('../db.js');

    const createCommentByUser = async( req, res ) => {

        try {
            const {userId, comment} = req.body
            const user = await User.findByPk(userId)
            if(!user){
                return res.status(400).send(`El usuario con la id ${userId} no existe`)
            }else{

                const newComment = await Comment.create({
                    comment: comment,
                    UserId: userId
                })
                return res.status(200).json(newComment)
            }
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    const getComments = async( req, res ) => {

        try {
            const allComments = await Comment.findAll()

            if(!allComments || allComments.length === 0){
                return res.status(400).send(`Todavia no hay comentarios disponibles`)
            }else{
                return res.status(200).json(allComments)
            }
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    const getCommentsByUserId = async( req, res ) => {

        try {
            const {userId} = req.query

            const user = await User.findByPk(userId)

            if(!user){
                return res.status(400).send(`El usuario con la id ${userId} no existe`)
            }else{
                const userComments = await Comment.findAll({where: {UserId: userId}})

                if(!userComments){
                    return res.status(400).send(`El usuario con la id ${userId} no tiene comentarios registrados`)
                }else{
                    return res.status(200).json(userComments)
                }
            }
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
  
    const changeCommentToRead = async (req, res) => {
        try {
            const {commentId} = req.body
            currentComment = await Comment.findByPk(commentId)

            if(!currentComment){
                return res.status(400).send(`El comentario con la id ${commentId} no existe`)
            }else{
                await currentComment.update({
                    read: true
                })
                await currentComment.save()
                return res.status(200).send(`Estado de comentario ${commentId} read: ${currentComment.read}`)
            }

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

  module.exports = {
    createCommentByUser,
    getComments,
    getCommentsByUserId,
    changeCommentToRead
  }