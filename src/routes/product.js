const { Router } = require('express');

const { 
    createProduct, 
    getProducts, 
    getProduct, 
    getProductsByCategory, 
    getProductsByInput, 
    getProductsFromUserShoppingCart, 
    updateProduct, 
    deleteProduct,
    getAllProductPromo,
    addProductToUser, 
    removeProductToUser, 
    getUserProducts,
    updateProductClicks,
    getProductAnalytics,
    getAllProductAnalytics,
    getProductAnalyticsByCategory,
    getAnalyticsByCategory,
    getProductsSoldPerDay 
} = require('../controllers/products.controllers.js');

const router = Router();

//GET
router.get("/getProducts", getProducts)
router.get("/getProduct", getProduct)
router.get("/getProductsByCategory", getProductsByCategory)
router.get("/getProductsByInput", getProductsByInput)
router.get("/getProductsFromUserShoppingCart", getProductsFromUserShoppingCart)
router.get('/getproductPromo/:quantity', getAllProductPromo)
router.get('/getUserProducts', getUserProducts)
router.get('/getProductAnalytics', getProductAnalytics)
router.get('/getAllProductAnalytics', getAllProductAnalytics)
router.get('/getProductAnalyticsByCategory', getProductAnalyticsByCategory)
router.get('/getAnalyticsByCategory', getAnalyticsByCategory)
router.get('/getProductsSoldPerDay', getProductsSoldPerDay)

//POST
router.post("/createProduct", createProduct)
router.post("/addProductToUser", addProductToUser)
router.post("/removeProductToUser", removeProductToUser)

//PUT
router.put("/updateProduct", updateProduct)
router.put("/updateProductClicks", updateProductClicks)

//DELETE
router.delete("/deleteProduct", deleteProduct)

module.exports = router;