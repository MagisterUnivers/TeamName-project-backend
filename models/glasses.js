const { Schema, model } = require("mongoose");
const handleMongooseError = require("../helpers/handleMongooseError");

const glassesSchema = Schema({
  category: {
    type: String,
    required: true,
  },
});
glassesSchema.post("save", handleMongooseError);

const Glasses = model("glass", glassesSchema);

module.exports = Glasses;
