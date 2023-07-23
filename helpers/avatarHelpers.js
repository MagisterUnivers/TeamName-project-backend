const fs = require("fs/promises");
const path = require("path");
const jimp = require("jimp");
const { cloudinary } = require(".");

const tmpDir = path.resolve("tmp");

const saveUserAvatar = async (req, res) => {
  const { name } = req.body;
let avatarURL = null;

  if (req.file) {
    const { path: filePath } = req.file;
    const uniquePrefix = Date.now();
    const filename = `${uniquePrefix}-${req.file.originalname}`;
    const tmpImagePath = path.join(tmpDir, filename);

    await fs.rename(filePath, tmpImagePath);

    const image = await jimp.read(tmpImagePath);
    await image.resize(100, 100).writeAsync(tmpImagePath);

    const cloudinaryUpload = await cloudinary.uploader.upload(tmpImagePath, {
      folder: "avatars",
    });

    avatarURL = cloudinaryUpload.secure_url;

    await fs.unlink(tmpImagePath);
  }

  const updatedFields = {};
  if (avatarURL) {
    updatedFields.avatarURL = avatarURL;
  }

  if (name) {
    updatedFields.name = name;
  }

  if (Object.keys(updatedFields).length > 0) {
    await req.user.updateOne(updatedFields);
  }

  res.json(updatedFields);
};
module.exports = {
  saveUserAvatar,
};
