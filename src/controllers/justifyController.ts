import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { canProcessRequest, updateWordCount } from '../services/tokenService';
import { justifyText, countWords } from '../services/justificationService';

export function justifyTextHandler(req: AuthRequest, res: Response): void {
  if (!req.tokenData || !req.token) {
    res.status(401).json({ error: 'Invalid or missing token' });
    return;
  }

  const text = req.body;
  
  if (typeof text !== 'string' || text.trim().length === 0) {
    res.status(400).json({ error: 'Text content is required' });
    return;
  }

  const wordCount = countWords(text);
  
  if (!canProcessRequest(req.tokenData, wordCount, req.token)) {
    res.status(402).send('Payment Required');
    return;
  }

  updateWordCount(req.tokenData, wordCount, req.token);

  const justified = justifyText(text, 80);
  res.type('text/plain').send(justified);
}

