const Joi = require('joi');

const {
	nameRegexp,
	emailRegexp,
	passwordRegexp,
	themeList
} = require('../constants/users');

const userRegisterSchema = Joi.object({
	name: Joi.string().required().pattern(nameRegexp),
	email: Joi.string().required().pattern(emailRegexp),
	password: Joi.string().required().min(6).max(16).pattern(passwordRegexp)
});

const userLoginSchema = Joi.object({
	email: Joi.string().required().pattern(emailRegexp),
	password: Joi.string().required().min(6).max(16).pattern(passwordRegexp)
});

const userEmailSchema = Joi.object({
	email: Joi.string().required().pattern(emailRegexp)
});

const userThemeSchema = Joi.object({
  theme: Joi.string()
    .required()
    .valid(...themeList)
    .messages({
      "object.empty": "{#label} Object must contain at least one field",
      "any.required": "{#label} missing required field",
    }),
});
module.exports = {
	userRegisterSchema,
	userLoginSchema,
	userEmailSchema,
	userThemeSchema,
};
