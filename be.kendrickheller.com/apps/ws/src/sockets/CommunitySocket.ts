import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import * as jwt from 'jsonwebtoken';
import { Constants } from '../common/constants';
import { EnumMessageType, EnumMessageDataType } from '../common/enums';
import { ExtendedWebSocket } from './ChatSocket';

export class CommunitySocket {
    private static clients: Set<ExtendedWebSocket> = new Set();
    private static onlineUserIds: Set<number> = new Set();
    private static JWT_SECRET = process.env.JWT_SECRET || 'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=';

    public static async handleConnection(ws: ExtendedWebSocket, request: IncomingMessage) {
        try {
            const url = new URL(request.url!, `http://${request.headers.host}`);
            const token = url.searchParams.get(Constants.ACCESS_TOKEN);
            const deviceId = url.searchParams.get(Constants.DEVICE_ID) || "";

            if (!token) {
                ws.close(1008, "Token missing");
                return;
            }

            // Verify JWT
            const decoded: any = jwt.verify(token, CommunitySocket.JWT_SECRET);
            const userId = Number(decoded.userId || decoded.jti);

            // Close existing connections with the same deviceId
            if (deviceId) {
                for (const client of CommunitySocket.clients) {
                    if (client.deviceId === deviceId && client.userId === userId) {
                        client.close(1006, "Close connection with device");
                        CommunitySocket.clients.delete(client);
                    }
                }
            }

            // Notify others if newly online
            if (!CommunitySocket.onlineUserIds.has(userId)) {
                const connectInfo = {
                    type: EnumMessageType.Connect,
                    data: {
                        type: EnumMessageDataType.Text,
                        value: userId.toString()
                    }
                };

                for (const client of CommunitySocket.clients) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(connectInfo));
                    }
                }

                CommunitySocket.onlineUserIds.add(userId);
            }

            ws.userId = userId;
            ws.deviceId = deviceId;
            ws.isAlive = true;

            CommunitySocket.clients.add(ws);

            // Send list of online users
            const onlineInfos = {
                type: EnumMessageType.Online,
                data: {
                    type: EnumMessageDataType.Text,
                    value: JSON.stringify(Array.from(CommunitySocket.onlineUserIds))
                }
            };
            ws.send(JSON.stringify(onlineInfos));

            ws.on('message', async (message: string) => {
                try {
                    const msgInfo = JSON.parse(message.toString());
                    if (msgInfo.type === EnumMessageType.Ping) return;
                } catch (e) { }
            });

            ws.on('close', () => {
                CommunitySocket.clients.delete(ws);
                const isStillOnline = Array.from(CommunitySocket.clients).some(c => c.userId === userId);
                
                if (!isStillOnline && CommunitySocket.onlineUserIds.has(userId)) {
                    CommunitySocket.onlineUserIds.delete(userId);
                    const disconnectInfo = {
                        type: EnumMessageType.Disconnect,
                        data: {
                            type: EnumMessageDataType.Text,
                            value: userId.toString()
                        }
                    };
                    for (const client of CommunitySocket.clients) {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(disconnectInfo));
                        }
                    }
                }
            });

            ws.on('pong', () => {
                ws.isAlive = true;
            });

        } catch (error) {
            console.error(error);
            ws.close(1011, "An error occurred.");
        }
    }
}
