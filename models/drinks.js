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
			// required: true,
		},
		glass: {
			type: String,
			enum: glassList
			// required: true,
		},
		instructions: {
			type: String
			// required: true,
		},
		drinkThumb: {
			type: String
		},
		ingredients: {
			type: Array
			// required: true,
		},
		about: {
			type: String
			// required: true,
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
