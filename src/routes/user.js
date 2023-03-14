const { Router } = require('express');

const {createUser, getUsers} = require('../controllers/users.controllers.js');

const router = Router();

//GET
router.get("/getUsers", getUsers);

//POST
router.post("/createUser", createUser);

module.exports = router;