import type { ScoreMode, ScoreRow } from "./database";

export type SaveScoreRequest = {
  nickname: string;
  mode: ScoreMode;
  score: number;
  raw_data?: Record<string, unknown>;
};

export type SaveScoreResponse = {
  success: boolean;
  id?: string;
  error?: string;
};

export type GetScoresResponse = {
  scores: ScoreRow[];
  error?: string;
};

export type GetCaptchaResponse = {
  sessionKey: string;
  imageBase64: string;
  error?: string;
};

export type VerifyCaptchaRequest = {
  sessionKey: string;
  answer: string;
};

export type VerifyCaptchaResponse = {
  correct: boolean;
  error?: string;
};
