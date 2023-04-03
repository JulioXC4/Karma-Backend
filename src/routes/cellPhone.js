const { Router } = require ('express');
const {  createCellPhone, updateCellPhone } = require ('../controllers/cellPhone.controllers.js');
const router = Router();

//GET

//POST
router.post("/createCellPhone", createCellPhone);

//PUT
router.put("/updateCellPhone", updateCellPhone);

//DELETE

module.exports = router;
