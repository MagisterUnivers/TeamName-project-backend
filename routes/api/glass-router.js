const express = require('express');
const glassController = require('../../controllers/glassController');
// const authenticate = require('../../middleware/authenticate');

const router = express.Router();

// router.use(authenticate);

router.get('/', glassController.getAllGlasses);

module.exports = router;
