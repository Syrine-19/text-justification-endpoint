import { Request, Response, NextFunction } from 'express';
import { getToken } from '../services/tokenService';

export interface AuthRequest extends Request {
  token?: string;
  tokenData?: {
    email: string;
    wordCount: number;
    lastReset: Date;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }

  const tokenData = getToken(token);
  if (!tokenData) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  req.token = token;
  req.tokenData = tokenData;
  next();
}

