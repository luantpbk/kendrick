import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import * as jwt from 'jsonwebtoken';
import { prisma } from '@kendrickheller/core';
import { Constants } from '../common/constants';
import { EnumChatStatus, EnumMessageType, EnumMessageDataType } from '../common/enums';

export interface ExtendedWebSocket extends WebSocket {
    userId?: number;
    deviceId?: string;
    roomId?: string;
    userIds?: number[];
    isAlive?: boolean;
}

export class ChatSocket {
    private static rooms: Map<string, Set<ExtendedWebSocket>> = new Map();
    private static JWT_SECRET = process.env.JWT_SECRET || 'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=';

    public static async handleConnection(ws: ExtendedWebSocket, request: IncomingMessage) {
        try {
            const url = new URL(request.url!, `http://${request.headers.host}`);
            const pathParts = url.pathname.split('/');
            const roomIdStr = pathParts[pathParts.length - 1]; // e.g. /chat/:roomId
            const token = url.searchParams.get(Constants.ACCESS_TOKEN);
            const deviceId = url.searchParams.get(Constants.DEVICE_ID) || "";

            if (!token) {
                ws.close(1008, "Token missing");
                return;
            }

            // Verify JWT
            const decoded: any = jwt.verify(token, ChatSocket.JWT_SECRET);
            const userId = Number(decoded.userId || decoded.jti);

            // Fetch Room from DB
            const roomUser = await prisma.roomUser.findFirst({
                where: { roomId: roomIdStr, userId: BigInt(userId) }
            });

            if (!roomUser) {
                ws.close(1008, "You are not in this room");
                return;
            }

            // Get all userIds in room
            const roomUsers = await prisma.roomUser.findMany({
                where: { roomId: roomIdStr }
            });
            const userIds = roomUsers.map(ru => Number(ru.userId));

            if (!ChatSocket.rooms.has(roomIdStr)) {
                ChatSocket.rooms.set(roomIdStr, new Set());
            }

            const roomClients = ChatSocket.rooms.get(roomIdStr)!;

            // Close existing connections with the same deviceId
            if (deviceId) {
                for (const client of roomClients) {
                    if (client.deviceId === deviceId && client.userId === userId) {
                        client.close(1006, "Close connection with device");
                        roomClients.delete(client);
                    }
                }
            }

            ws.userId = userId;
            ws.deviceId = deviceId;
            ws.roomId = roomIdStr;
            ws.userIds = userIds;
            ws.isAlive = true;

            roomClients.add(ws);

            // Update read status
            if (Number(roomUser.status) !== EnumChatStatus.READ) {
                await prisma.roomUser.updateMany({
                    where: { roomId: roomIdStr, userId: BigInt(userId) },
                    data: { status: EnumChatStatus.READ }
                });
            }

            ws.on('message', async (message: string) => {
                await ChatSocket.handleMessage(ws, message.toString());
            });

            ws.on('close', () => {
                ChatSocket.rooms.get(roomIdStr)?.delete(ws);
            });

            ws.on('pong', () => {
                ws.isAlive = true;
            });

        } catch (error) {
            console.error(error);
            ws.close(1011, "An error occurred.");
        }
    }

    private static async handleMessage(ws: ExtendedWebSocket, messageStr: string) {
        try {
            const msgInfo = JSON.parse(messageStr);
            if (msgInfo.type === EnumMessageType.Ping) return;

            if (msgInfo.data?.value === ":/close") {
                ws.close(1000, "Disconnect on demand");
                return;
            }

            const roomId = ws.roomId!;
            const senderId = ws.userId!;
            msgInfo.from = senderId;

            const roomClients = ChatSocket.rooms.get(roomId) || new Set();
            const unavailableIds = new Set(ws.userIds);

            if (msgInfo.type === EnumMessageType.Exchange) {
                for (const client of roomClients) {
                    if (client.readyState === WebSocket.OPEN) {
                        unavailableIds.delete(client.userId!);
                        client.send(JSON.stringify(msgInfo));
                    }
                }
            }

            // Save to DB
            await prisma.message.create({
                data: {
                    roomId: roomId,
                    userId: BigInt(senderId),
                    messageType: msgInfo.data.type,
                    messageValue: msgInfo.data.value,
                    createdAt: new Date(),
                    deleteFlg: 0
                }
            });

            // Update status for unavailable users
            for (const unavailableId of unavailableIds) {
                await prisma.roomUser.updateMany({
                    where: { roomId: roomId, userId: BigInt(unavailableId) },
                    data: { status: EnumChatStatus.WAIT }
                });

                // In J2EE, NotificationCrossService.notifyChat is called here
                // We'll leave a TODO or trigger an internal event
                console.log(`Push notification to user ${unavailableId} for room ${roomId}`);
            }

        } catch (error) {
            console.error("Message processing error:", error);
        }
    }
}
