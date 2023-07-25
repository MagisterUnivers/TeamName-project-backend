const Joi = require('joi');

const { categoryList, glassList } = require('../constants/drinks');

const drinkSchema = Joi.object({
	drink: Joi.string().required().messages({
		'any.required': 'Missing required "drink" field'
	}),
	category: Joi.string()
		.valid(...categoryList)
		.messages({ 'any.required': 'Missing required "category" field' }),
	glass: Joi.string()
		.valid(...glassList)
		.messages({ 'any.required': 'Missing required "glass" field' }),
	instructions: Joi.string().messages({
		'any.required': 'Missing required "instructions" field'
	}),
	drinkThumb: Joi.string(),
	about: Joi.string().messages({
		'any.required': 'Missing required "about" field'
	}),
	ingredients: Joi.string().messages({
		'any.required': 'Missing required "ingredients" field'
	})
});

module.exports = { drinkSchema };
