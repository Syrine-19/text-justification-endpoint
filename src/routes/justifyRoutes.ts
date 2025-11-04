import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { justifyTextHandler } from '../controllers/justifyController';

const router = Router();

router.post('/', authMiddleware, justifyTextHandler);

export default router;

