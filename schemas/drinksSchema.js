const Joi = require("joi");

const { categoryList, glassList } = require("../constants/drinks");

const drinkSchema = Joi.object({
  drink: Joi.string().required().messages({
    "any.required": 'Missing required "drink" field',
  }),
  category: Joi.string()
    .valid(...categoryList)
    .required()
    .messages({ "any.required": 'Missing required "category" field' }),
  glass: Joi.string()
    .valid(...glassList)
    .required()
    .messages({ "any.required": 'Missing required "glass" field' }),
  instructions: Joi.string().required().messages({
    "any.required": 'Missing required "instructions" field',
  }),
  drinkThumb: Joi.string(),
  about: Joi.string().required().messages({
    "any.required": 'Missing required "about" field',
  }),
});

// const updateFavoriteSchema = Joi.object({
//   favorite: Joi.string(),

// })
module.exports = { drinkSchema };

// ingredients: {
//   type: [Object],
//   required: true,
// },

// owner: {
//   type: Schema.Types.ObjectId,
//   ref: "user",
// },
// favorite: {
//   type: [Schema.Types.ObjectId],
//   ref: "user",
// },
