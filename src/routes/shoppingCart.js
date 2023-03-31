const { Router } = require('express');

const{ getShoppingCarts,getShoppingCart,createShoppingCart,updateShoppingCart,deleteShoppingCart, restoreProductsFromShoppingCart } = require ('../controllers/shoppingCarts.controllers.js');

const router = Router();

//GET
router.get("/getShoppingCarts", getShoppingCarts);
router.get("/getShoppingCart", getShoppingCart);
router.get("/restoreProductsFromShoppingCart", restoreProductsFromShoppingCart)
//POST
router.post("/createShoppingCart", createShoppingCart);

//PUT
router.put("/updateShoppingCart/:id", updateShoppingCart);

//DELETE
router.delete("/deleteShoppingCart", deleteShoppingCart);

module.exports = router;