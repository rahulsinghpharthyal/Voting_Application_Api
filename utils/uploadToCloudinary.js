import { v2 } from "cloudinary";
import cloudinary from "cloudinary";

export const uploadDocuments = async (fileBuffer) => {
    
    cloudinary.v2.config({
        cloud_name: process.env.CLOUD_NAME, //'your_cloud_name',
        api_key: process.env.API_KEY, //'your_api_key',
        api_secret: process.env.API_SECRET, //'your_api_secret'
    });
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        resource_type: "auto", 
    };
    try {
        const result = await new Promise((resolve, reject) => {
            const stream = v2.uploader.upload_stream(
                options,
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            );
            stream.end(fileBuffer);
        });
        return result;
    } catch (error) {
        console.log("Upload Failed:", error);
    }
};

