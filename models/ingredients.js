const { Schema, model } = require("mongoose");
const handleMongooseError = require("../helpers/handleMongooseError");

const ingredientsSchema = Schema({
  title: {
    type: String,
    required: true,
  },
});
ingredientsSchema.post("save", handleMongooseError);

const Ingredients = model("ingredient", ingredientsSchema);

module.exports = Ingredients;
