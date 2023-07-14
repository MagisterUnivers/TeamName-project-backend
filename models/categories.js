const { Schema, model } = require("mongoose");
const handleMongooseError = require("../helpers/handleMongooseError");

const categoriesSchema = Schema({
  category: {
    type: String,
    required: true,
  },
});
categoriesSchema.post("save", handleMongooseError);

const Categories = model("categorie", categoriesSchema);

module.exports = Categories;
