const { ctrlWrapper } = require("../decorators");

const { glassList } = require("../constants/drinks");

const getAllGlasses = async (req, res) => {
    console.log(req)
  const result = glassList;
  return res.json(result.sort());
};

module.exports = {
  getAllGlasses: ctrlWrapper(getAllGlasses),
};
