const Joi = require('joi');

const { nameRegexp, emailRegexp, passwordRegexp } = require('../constants/users');

const userRegisterSchema = Joi.object({
	name: Joi.string().required().pattern(nameRegexp),
	email: Joi.string().required().pattern(emailRegexp),
	password: Joi.string().required().min(6).max(16).pattern(passwordRegexp),
});

const userLoginSchema = Joi.object({
	password: Joi.string().required().min(6),
	email: Joi.string().required().pattern(emailRegexp),
	subscription: Joi.string()
});

const userEmailSchema = Joi.object({
	email: Joi.string().required().pattern(emailRegexp)
});

module.exports = {
	userRegisterSchema,
	userLoginSchema,
	userEmailSchema
};
