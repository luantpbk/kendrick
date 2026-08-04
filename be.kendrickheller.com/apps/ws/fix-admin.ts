import { prisma } from '@kendrickheller/core';
import { EnumChatStatus } from './src/common/enums';

async function main() {
    // 1. Get ADMIN role
    const adminRole = await prisma.role.findFirst({
        where: { roleName: 'ADMIN' }
    });
    
    if (!adminRole) {
        console.log("No ADMIN role found!");
        return;
    }

    // 2. Get all admin users
    const adminUserRoles = await prisma.userRole.findMany({
        where: { roleId: adminRole.roleId }
    });
    console.log(`Found ${adminUserRoles.length} admin users.`);

    // 3. Get all consultation rooms (roomType = 3)
    const consultationRooms = await prisma.room.findMany({
        where: { roomType: 3 }
    });
    console.log(`Found ${consultationRooms.length} consultation rooms.`);

    for (const room of consultationRooms) {
        const existingUsers = await prisma.roomUser.findMany({
            where: { roomId: room.roomId }
        });
        const existingUserIds = new Set(existingUsers.map(u => String(u.userId)));

        let added = 0;
        for (const admin of adminUserRoles) {
            if (!existingUserIds.has(String(admin.userId))) {
                await prisma.roomUser.create({
                    data: {
                        roomId: room.roomId,
                        userId: admin.userId,
                        status: EnumChatStatus.READ
                    }
                });
                added++;
            }
        }
        console.log(`Added ${added} admins to room ${room.roomId}`);
    }
    console.log("Done!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
