const { Router } = require('express');

const {example1, example2} = require('../controllers/controllers.controllers.js');

const router = Router();

router.get("/", example1);
router.get("/example2", example2);

module.exports = router;