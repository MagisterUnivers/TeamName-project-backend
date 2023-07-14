const express = require('express');
const drinksController = require('../../controllers/drinksController');
// const { validateBody } = require('../../decorators');
// const schemas = require('../../schemas/drinksSchema');
// const isBodyEmpty = require('../../middleware/isBodyEmpty');
const idValidation = require('../../middleware/idValidation');
// const authenticate = require('../../middleware/authenticate');

const router = express.Router();

// router.use(authenticate);

router.get('/category-list', drinksController.getCategoryList);
router.get('/main-page', drinksController.getDrinksByFourCategories);
// here(below) is an extra id. It should be somehow eliminated.
router.get('/id/:id', idValidation, drinksController.getOneDrinkById);
router.get('/:category', drinksController.getDrinksByCategory);




module.exports = router;
