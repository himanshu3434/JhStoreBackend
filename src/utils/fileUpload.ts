import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileUploadHandler = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log("Error while uploading the file to Server", error);
  }
};
const fileDeleteHandler = async (publicId: string) => {
  try {
    const slashIndex = publicId.lastIndexOf("/");
    const dotIndex = publicId.lastIndexOf(".");
    const publicIdWithoutExtension = publicId.substring(
      slashIndex + 1,
      dotIndex
    );

    const response = await cloudinary.uploader.destroy(
      publicIdWithoutExtension
    );
    return response;
  } catch (error) {
    console.log("Error while deleting the Photo from Cloudinary ", error);
  }
};
export { fileUploadHandler, fileDeleteHandler };
