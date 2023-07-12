const express = require('express');
const drinksController = require('../../controllers/drinksController');
const { validateBody } = require('../../decorators');
const schemas = require('../../schemas/drinksSchema');
const isBodyEmpty = require('../../middleware/isBodyEmpty');
const idValidation = require('../../middleware/idValidation');
// const authenticate = require('../../middleware/authenticate');

const router = express.Router();

// router.use(authenticate);

router.get('/', drinksController.getAllDrinks);
router.get('/category-list', drinksController.getCategoryList);
router.get('/main-page', drinksController.getDrinksByFourCategories);
router.get('/id/:id', idValidation, drinksController.getOneDrink);
router.get('/:category', drinksController.getDrinksByCategory);


router.post(
	'/own',
	isBodyEmpty,
	validateBody(schemas.drinkSchema),
	drinksController.addDrink
);

router.delete('own/:drinkId', idValidation, drinksController.deleteDrink);

module.exports = router;
