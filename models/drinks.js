const { Schema, model } = require("mongoose");
const handleMongooseError = require("../helpers/handleMongooseError");

const { categoryList } = require("../constants/drinks");

const drinksSchema = Schema(
  {
    drink: {
      type: String,
      required: [true, "Set name for the drink"],
    },
    category: {
      type: String,
      enum: categoryList,
      required: true,
    },
    glass: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    drinkThumb: {
      type: String,
    },
    ingredients: {
      type: [Object],
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    favorite: {
      type: [Schema.Types.ObjectId],
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

drinksSchema.post("save", handleMongooseError);

const Drinks = model("drink", drinksSchema);

module.exports = Drinks;
