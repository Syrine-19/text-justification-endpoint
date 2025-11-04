import { Request, Response } from 'express';
import { createToken } from '../services/tokenService';

export function createTokenHandler(req: Request, res: Response): void {
  const { email } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email is required' });
    return;
  }

  const tokenResponse = createToken(email);
  res.json(tokenResponse);
}

