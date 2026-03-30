import type { TimingGrade, GrapeDifficulty } from "@/types/game";

export function calcTimingScore(offsetMs: number): { score: number; grade: TimingGrade } {
  const score = Math.max(0, 1000 - offsetMs);
  let grade: TimingGrade;
  if (offsetMs <= 10) grade = "Perfect";
  else if (offsetMs <= 50) grade = "Excellent";
  else if (offsetMs <= 200) grade = "Good";
  else grade = "Late";
  return { score, grade };
}

export function calcCaptchaScore(timeMs: number, attempts: number): number {
  const timePenalty = Math.floor(timeMs / 10);
  const retryPenalty = (attempts - 1) * 200;
  return Math.max(0, 1000 - timePenalty - retryPenalty);
}

export function calcGrapeScore(timeMs: number, difficulty: GrapeDifficulty): number {
  const multipliers: Record<GrapeDifficulty, number> = { easy: 1, normal: 1.5, hard: 2 };
  const base = Math.max(0, Math.round((3000 - timeMs) / 3));
  return Math.min(1000, Math.floor(base * multipliers[difficulty]));
}
