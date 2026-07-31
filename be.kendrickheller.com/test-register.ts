import { FileService } from './apps/api/src/services/FileService';
import { prisma } from '@kendrickheller/core';

async function test() {
    const res = await FileService.registerExistingImage('images/product_image/b3f81dbd-6872-4b0d-9be3-c3407f555410.jpg');
    console.log(res);
}

test().catch(console.error).finally(() => prisma.$disconnect());
