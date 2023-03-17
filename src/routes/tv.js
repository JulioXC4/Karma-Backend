const {Router} = require('express')
const {createTelevisor,updateTelevisor} = require('../controllers/televisores.controllers.js')
const router = Router()


// POST
router.post('/createTelevisor', createTelevisor)
// PUT
router.put('/updateTelevisor', updateTelevisor)


module.exports = router;