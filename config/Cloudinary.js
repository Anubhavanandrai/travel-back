import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const  uploadOnCloudinary =async(localfilepath)=>{
  
  try{
    if(!localfilepath){
      return (null)
    }
       const response= await cloudinary.uploader.upload(localfilepath,{
        resource_type:"auto"
       })
        
        return response
  }
  catch(err) {
    console.log("Error uploading file to cloudinary: ",err)
    return null;
  }
}

export {uploadOnCloudinary}