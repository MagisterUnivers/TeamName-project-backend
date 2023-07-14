const express = require('express');
const drinksController = require('../../controllers/drinksController');
// const authenticate = require('../../middleware/authenticate');

const router = express.Router();

// router.use(authenticate);

router.get('/', drinksController.getDrinksByIngredient);
router.get('/list', drinksController.getIngredientsList);
module.exports = router;