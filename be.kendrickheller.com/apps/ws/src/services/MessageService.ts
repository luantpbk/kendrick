import { prisma } from '@kendrickheller/core';

export class MessageService {
    public static async getMessages(roomId: string, size: number, page: number) {
        const skip = (page - 1) * size;
        
        const total = await prisma.message.count({
            where: { roomId: roomId, deleteFlg: 0 }
        });
        
        const messages = await prisma.message.findMany({
            where: { roomId: roomId, deleteFlg: 0 },
            skip,
            take: size,
            orderBy: { createdAt: 'desc' } // J2EE usually returns latest messages first
        });
        
        const mapped = messages.map(m => ({
            ...m,
            messageId: String(m.messageId),
            roomId: String(m.roomId),
            userId: Number(m.userId)
        }));
        
        return { count: Number(total), items: mapped };
    }

    public static async getLastestMessages(roomIds: string[]) {
        const result: Record<string, any> = {};
        for (const rId of roomIds) {
            const latest = await prisma.message.findFirst({
                where: { roomId: rId, deleteFlg: 0 },
                orderBy: { createdAt: 'desc' }
            });
            if (latest) {
                result[rId] = {
                    ...latest,
                    messageId: String(latest.messageId),
                    roomId: String(latest.roomId),
                    userId: Number(latest.userId)
                };
            }
        }
        return result;
    }
}
