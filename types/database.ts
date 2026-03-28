export type ScoreMode = "timing" | "captcha" | "grape";

export type ScoreRow = {
  id: string;
  nickname: string;
  mode: ScoreMode;
  score: number;
  raw_data: TimingRawData | CaptchaRawData | GrapeRawData | null;
  created_at: string;
};

export type TimingRawData = {
  offset_ms: number;
  target_time: string;
  grade: "Perfect" | "Excellent" | "Good" | "Late";
};

export type CaptchaRawData = {
  accuracy: boolean;
  time_ms: number;
  attempts: number;
};

export type GrapeRawData = {
  time_ms: number;
  correct: boolean;
  difficulty: "easy" | "normal" | "hard";
};

export type CaptchaSessionRow = {
  id: string;
  session_key: string;
  answer: string;
  expires_at: string;
  used: boolean;
  created_at: string;
};
