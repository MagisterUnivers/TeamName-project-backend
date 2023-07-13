const express = require('express');
const drinksController = require('../../controllers/drinksController');
// const authenticate = require('../../middleware/authenticate');
const { validateBody } = require('../../decorators');
const schemas = require('../../schemas/drinksSchema');
const isBodyEmpty = require('../../middleware/isBodyEmpty');
const idValidation = require('../../middleware/idValidation');
const router = express.Router();

// router.use(authenticate);

router.get('/', drinksController.getAllOwnDrinks);
router.post(
	'/',
	isBodyEmpty,
	validateBody(schemas.drinkSchema),
	drinksController.addOwnDrink
);

router.delete('/:drinkId', idValidation, drinksController.deleteOwnDrink);

module.exports = router;