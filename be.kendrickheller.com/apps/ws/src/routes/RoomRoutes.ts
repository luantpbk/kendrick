import { Router } from 'express';
import { RoomController } from '../controllers/RoomController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const roomRouter = Router();

roomRouter.get('/', authMiddleware, RoomController.getRooms);
roomRouter.get('/badge', authMiddleware, RoomController.getBadge);
roomRouter.put('/seen', authMiddleware, RoomController.seenRooms);
roomRouter.get('/user/:id', authMiddleware, RoomController.getRoomByUser);
// Note: /consulation is missing from controller for brevity but can be added similarly
roomRouter.get('/:id', authMiddleware, RoomController.getRoomById);
