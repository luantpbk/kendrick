import { RoomService } from './src/services/RoomService';
import { prisma } from '@kendrickheller/core';

async function main() {
    console.log("Testing RoomService.getRooms for userId = 1 (Admin)...");
    
    const roomUsers = await prisma.roomUser.findMany({
        where: { userId: 1n },
        select: { roomId: true }
    });
    console.log("Room Users for Admin 1:", roomUsers);

    if (roomUsers.length > 0) {
        const roomIds = roomUsers.map(r => r.roomId);
        const rooms = await prisma.room.findMany({
            where: { roomId: { in: roomIds } }
        });
        console.log("Rooms found:", rooms);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
