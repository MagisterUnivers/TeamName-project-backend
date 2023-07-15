const express = require('express');
const drinksController = require('../../controllers/drinksController');
const authenticate = require('../../middleware/authenticate');
const { validateBody } = require('../../decorators');
const schemas = require('../../schemas/drinksSchema');
const isBodyEmpty = require('../../middleware/isBodyEmpty');
const idValidation = require('../../middleware/idValidation');
const upload = require('../../middleware/upload')
const router = express.Router();

router.use(authenticate);

router.get('/', drinksController.getAllOwnDrinks);
router.post(
	'/',
	upload.single('drinkThumb'),
	isBodyEmpty,
	validateBody(schemas.drinkSchema),	
	drinksController.addOwnDrink
);

router.delete('/:id', idValidation, drinksController.deleteOwnDrink);

module.exports = router;