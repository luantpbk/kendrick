import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { prisma } from '@kendrickheller/core';

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const IMAGES_DIR = path.join(UPLOAD_DIR, 'images');
const THUMB_DIR = path.join(IMAGES_DIR, 'thumb');

async function processImage(filePath: string, isThumb: boolean) {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

    try {
        const image = sharp(filePath);
        
        const maxWidth = isThumb ? 512 : 1920;
        const quality = isThumb ? 75 : 80;

        let sharpInstance = image.resize(maxWidth, null, { withoutEnlargement: true }).webp({ quality });

        const newFilePath = filePath.substring(0, filePath.length - ext.length) + '.webp';
        
        if (filePath === newFilePath) return;

        await sharpInstance.toFile(newFilePath);
        
        const originalStats = fs.statSync(filePath);
        const newStats = fs.statSync(newFilePath);
        
        fs.unlinkSync(filePath); // Delete old file
        
        const oldName = path.basename(filePath);
        const newName = path.basename(newFilePath);

        if (!isThumb) {
            // Update Database for original images
            await prisma.file.updateMany({
                where: { systemName: oldName },
                data: {
                    systemName: newName,
                    fileName: newName
                }
            });
        }
        
        const savedPercent = ((originalStats.size - newStats.size) / originalStats.size * 100).toFixed(2);
        console.log(`Converted to WebP: ${oldName} -> ${newName} | Saved: ${savedPercent}% (${(originalStats.size/1024).toFixed(1)}KB -> ${(newStats.size/1024).toFixed(1)}KB)`);
        
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
    console.log('Starting WebP conversion for original images...');
    await scanAndProcess(IMAGES_DIR, false);
    
    console.log('Starting WebP conversion for thumbnails...');
    await scanAndProcess(THUMB_DIR, true);
    
    console.log('Finished WebP conversion!');
    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
});
