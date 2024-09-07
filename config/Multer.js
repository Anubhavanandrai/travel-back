import multer from "multer";
import fs from "fs";


const uploadDir = "./public/tmp";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null, uploadDir); 
        
    },
    filename: (req, file, cb) => {
        
        const filename = file.fieldname + '-' + Date.now();
        cb(null, filename);
       
    }
});

export const fileuploader = multer({ storage });
