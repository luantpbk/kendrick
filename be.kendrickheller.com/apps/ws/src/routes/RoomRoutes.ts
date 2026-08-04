import { Router } from 'express';
import { RoomController } from '../controllers/RoomController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const roomRouter = Router();

roomRouter.get('/', authMiddleware, RoomController.getRooms);
roomRouter.get('/badge', authMiddleware, RoomController.getBadge);
roomRouter.put('/seen', authMiddleware, RoomController.seenRooms);
roomRouter.get('/user/:id', authMiddleware, RoomController.getRoomByUser);
roomRouter.get('/consulation', authMiddleware, RoomController.getConsulationRoom);
roomRouter.get('/:id', authMiddleware, RoomController.getRoomById);
