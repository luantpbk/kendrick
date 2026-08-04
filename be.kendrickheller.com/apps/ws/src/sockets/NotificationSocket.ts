import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';

export class NotificationSocket {
    private static clients: Set<WebSocket> = new Set();

    public static handleConnection(ws: WebSocket, request: IncomingMessage) {
        NotificationSocket.clients.add(ws);
        ws.on('close', () => NotificationSocket.clients.delete(ws));
    }

    public static notifyChat(roomId: string) {
        for (const client of NotificationSocket.clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'CHAT_NOTIFICATION', roomId }));
            }
        }
    }
}
