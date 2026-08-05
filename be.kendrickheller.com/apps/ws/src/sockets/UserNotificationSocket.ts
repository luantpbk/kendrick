import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import * as jwt from 'jsonwebtoken';
import { Constants } from '../common/constants';

export class UserNotificationSocket {
    private static clients: Map<number, WebSocket> = new Map();
    private static JWT_SECRET = process.env.JWT_SECRET || 'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=';

    public static handleConnection(ws: WebSocket, request: IncomingMessage) {
        try {
            const url = new URL(request.url!, `http://${request.headers.host}`);
            const token = url.searchParams.get(Constants.ACCESS_TOKEN) || url.searchParams.get('token');

            if (!token) {
                ws.close(1008, "Token missing");
                return;
            }

            const decoded: any = jwt.verify(token, UserNotificationSocket.JWT_SECRET);
            const userId = Number(decoded.userId || decoded.jti);

            UserNotificationSocket.clients.set(userId, ws);
            
            // Periodically ping to keep connection alive
            ws.on('pong', () => {
                (ws as any).isAlive = true;
            });

            ws.on('close', () => UserNotificationSocket.clients.delete(userId));
        } catch (e) {
            ws.close(1008, "Invalid token");
        }
    }

    public static notifyUser(userId: number, roomId: string) {
        const client = UserNotificationSocket.clients.get(userId);
        if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'CHAT_NOTIFICATION', roomId }));
        }
    }
}
