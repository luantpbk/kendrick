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

export const generateThumb = async (req: any, res: any, next: any) => {
    if (!req.file) {
        return next();
    }
    
    // Only generate thumb for images
    if (req.file.mimetype.startsWith('image/')) {
        try {
            const sourcePath = req.file.path;
            const filename = req.file.filename;
            // The images are saved in UPLOAD_DIR/images
            // Thumbnails go to UPLOAD_DIR/images/thumb
            const thumbDir = path.join(UPLOAD_DIR, 'images', 'thumb');
            if (!fs.existsSync(thumbDir)) {
                fs.mkdirSync(thumbDir, { recursive: true });
            }
            const thumbPath = path.join(thumbDir, filename);
            await sharp(sourcePath)
                .resize(512, null, { withoutEnlargement: true })
                .toFile(thumbPath);
            
            // Optionally, we can also set req.file.thumbPath = thumbPath
        } catch (error) {
            console.error('Error generating thumb in middleware:', error);
        }
    }
    next();
};
