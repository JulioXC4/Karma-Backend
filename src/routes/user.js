const { Router } = require('express');

const { createUser, getUsers, getUser, updateUser, deleteUser } = require('../controllers/users.controllers.js');

const router = Router();

//GET
router.get("/getUsers", getUsers);
router.get("/getUser", getUser);

//POST
router.post("/createUser", createUser);

//PUT
router.put("/updateUser", updateUser);

//DELETE
router.delete("/deleteUser", deleteUser);

module.exports = router;