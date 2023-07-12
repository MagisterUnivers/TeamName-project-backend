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
  const limit = 3;
  const ordinaryDrinks = await Drinks.find(
    { category: "Ordinary Drink" },
    "drink drinkThumb category",
    {
      limit,
    }
  );
  const cocktails = await Drinks.find(
    { category: "Cocktail" },
    "drink drinkThumb category",
    {
      limit,
    }
  );
  const shakes = await Drinks.find(
    { category: "Shake" },
    "drink drinkThumb category",
    {
      limit,
    }
  );
  const others = await Drinks.find(
    { category: "Other/Unknown" },
    "drink drinkThumb category",
    {
      limit,
    }
  );
  const result = { ordinaryDrinks, cocktails, shakes, others };
  res.json(result);
};

const getOneDrink = async (req, res) => {
  console.log(req.params)
	const { id } = req.params;

	const result = await Drinks.findById(id).exec();
	if (!result) throw HttpError(404, `Contact with id=${id} was not found`);
	res.json(result);
};
const getAllDrinks = async (req, res) => {
  const result = await Drinks.find();
  res.json(result);
};
const addDrink = async (req, res) => {
	// const { _id: owner } = req.user;
	const result = await Drinks.create({ ...req.body, });
	res.status(201).json(result);
};

const deleteDrink = async (req, res) => {
  console.log(req.params)
	const { drinkId } = req.params;
	const result = await Drinks.findByIdAndDelete(drinkId);
	if (!result) throw HttpError(404, `Contact with id=${drinkId} was not found`);
	res.json({ message: 'Contact deleted' });
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
  getAllDrinks: ctrlWrapper(getAllDrinks),
  getCategoryList: ctrlWrapper(getCategoryList),
  getOneDrink: ctrlWrapper(getOneDrink),
  getDrinksByCategory: ctrlWrapper(getDrinksByCategory),
  getDrinksByFourCategories: ctrlWrapper(getDrinksByFourCategories),
  addDrink: ctrlWrapper(addDrink),
  deleteDrink: ctrlWrapper(deleteDrink),
  // updateContactById: ctrlWrapper(updateContactById),
  // updateFavoriteStatus: ctrlWrapper(updateFavoriteStatus)
};
