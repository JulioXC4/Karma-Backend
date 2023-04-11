const { Router } = require ('express');
const { getUserRoleById} = require ('../controllers/admin.controllers.js');
const router = Router();

//GET
router.get("/getUserRoleById", getUserRoleById);

//POST

//PUT


//DELETE

module.exports = router;