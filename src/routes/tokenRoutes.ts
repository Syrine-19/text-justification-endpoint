import { Router } from 'express';
import { createTokenHandler } from '../controllers/tokenController';

const router = Router();

router.post('/', createTokenHandler);

export default router;

