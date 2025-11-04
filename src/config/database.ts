// In-memory database for tokens
// In production, this could be replaced with a real database

export interface TokenData {
  email: string;
  wordCount: number;
  lastReset: Date;
}

const tokens = new Map<string, TokenData>();

export const tokenStore = {
  get: (token: string): TokenData | undefined => {
    return tokens.get(token);
  },

  set: (token: string, data: TokenData): void => {
    tokens.set(token, data);
  },

  has: (token: string): boolean => {
    return tokens.has(token);
  },

  delete: (token: string): boolean => {
    return tokens.delete(token);
  },

  clear: (): void => {
    tokens.clear();
  }
};

