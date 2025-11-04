import { Router } from 'express';
import tokenRoutes from './tokenRoutes';
import justifyRoutes from './justifyRoutes';

const router = Router();

router.get('/', (req, res) => {
  res.type('text/plain').send(
    'Text Justification API\n' +
    'Endpoints:\n' +
    'POST /api/token   (body: {"email": string})\n' +
    'POST /api/justify (text/plain body, header: Authorization: Bearer <token>)\n'
  );
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/token', tokenRoutes);
router.use('/justify', justifyRoutes);

export default router;

