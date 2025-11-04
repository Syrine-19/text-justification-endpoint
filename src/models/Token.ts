export interface Token {
  token: string;
  email: string;
  wordCount: number;
  lastReset: Date;
}

export interface TokenResponse {
  token: string;
}

