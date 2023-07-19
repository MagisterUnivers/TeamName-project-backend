const { ctrlWrapper } = require('../decorators');
const { HttpError } = require('../helpers');
const path = require('path');
const fs = require('fs/promises');
const drinksImgDir = path.resolve('public', 'drinksImg');

const Drinks = require('../models/drinks');
const Categories = require('../models/categories');
const Ingredients = require('../models/ingredients');

const getCategoryList = async (req, res) => {
	const result = await Categories.find().sort({ category: 1 });
	return res.json(result);
};
const getDrinksByCategory = async (req, res) => {
	const { category } = req.params;
	const { page = 1, limit = 9 } = req.query;
	const skip = (page - 1) * limit;
	const cocktails = await Drinks.find(
		{ category },
		'drink drinkThumb category',
		{
			skip,
			limit
		}
	);
	const totalHits = await Drinks.find({ category }).count();
	const result = { cocktails, totalHits, page };
	res.json(result);
};
const getDrinksByFourCategories = async (req, res) => {
	const result = await Drinks.find(
		{
			$or: [
				{ category: 'Ordinary Drink' },
				{ category: 'Cocktail' },
				{ category: 'Shake' },
				{ category: 'Other/Unknown' }
			]
		},
		'drink drinkThumb category'
	);
	res.json(result);
};
// с ограничением в 20
// const getDrinksByFourCategories = async (req, res) => {
// 	const result = await Drinks.aggregate([
// 	  {
// 		$match: {
// 		  $or: [
// 			{ category: 'Ordinary Drink' },
// 			{ category: 'Cocktail' },
// 			{ category: 'Shake' },
// 			{ category: 'Other/Unknown' },
// 		  ],
// 		},
// 	  },
// 	  {
// 		$group: {
// 		  _id: '$category',
// 		  drinks: { $push: { drink: '$drink', _id: '_id', drinkThumb: '$drinkThumb' } },
// 		},
// 	  },
// 	  {
// 		$project: {
// 		  _id: 0,
// 		  category: '$_id',
// 		  drinks: { $slice: ['$drinks', 20] }, // обмеження до 20 елементів на кожну категорію
// 		},
// 	  },
// 	]);
  
// 	res.json(result);
//   };

const getOneDrinkById = async (req, res) => {
	const { id } = req.params;
	const result = await Drinks.findById(id).exec();
	if (!result) throw HttpError(404, `Cocktail with id=${id} was not found`);
	res.json(result);
};

// Search

const searchAllDrinks = async (req, res) => {
	const { query, category, ingredient } = req.query;
	const { page = 1, limit = 9 } = req.query;
	const skip = (page - 1) * limit;
	const dbQuery = {};
	category && (dbQuery.category = category);
	ingredient && (dbQuery['ingredients.title'] = ingredient);
	query && (dbQuery.drink = { $regex: query, $options: 'i' });
	const cocktails = await Drinks.find(
		dbQuery,
		'drink drinkThumb category ingredients',
		{
			skip,
			limit
		}
	);
	const totalHits = await Drinks.find(dbQuery).count();
	const result = { cocktails, totalHits, page };
	res.json(result);
};

// Ingredients

const getIngredientsList = async (req, res) => {
	const result = await Ingredients.find().sort({ title: 1 });
	return res.json(result);
};
const getDrinksByIngredient = async (req, res) => {
	const { title } = req.query;
	const { page = 1, limit = 9 } = req.query;
	const skip = (page - 1) * limit;
	const result = await Drinks.find(
		// { ingredients: { $elemMatch: { title } } },
		{ 'ingredients.title': title },
		'drink drinkThumb category ingredients',
		{
			skip,
			limit
		}
	);
	res.json(result);
};

// Own
const getAllOwnDrinks = async (req, res) => {
	const { _id: owner } = req.user;
	const { page = 1, limit = 9 } = req.query;
	const skip = (page - 1) * limit;
	const cocktails = await Drinks.find(
		{ owner },
		'drink drinkThumb category ingredients about',
		{ skip, limit }
	).populate('owner', 'name email').sort({createdAt: -1});
	const totalHits = await Drinks.find({ owner }).count();
	const result = { cocktails, totalHits, page };
	res.json(result);
};

const addOwnDrink = async (req, res) => {
	let drinkThumb = '';
	if (req.file) {
		const { path: oldPath, filename } = req.file;
		const newPath = path.join(drinksImgDir, filename);
		await fs.rename(oldPath, newPath);
		drinkThumb = path.join('drinksImg', filename);
	}
    const ingredients = JSON.parse(req.body.ingredients);
	console.log(ingredients);
	const { _id: owner } = req.user;
	const result = await Drinks.create({ ...req.body, ingredients,  owner, drinkThumb });
	res.status(201).json(result);
};

const deleteOwnDrink = async (req, res) => {
	const { id } = req.params;
	const result = await Drinks.findByIdAndDelete(id);
	if (!result) throw HttpError(404, `Cocktail with id=${id} was not found`);
	res.json({ message: 'Cocktail was deleted' });
};

// Favorites

const getAllFavoriteDrinks = async (req, res) => {
	const { _id: owner } = req.user;
	const { page = 1, limit = 9 } = req.query;
	const skip = (page - 1) * limit;
	const cocktails = await Drinks.find(
		{ favorite: owner },
		'drink drinkThumb category about favorite',
		{ skip, limit }
	).populate('owner', 'name email');
	const totalHits = await Drinks.find({ favorite: owner }).count();
	const result = { cocktails, totalHits, page };
	res.json(result);
};

const addFavoriteDrink = async (req, res) => {
	const { _id: owner } = req.user;
	const { id } = req.params;
	const result = await Drinks.findByIdAndUpdate(
		id,
		{ $addToSet: { favorite: owner } },
		{ new: true }
	);
	if (!result) {
		throw HttpError(404, `Cocktail with id=${id} not found`);
	}
	res.json(result);
};

const deleteFavoriteDrink = async (req, res) => {
	const { _id: owner } = req.user;
	const { id } = req.params;
	const cocktails = await Drinks.findByIdAndUpdate(
		id,
		{ $pull: { favorite: owner } },
		{ new: true }
	);
	if (!cocktails) {
		throw HttpError(404, `Cocktail with id=${id} not found`);
	}
	res.json({
		message: `The cocktail with id=${id} was removed from your favorites`,
		cocktails
	});
};

// Popular

const getPopular = async (req, res) => {
	const result = await Drinks.find().sort({ favorite: -1 }).limit(4);
	res.json(result);
};

module.exports = {
	getCategoryList: ctrlWrapper(getCategoryList),
	getOneDrinkById: ctrlWrapper(getOneDrinkById),
	getDrinksByCategory: ctrlWrapper(getDrinksByCategory),
	getDrinksByFourCategories: ctrlWrapper(getDrinksByFourCategories),
	getIngredientsList: ctrlWrapper(getIngredientsList),
	getDrinksByIngredient: ctrlWrapper(getDrinksByIngredient),
	searchAllDrinks: ctrlWrapper(searchAllDrinks),
	getAllOwnDrinks: ctrlWrapper(getAllOwnDrinks),
	addOwnDrink: ctrlWrapper(addOwnDrink),
	deleteOwnDrink: ctrlWrapper(deleteOwnDrink),
	getAllFavoriteDrinks: ctrlWrapper(getAllFavoriteDrinks),
	addFavoriteDrink: ctrlWrapper(addFavoriteDrink),
	deleteFavoriteDrink: ctrlWrapper(deleteFavoriteDrink),
	getPopular: ctrlWrapper(getPopular)
};
