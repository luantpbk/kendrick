import { prisma } from '@kendrickheller/core';

async function main() {
    const adminRole = await prisma.role.findFirst({
        where: { roleName: 'ADMIN' }
    });
    const adminUserRoles = await prisma.userRole.findMany({
        where: { roleId: adminRole?.roleId }
    });
    
    for (const admin of adminUserRoles) {
        console.log(`Admin User ID: ${admin.userId}`);
        const roomUsers = await prisma.roomUser.findMany({
            where: { userId: admin.userId }
        });
        console.log(`Rooms for this admin:`, roomUsers.length);
        
        if (roomUsers.length > 0) {
            const roomIds = roomUsers.map(r => r.roomId);
            const rooms = await prisma.room.findMany({
                where: { roomId: { in: roomIds }, deleteFlg: 0 }
            });
            console.log(`Actual valid rooms (deleteFlg=0):`, rooms.length);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
