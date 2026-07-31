import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const prisma = new PrismaClient();
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const IMAGE_DIR = path.join(UPLOAD_DIR, 'images');
const THUMB_DIR = path.join(IMAGE_DIR, 'thumb');

async function main() {
    console.log('Starting missing thumbnail generation script...');

    if (!fs.existsSync(THUMB_DIR)) {
        fs.mkdirSync(THUMB_DIR, { recursive: true });
        console.log(`Created thumb directory at ${THUMB_DIR}`);
    }

    // 1 is Image type
    const files = await prisma.file.findMany({
        where: { fileTypeId: 1, deleteFlg: 0 }
    });

    console.log(`Found ${files.length} active image files in database.`);

    let successCount = 0;
    let missingCount = 0;
    let errorCount = 0;

    for (const file of files) {
        if (!file.systemName) continue;

        const sourcePath = path.join(IMAGE_DIR, file.systemName);
        const thumbPath = path.join(THUMB_DIR, file.systemName);

        if (!fs.existsSync(sourcePath)) {
            console.log(`Source file missing: ${sourcePath}`);
            continue;
        }

        if (fs.existsSync(thumbPath)) {
            // console.log(`Thumbnail already exists for ${file.systemName}`);
            continue;
        }

        missingCount++;
        try {
            await sharp(sourcePath)
                .resize(512, null, { withoutEnlargement: true })
                .toFile(thumbPath);
            console.log(`Successfully generated thumbnail for ${file.systemName}`);
            successCount++;
        } catch (error) {
            console.error(`Failed to generate thumbnail for ${file.systemName}:`, error);
            errorCount++;
        }
    }

    console.log('\n--- Summary ---');
    console.log(`Total image records: ${files.length}`);
    console.log(`Missing thumbnails found: ${missingCount}`);
    console.log(`Successfully generated: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
