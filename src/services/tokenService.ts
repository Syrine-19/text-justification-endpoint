import { tokenStore, TokenData } from '../config/database';
import { TokenResponse } from '../models/Token';

export const DAILY_WORD_LIMIT = 80000;

export function createToken(email: string): TokenResponse {
  const token = Buffer.from(`${email}-${Date.now()}`).toString('base64');
  
  const tokenData: TokenData = {
    email,
    wordCount: 0,
    lastReset: new Date()
  };

  tokenStore.set(token, tokenData);
  return { token };
}

export function getToken(token: string): TokenData | undefined {
  return tokenStore.get(token);
}

export function isValidToken(token: string): boolean {
  return tokenStore.has(token);
}

export function resetIfNewDay(tokenData: TokenData): void {
  const now = new Date();
  const lastReset = tokenData.lastReset;
  
  if (now.getDate() !== lastReset.getDate() || 
      now.getMonth() !== lastReset.getMonth() || 
      now.getFullYear() !== lastReset.getFullYear()) {
    tokenData.wordCount = 0;
    tokenData.lastReset = now;
  }
}

export function canProcessRequest(tokenData: TokenData, wordCount: number): boolean {
  resetIfNewDay(tokenData);
  return tokenData.wordCount + wordCount <= DAILY_WORD_LIMIT;
}

export function updateWordCount(tokenData: TokenData, wordCount: number): void {
  tokenData.wordCount += wordCount;
}

