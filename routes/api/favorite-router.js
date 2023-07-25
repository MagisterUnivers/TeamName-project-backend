const express = require('express');
const drinksController = require('../../controllers/drinksController');
const authenticate = require('../../middleware/authenticate');
const idValidation = require('../../middleware/idValidation');
const router = express.Router();

router.use(authenticate);

router.get('/', drinksController.getAllFavoriteDrinks);
router.post('/:id', drinksController.addFavoriteDrink);

router.delete('/:id', idValidation, drinksController.deleteFavoriteDrink);

module.exports = router;
