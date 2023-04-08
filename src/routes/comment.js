const { Router } = require ('express');
const {  createCommentByUser, getComments, getCommentsByUserId, changeCommentToRead } = require ('../controllers/comment.controllers');
const router = Router();

//GET
router.get("/getComments", getComments)
router.get("/getCommentsByUserId", getCommentsByUserId)

//POST
router.post("/createCommentByUser", createCommentByUser)

//PUT
router.put("/changeCommentToRead", changeCommentToRead)

//DELETE

module.exports = router;
