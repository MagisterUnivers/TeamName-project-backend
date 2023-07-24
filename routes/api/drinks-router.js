const express = require('express');
const drinksController = require('../../controllers/drinksController');
const idValidation = require('../../middleware/idValidation');
const authenticate = require('../../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

router.get('/category-list', drinksController.getCategoryList);
router.get('/main-page', drinksController.getDrinksByFourCategories);
router.get('/id/:id', idValidation, drinksController.getOneDrinkById);
router.get('/:category', drinksController.getDrinksByCategory);

module.exports = router;
