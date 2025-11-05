import { TokenModel, TokenResponse } from '../models/Token';

export interface TokenData {
  email: string;
  wordCount: number;
  lastReset: Date;
}

export const DAILY_WORD_LIMIT = 80000;

export function createToken(email: string): TokenResponse {

  TokenModel.deleteTokensByEmail(email);
  
  const token = Buffer.from(`${email}-${Date.now()}`).toString('base64');
  
  const createdToken = TokenModel.create(token, email);
  if (!createdToken) {
    throw new Error('Failed to create token');
  }
  
  return { token };
}

export function getToken(token: string): TokenData | undefined {
  const dbToken = TokenModel.findByToken(token);
  if (!dbToken) {
    return undefined;
  }
  
  return {
    email: dbToken.email,
    wordCount: dbToken.wordCount,
    lastReset: new Date(dbToken.lastReset)
  };
}

export function isValidToken(token: string): boolean {
  return TokenModel.findByToken(token) !== null;
}

export function resetIfNewDay(tokenData: TokenData, token: string): void {
  const now = new Date();
  const lastReset = tokenData.lastReset;
  
  if (now.getDate() !== lastReset.getDate() || 
      now.getMonth() !== lastReset.getMonth() || 
      now.getFullYear() !== lastReset.getFullYear()) {
    TokenModel.resetWordCount(token);
    tokenData.wordCount = 0;
    tokenData.lastReset = now;
  }
}

export function canProcessRequest(tokenData: TokenData, wordCount: number, token: string): boolean {
  resetIfNewDay(tokenData, token);
  return tokenData.wordCount + wordCount <= DAILY_WORD_LIMIT;
}

export function updateWordCount(tokenData: TokenData, wordCount: number, token: string): void {
  tokenData.wordCount += wordCount;
  TokenModel.updateWordCount(token, tokenData.wordCount);
}
