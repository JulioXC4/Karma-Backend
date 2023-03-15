const { Router } = require('express');

const{ getShoppingCarts,getShoppingCart,createShoppingCart,updateShoppingCart,deleteShoppingCart, } = require ('../controllers/shoppingCarts.controllers.js');

const router = Router();

//GET
router.get("/getShoppingCarts", getShoppingCarts);
router.get("/getShoppingCart", getShoppingCart);

//POST
router.post("/createShoppingCart", createShoppingCart);

//PUT
router.put("/updateShoppingCart", updateShoppingCart);

//DELETE
router.delete("/deleteShoppingCart", deleteShoppingCart);

module.exports = router;