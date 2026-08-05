import { RoomService } from './src/services/RoomService';
import { prisma } from '@kendrickheller/core';

async function main() {
    console.log("Testing RoomService.getRooms for userId = 1 (Admin)...");
    const result = await RoomService.getRooms(1, 10, 1);
    console.log("Result:", JSON.stringify(result, null, 2));

    const latest = await prisma.message.findFirst({
        where: { roomId: "cc807844-e1fa-4ced-a4a2-3dcc21d47c18", deleteFlg: 0 },
        orderBy: { createdAt: 'desc' }
    });
    console.log("Latest message for test room:", latest);
}

main().catch(console.error).finally(() => prisma.$disconnect());
