const { ctrlWrapper } = require("../decorators");
const Glasses = require("../models/glasses");


const getAllGlasses = async (req, res) => {
  const result = await Glasses.find().sort({ title: 1 });
  return res.json(result);
};

module.exports = {
  getAllGlasses: ctrlWrapper(getAllGlasses),
};
