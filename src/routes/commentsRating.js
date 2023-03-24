const { Router } = require('express');

const{getCommentsRatings,getCommentsRating,createCommentsRating,updateCommentsRating,deleteCommentsRating} = require ('../controllers/commentsRatings.controllers.js');

const router = Router();

//GET
router.get("/getCommentsRatings", getCommentsRatings);
router.get("/getCommentsRating", getCommentsRating);

//POST
router.post("/createCommentsRating", createCommentsRating);

//PUT
router.put("/updateCommentsRating/:id", updateCommentsRating);


//DELETE
router.delete("/deleteCommentsRating", deleteCommentsRating);



module.exports = router;