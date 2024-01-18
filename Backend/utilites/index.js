const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const uploadImage = async (imgPath) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  const options = {
    use_filename: true,
    unique_filename: false,
    folder: "folder1",
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imgPath, options);
    // console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};


module.exports = uploadImage;