import express from 'express';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { ChatSocket } from './sockets/ChatSocket';
import { CommunitySocket } from './sockets/CommunitySocket';
import { roomRouter } from './routes/RoomRoutes';
import { messageRouter } from './routes/MessageRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST Routes
app.use('/room', roomRouter);
app.use('/message', messageRouter);

import { NotificationSocket } from './sockets/NotificationSocket';
import { UserNotificationSocket } from './sockets/UserNotificationSocket';

// Upgrade HTTP to WS
server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    
    if (url.pathname.startsWith('/chat/')) {
        wss.handleUpgrade(request, socket, head, (ws) => {
            ChatSocket.handleConnection(ws as any, request);
        });
    } else if (url.pathname === '/community-room') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            CommunitySocket.handleConnection(ws as any, request);
        });
    } else if (url.pathname === '/admin-notifications') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            NotificationSocket.handleConnection(ws as any, request);
        });
    } else if (url.pathname === '/user-notifications') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            UserNotificationSocket.handleConnection(ws as any, request);
        });
    } else {
        socket.destroy();
    }
});

// Periodic ping to keep connections alive
setInterval(() => {
    wss.clients.forEach((ws: any) => {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

const PORT = process.env.WS_PORT || 3003;

server.listen(PORT, () => {
    console.log(`WebSocket and Chat REST API Server listening on port ${PORT}`);
});
