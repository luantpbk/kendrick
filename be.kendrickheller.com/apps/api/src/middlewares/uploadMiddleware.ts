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
        const tempOriginalPath = sourcePath + '.tmp';
        
        // 1. Optimize original image
        const image = sharp(sourcePath);
        const metadata = await image.metadata();
        
        let originalInstance = image.resize(1920, null, { withoutEnlargement: true });
        if (metadata.format === 'jpeg') {
            originalInstance = originalInstance.jpeg({ quality: 80, mozjpeg: true });
        } else if (metadata.format === 'png') {
            originalInstance = originalInstance.png({ quality: 80, compressionLevel: 9, palette: true });
        } else if (metadata.format === 'webp') {
            originalInstance = originalInstance.webp({ quality: 80 });
        }
        await originalInstance.toFile(tempOriginalPath);
        
        // Overwrite original with optimized version
        fs.unlinkSync(sourcePath);
        fs.renameSync(tempOriginalPath, sourcePath);

        // 2. Generate thumb
        const thumbDir = path.join(UPLOAD_DIR, 'images', 'thumb');
        if (!fs.existsSync(thumbDir)) {
            fs.mkdirSync(thumbDir, { recursive: true });
        }
        const thumbPath = path.join(thumbDir, filename);
        
        let thumbInstance = sharp(sourcePath).resize(512, null, { withoutEnlargement: true });
        if (metadata.format === 'jpeg') {
            thumbInstance = thumbInstance.jpeg({ quality: 75, mozjpeg: true });
        } else if (metadata.format === 'png') {
            thumbInstance = thumbInstance.png({ quality: 75, compressionLevel: 9, palette: true });
        } else if (metadata.format === 'webp') {
            thumbInstance = thumbInstance.webp({ quality: 75 });
        }
        await thumbInstance.toFile(thumbPath);
        
    } catch (error) {
        console.error('Error processing image in middleware:', error);
    }
    
    next();
};
