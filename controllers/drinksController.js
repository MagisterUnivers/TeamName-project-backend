const { ctrlWrapper } = require("../decorators");
const { HttpError } = require("../helpers");

const Drinks = require("../models/drinks");
const Categories = require("../models/categories");

const getCategoryList = async (req, res) => {
  const result = await Categories.find().sort({ category: 1 });
  return res.json(result);
};
const getDrinksByCategory = async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 9 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Drinks.find({ category }, "drink drinkThumb category", {
    skip,
    limit,
  });
  res.json(result);
};
const getDrinksByFourCategories = async (req, res) => {
  const result = await Drinks.find(
    {
      $or: [
        { category: "Ordinary Drink" },
        { category: "Cocktail" },
        { category: "Shake" },
        { category: "Other/Unknown" },
      ],
    },
    "drink drinkThumb category"
  );

  // const limit = 3;
  // const ordinaryDrinks = await Drinks.find(
  //   { category: "Ordinary Drink" },
  //   "drink drinkThumb category",
  // {
  //   limit,
  // }
  // );
  // const cocktails = await Drinks.find(
  //   { category: "Cocktail" },
  //   "drink drinkThumb category",
  // {
  //   limit,
  // }
  // );
  // const shakes = await Drinks.find(
  //   { category: "Shake" },
  //   "drink drinkThumb category",
  // {
  //   limit,
  // }
  // );
  // const others = await Drinks.find(
  //   { category: "Other/Unknown" },
  //   "drink drinkThumb category",
  // {
  //   limit,
  // }
  // );
  // const result = { ordinaryDrinks, cocktails, shakes, others };
  res.json(result);
};
const getOneDrinkById = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  const result = await Drinks.findById(id).exec();
  if (!result) throw HttpError(404, `Contact with id=${id} was not found`);
  res.json(result);
};

// Search

const searchAllDrinks = async (req, res) => {
  const result = await Drinks.find();
  res.json(result);
};

// Ingredients

const getIngredientsList = async (req, res) => {
  const result = await Categories.find().sort({ category: 1 });
  return res.json(result);
};
const getDrinksByIngredient = async (req, res) => {
  console.log(req);
  const { title } = req.query;
  const { page = 1, limit = 9 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Drinks.find(
    { ingredients: { $elemMatch: { title } } },
    "drink drinkThumb category ingredients",
    {
      skip,
      limit,
    }
  );
  res.json(result);
};

// Own

const getAllOwnDrinks = async (req, res) => {
  const result = await Drinks.find();
  res.json(result);
};
const addOwnDrink = async (req, res) => {
  // const { _id: owner } = req.user;
  const result = await Drinks.create({ ...req.body });
  res.status(201).json(result);
};
const deleteOwnDrink = async (req, res) => {
  console.log(req.params);
  const { drinkId } = req.params;
  const result = await Drinks.findByIdAndDelete(drinkId);
  if (!result) throw HttpError(404, `Contact with id=${drinkId} was not found`);
  res.json({ message: "Contact deleted" });
};

// Favorites

const getAllFavoriteDrinks = async (req, res) => {
  const result = await Drinks.find();
  res.json(result);
};
const addFavoriteDrink = async (req, res) => {
  // const { _id: owner } = req.user;
  const result = await Drinks.create({ ...req.body });
  res.status(201).json(result);
};
const deleteFavoriteDrink = async (req, res) => {
  console.log(req.params);
  const { drinkId } = req.params;
  const result = await Drinks.findByIdAndDelete(drinkId);
  if (!result) throw HttpError(404, `Contact with id=${drinkId} was not found`);
  res.json({ message: "Contact deleted" });
};

// Popular

const getPopular = async (req, res) => {
  const result = await Drinks.find();
  res.json(result);
};
// const updateContactById = async (req, res) => {
// 	const { contactId } = req.params;
// 	const result = await Contacts.findByIdAndUpdate(contactId, req.body);
// 	if (!result) throw HttpError(404, `Contact with id=${contactId} not found`);

// 	res.json(result);
// };

// const updateFavoriteStatus = async (req, res) => {
// 	const { contactId } = req.params;
// 	const { body } = req;

// 	const result = await Contacts.findByIdAndUpdate(
// 		contactId,
// 		{ $set: { favorite: body.favorite } },
// 		{ new: true }
// 	);

// 	if (!result) {
// 		throw HttpError(404, `Contact with id=${contactId} not found`);
// 	}
// 	res.json(result);
// };

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
  getPopular: ctrlWrapper(getPopular),
  // updateContactById: ctrlWrapper(updateContactById),
  // updateFavoriteStatus: ctrlWrapper(updateFavoriteStatus)
};
