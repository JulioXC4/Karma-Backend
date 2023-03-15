const { Router } = require('express');

const{getCommentsRaitings,getCommentsRaiting,createCommentsRaiting,updateCommentsRaiting,deleteCommentsRaiting} = require ('../controllers/commentsRaitings.controllers.js');

const router = Router();

//GET
router.get("/getCommentsRaitings", getCommentsRaitings);
router.get("/getCommentsRaiting", getCommentsRaiting);

//POST
router.post("/createCommentsRaiting", createCommentsRaiting);

//PUT
router.put("/updateCommentsRaiting", updateCommentsRaiting);


//DELETE
router.delete("/deleteCommentsRaiting", deleteCommentsRaiting);



module.exports = router;