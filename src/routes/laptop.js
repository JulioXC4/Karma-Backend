const { Router } = require('express');

const { createLaptop, updateLaptop } = require('../controllers/products/laptop.controller.js');

const router = Router();

//GET

//POST
router.post("/createLaptop", createLaptop);

//PUT
router.put("/updateLaptop", updateLaptop);

//DELETE


module.exports = router;