const { Schema, model } = require('mongoose');
const handleMongooseError = require('../helpers/handleMongooseError');

const { categoryList, glassList } = require('../constants/drinks');

const drinksSchema = Schema(
	{
		drink: {
			type: String,
			required: [true, 'Set name for the drink']
		},
		category: {
			type: String,
			enum: categoryList
		},
		glass: {
			type: String,
			enum: glassList
		},
		instructions: {
			type: String
		},
		drinkThumb: {
			type: String
		},
		ingredients: {
			type: Array
		},
		about: {
			type: String
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'user'
		},
		favorite: {
			type: [Schema.Types.ObjectId],
			ref: 'user'
		}
	},
	{ versionKey: false, timestamps: true }
);

drinksSchema.post('save', handleMongooseError);

const Drinks = model('cocktail', drinksSchema);

module.exports = Drinks;
