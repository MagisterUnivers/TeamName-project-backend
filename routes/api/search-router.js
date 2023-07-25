const express = require('express');
const drinksController = require('../../controllers/drinksController');

const router = express.Router();

router.get('/', drinksController.searchAllDrinks);

module.exports = router;
