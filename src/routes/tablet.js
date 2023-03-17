const { Router } = require('express');

const { createTablet, updateTablet } = require('../controllers/products/tablet.controllers.js');

const router = Router();

//GET

//POST
router.post("/createTablet", createTablet);

//PUT
router.put("/updateTablet", updateTablet);

//DELETE


module.exports = router;