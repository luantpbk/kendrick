import { prisma } from '@kendrickheller/core';
import { EnumChatStatus } from '../common/enums';

export class RoomService {
    public static async getRooms(userId: number, size: number, page: number) {
        const skip = (page - 1) * size;
        
        // Find all rooms this user is in
        const roomUsers = await prisma.roomUser.findMany({
            where: { userId: BigInt(userId) },
            select: { roomId: true }
        });
        
        const roomIds = roomUsers.map(ru => ru.roomId);
        
        const total = await prisma.room.count({
            where: { roomId: { in: roomIds }, deleteFlg: 0 }
        });
        
        const rooms = await prisma.room.findMany({
            where: { roomId: { in: roomIds }, deleteFlg: 0 },
            skip,
            take: size,
            orderBy: { createdAt: 'desc' }
        });
        
        // Populate room users manually for now
        const populatedRooms = await Promise.all(rooms.map(async (r) => {
            const users = await prisma.roomUser.findMany({
                where: { roomId: r.roomId }
            });
            
            // Get user info
            const userIds = users.map(u => u.userId);
            const userDetails = await prisma.user.findMany({
                where: { userId: { in: userIds } }
            });
            
            const roomUsersPopulated = users.map(u => {
                const detail = userDetails.find(d => d.userId === u.userId);
                return {
                    ...u,
                    roomId: String(u.roomId),
                    userId: Number(u.userId),
                    fullName: detail?.fullName,
                    avatarUrl: detail?.avataUrl
                };
            });
            
            return {
                ...r,
                roomId: String(r.roomId),
                roomUsers: roomUsersPopulated
            };
        }));
        
        return { count: Number(total), items: populatedRooms };
    }

    public static async getBadge(userId: number): Promise<number> {
        const count = await prisma.roomUser.count({
            where: { userId: BigInt(userId), status: EnumChatStatus.WAIT }
        });
        return count;
    }

    public static async seenRooms(userId: number): Promise<number> {
        const result = await prisma.roomUser.updateMany({
            where: { userId: BigInt(userId), status: EnumChatStatus.WAIT },
            data: { status: EnumChatStatus.READ } // Wait, J2EE uses EnumChatStatus.READ or SEEN?
        });
        return result.count;
    }

    public static async getRoomByUser(loginId: number, targetUserId: number) {
        // Find a single room where both users exist and roomType is Single (1)
        // Simplified logic: find rooms for loginId, then check if targetUserId is in it.
        const myRooms = await prisma.roomUser.findMany({
            where: { userId: BigInt(loginId) },
            select: { roomId: true }
        });
        const myRoomIds = myRooms.map(r => r.roomId);
        
        const sharedRooms = await prisma.roomUser.findMany({
            where: {
                roomId: { in: myRoomIds },
                userId: BigInt(targetUserId)
            }
        });
        
        if (sharedRooms.length > 0) {
            return this.getRoomById(String(sharedRooms[0].roomId));
        }
        
        // Create new room
        const room = await prisma.room.create({
            data: {
                roomType: 1, // Single
                deleteFlg: 0,
                createdAt: new Date()
            }
        });
        
        await prisma.roomUser.createMany({
            data: [
                { roomId: room.roomId, userId: BigInt(loginId), status: EnumChatStatus.READ },
                { roomId: room.roomId, userId: BigInt(targetUserId), status: EnumChatStatus.READ }
            ]
        });
        
        return this.getRoomById(String(room.roomId));
    }

    public static async getRoomById(roomId: string) {
        const room = await prisma.room.findFirst({
            where: { roomId: roomId }
        });
        if (!room) return null;
        
        const users = await prisma.roomUser.findMany({
            where: { roomId: roomId }
        });
        
        const userIds = users.map(u => u.userId);
        const userDetails = await prisma.user.findMany({
            where: { userId: { in: userIds } }
        });
        
        const roomUsersPopulated = users.map(u => {
            const detail = userDetails.find(d => d.userId === u.userId);
            return {
                ...u,
                roomId: String(u.roomId),
                userId: Number(u.userId),
                fullName: detail?.fullName,
                avatarUrl: detail?.avataUrl
            };
        });
        
        return {
            ...room,
            roomId: String(room.roomId),
            roomUsers: roomUsersPopulated
        };
    }

    public static async getConsulationRoom(loginId: number) {
        const myRooms = await prisma.roomUser.findMany({
            where: { userId: BigInt(loginId) },
            select: { roomId: true }
        });
        const myRoomIds = myRooms.map(r => r.roomId);
        
        const consultationRoom = await prisma.room.findFirst({
            where: {
                roomId: { in: myRoomIds },
                roomType: 3 // EnumRoomType.Consulation
            }
        });
        
        if (consultationRoom) {
            return this.getRoomById(String(consultationRoom.roomId));
        }
        
        const room = await prisma.room.create({
            data: {
                roomType: 3,
                deleteFlg: 0,
                createdAt: new Date()
            }
        });
        
        await prisma.roomUser.create({
            data: { roomId: room.roomId, userId: BigInt(loginId), status: EnumChatStatus.READ }
        });
        
        return this.getRoomById(String(room.roomId));
    }
}
