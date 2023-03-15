const {Router} = require('express')
const {getAllCategory,getCategory,createCategory,updateCategory,deleteCategory} = require('../controllers/category.controllers.js')
const router = Router()

// GET
router.get('/getCategory',getCategory)
router.get('/getAllCategory',getAllCategory)
// POST
router.post('/createCategory', createCategory)
// PUT
router.put('/updateCategory', updateCategory)
// DELETE
router.delete('/deleteCategory', deleteCategory)

module.exports = router;