const express = require('express');
const drinksController = require('../../controllers/drinksController');
// const authenticate = require('../../middleware/authenticate');
const { validateBody } = require('../../decorators');
const schemas = require('../../schemas/drinksSchema');
const isBodyEmpty = require('../../middleware/isBodyEmpty');
const idValidation = require('../../middleware/idValidation');
const router = express.Router();

// router.use(authenticate);

router.get('/', drinksController.getAllFavoriteDrinks);
router.post(
	'/',
	isBodyEmpty,
	validateBody(schemas.drinkSchema),
	drinksController.addFavoriteDrink
);

router.delete('/:drinkId', idValidation, drinksController.deleteFavoriteDrink);

module.exports = router;