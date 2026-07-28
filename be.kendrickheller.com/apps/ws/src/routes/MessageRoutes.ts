import { Router } from 'express';
import multer from 'multer';
import { MessageController } from '../controllers/MessageController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const messageRouter = Router();
const upload = multer({ dest: 'uploads/images/' });

messageRouter.get('/:id', authMiddleware, MessageController.getMessages);
messageRouter.post('/lastest', authMiddleware, MessageController.getLastestMessages);
messageRouter.post('/image', authMiddleware, upload.array('files'), MessageController.importImage);
