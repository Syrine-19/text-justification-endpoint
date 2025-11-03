import express, { Request, Response } from 'express';
import { justifyText, countWords, resetIfNewDay } from './utils';

const app = express();
app.use(express.text({ type: 'text/plain' }));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.type('text/plain').send(
    'Text Justification API\n' +
    'Endpoints:\n' +
    'POST /api/token   (body: {"email": string})\n' +
    'POST /api/justify (text/plain body, header: Authorization: Bearer <token>)\n'
  );
});

const tokens = new Map<string, { email: string; wordCount: number; lastReset: Date }>();
const DAILY_WORD_LIMIT = 80000;

app.post('/api/token', (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  const token = Buffer.from(`${email}-${Date.now()}`).toString('base64');
  
  tokens.set(token, {
    email,
    wordCount: 0,
    lastReset: new Date()
  });

  res.json({ token });
});

app.post('/api/justify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token || !tokens.has(token)) {
    return res.status(401).json({ error: 'Invalid or missing token' });
  }

  const tokenData = tokens.get(token)!;
  resetIfNewDay(tokenData);

  const text = req.body;
  
  if (typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text content is required' });
  }

  const wordCount = countWords(text);
  
  if (tokenData.wordCount + wordCount > DAILY_WORD_LIMIT) {
    return res.status(402).send('Payment Required');
  }

  tokenData.wordCount += wordCount;

  const justified = justifyText(text, 80);
  res.type('text/plain').send(justified);
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;