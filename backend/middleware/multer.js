import multer from "multer";
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists at project root
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const safeName = file.originalname.replace(/\s+/g, '-');
        cb(null, `${Date.now()}-${safeName}`);
    },
});

const upload = multer({ storage });

export default upload;