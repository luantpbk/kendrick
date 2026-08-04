import multer from 'multer';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// For local testing, we save to a local uploads directory
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let destDir = UPLOAD_DIR;
        if (file.mimetype.startsWith('image/')) {
            destDir = path.join(UPLOAD_DIR, 'images');
        }
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        cb(null, destDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

export const uploadMiddleware = multer({ storage });

export const processImage = async (req: any, res: any, next: any) => {
    if (!req.file || !req.file.mimetype.startsWith('image/')) {
        return next();
    }
    
    try {
        const sourcePath = req.file.path;
        const filename = req.file.filename;
        const originalExt = path.extname(filename);
        const webpFilename = filename.replace(originalExt, '.webp');
        const finalWebpPath = path.join(path.dirname(sourcePath), webpFilename);
        const tempOriginalPath = sourcePath + '.webp.tmp';
        
        // 1. Optimize original image to WebP
        const image = sharp(sourcePath);
        
        let originalInstance = image.resize(1920, null, { withoutEnlargement: true }).webp({ quality: 80 });
        await originalInstance.toFile(tempOriginalPath);
        
        // Clean up original file and move temp to final WebP path
        fs.unlinkSync(sourcePath);
        fs.renameSync(tempOriginalPath, finalWebpPath);

        // Update req.file so subsequent controllers use the .webp file!
        req.file.filename = webpFilename;
        req.file.path = finalWebpPath;
        req.file.mimetype = 'image/webp';
        req.file.originalname = req.file.originalname.replace(originalExt, '.webp');

        // 2. Generate thumb
        const thumbDir = path.join(UPLOAD_DIR, 'images', 'thumb');
        if (!fs.existsSync(thumbDir)) {
            fs.mkdirSync(thumbDir, { recursive: true });
        }
        const thumbPath = path.join(thumbDir, webpFilename);
        
        let thumbInstance = sharp(finalWebpPath).resize(512, null, { withoutEnlargement: true }).webp({ quality: 75 });
        await thumbInstance.toFile(thumbPath);
        
    } catch (error) {
        console.error('Error processing image in middleware:', error);
    }
    
    next();
};
