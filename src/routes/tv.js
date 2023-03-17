const {Router} = require('express')
const {getAllTelevisor,getTelevisor,createTelevisor} = require('../controllers/televisores.controllers.js')
const router = Router()

// GET
router.get('/getTelevisor',getTelevisor)
router.get('/getAllTelevisor',getAllTelevisor)
// POST
router.post('/createTelevisor', createTelevisor)
// // PUT
// router.put('/updateCategory', updateCategory)
// // DELETE
// router.delete('/deleteCategory', deleteCategory)

module.exports = router;