import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const IMAGES_DIR = path.join(UPLOAD_DIR, 'images');
const THUMB_DIR = path.join(IMAGES_DIR, 'thumb');

async function processImage(filePath: string, isThumb: boolean) {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

    try {
        const image = sharp(filePath);
        const metadata = await image.metadata();

        const maxWidth = isThumb ? 512 : 1920;
        let sharpInstance = image.resize(maxWidth, null, { withoutEnlargement: true });

        const quality = isThumb ? 75 : 80;

        if (metadata.format === 'jpeg') {
            sharpInstance = sharpInstance.jpeg({ quality, mozjpeg: true });
        } else if (metadata.format === 'png') {
            sharpInstance = sharpInstance.png({ quality, compressionLevel: 9, palette: true });
        } else if (metadata.format === 'webp') {
            sharpInstance = sharpInstance.webp({ quality });
        }

        const tempPath = filePath + '.tmp';
        await sharpInstance.toFile(tempPath);
        
        const originalStats = fs.statSync(filePath);
        const newStats = fs.statSync(tempPath);
        
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        
        const savedPercent = ((originalStats.size - newStats.size) / originalStats.size * 100).toFixed(2);
        console.log(`Optimized: ${path.basename(filePath)} | Saved: ${savedPercent}% (${(originalStats.size/1024).toFixed(1)}KB -> ${(newStats.size/1024).toFixed(1)}KB)`);
        
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
}

async function scanAndProcess(dir: string, isThumb: boolean) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isFile()) {
            await processImage(fullPath, isThumb);
        }
    }
}

async function main() {
    console.log('Starting optimization of original images...');
    await scanAndProcess(IMAGES_DIR, false);
    
    console.log('Starting optimization of thumbnails...');
    await scanAndProcess(THUMB_DIR, true);
    
    console.log('Finished image optimization!');
}

main().catch(console.error);
