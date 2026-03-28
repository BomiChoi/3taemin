export type TimingGrade = "Perfect" | "Excellent" | "Good" | "Late";

export type TimingResult = {
  offsetMs: number;
  score: number;
  grade: TimingGrade;
  clickedAt: number;
};

export type CaptchaResult = {
  correct: boolean;
  timeMs: number;
  attempts: number;
  score: number;
};

export type GrapeDifficulty = "easy" | "normal" | "hard";

export type GrapeDotState = "available" | "sold" | "target";

export type GrapeDot = {
  id: number;
  row: number;
  col: number;
  state: GrapeDotState;
};

export type GrapeResult = {
  correct: boolean;
  timeMs: number;
  score: number;
  grade: TimingGrade;
  difficulty: GrapeDifficulty;
};
