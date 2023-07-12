const Joi = require("joi");

const {categoryList} = require("../constants/drinks");

const drinkSchema = Joi.object({
  drink: Joi.string().required().messages({
    "any.required": 'Missing required "drink" field',
  }),
  category: Joi.string()
  .valid(...categoryList).required()    
    .messages({ "any.required": "Missing required category field" }),
  
});

module.exports = { drinkSchema };
