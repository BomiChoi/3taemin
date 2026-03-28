"use client";

import { useState, useCallback, useRef } from "react";
import { generateGrapeGrid } from "@/lib/utils/grape";
import { calcGrapeScore } from "@/lib/utils/score";
import type { GrapeDot, GrapeDifficulty, GrapeResult } from "@/types/game";

type UseGrapeReturn = {
  dots: GrapeDot[];
  result: GrapeResult | null;
  difficulty: GrapeDifficulty;
  start: (difficulty: GrapeDifficulty) => void;
  clickDot: (dot: GrapeDot) => void;
  reset: () => void;
};

export function useGrape(): UseGrapeReturn {
  const [dots, setDots] = useState<GrapeDot[]>([]);
  const [result, setResult] = useState<GrapeResult | null>(null);
  const [difficulty, setDifficulty] = useState<GrapeDifficulty>("normal");
  const startTimeRef = useRef<number>(0);

  const start = useCallback((diff: GrapeDifficulty) => {
    setDifficulty(diff);
    setDots(generateGrapeGrid(diff));
    setResult(null);
    startTimeRef.current = Date.now();
  }, []);

  const clickDot = useCallback((dot: GrapeDot) => {
    if (result) return;
    const timeMs = Date.now() - startTimeRef.current;
    const correct = dot.state === "target";
    const score = correct ? calcGrapeScore(timeMs, difficulty) : 0;
    setResult({ correct, timeMs, score, difficulty });
  }, [result, difficulty]);

  const reset = useCallback(() => {
    setDots([]);
    setResult(null);
  }, []);

  return { dots, result, difficulty, start, clickDot, reset };
}
