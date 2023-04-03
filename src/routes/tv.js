const {Router} = require('express')
const {createTelevision,updateTelevision} = require('../controllers/television.controllers.js')
const router = Router()


// POST
router.post('/createTelevision', createTelevision)
// PUT
router.put('/updateTelevision', updateTelevision)


module.exports = router;