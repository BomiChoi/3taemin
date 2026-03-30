"use client";

import { useState, useCallback, useRef } from "react";
import { generateGrapeGrid } from "@/lib/utils/grape";
import type { GrapeDot, GrapeResult, TimingGrade } from "@/types/game";

function calcGrapeGrade(timeMs: number): TimingGrade {
  if (timeMs <= 800) return "Perfect";
  if (timeMs <= 1000) return "Excellent";
  if (timeMs <= 1200) return "Good";
  return "Late";
}

type UseGrapeReturn = {
  dots: GrapeDot[];
  result: GrapeResult | null;
  start: () => void;
  clickDot: (dot: GrapeDot) => void;
  reset: () => void;
};

export function useGrape(): UseGrapeReturn {
  const [dots, setDots] = useState<GrapeDot[]>([]);
  const [result, setResult] = useState<GrapeResult | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    setDots(generateGrapeGrid());
    setResult(null);
    startTimeRef.current = Date.now();
  }, []);

  const clickDot = useCallback((dot: GrapeDot) => {
    if (result) return;
    const timeMs = Date.now() - startTimeRef.current;
    const correct = dot.state === "target";
    const score = correct ? Math.max(0, Math.round((3000 - timeMs) / 3)) : 0;
    const grade = calcGrapeGrade(timeMs);
    setResult({ correct, timeMs, score, grade, difficulty: "normal" });
  }, [result]);

  const reset = useCallback(() => {
    setDots([]);
    setResult(null);
  }, []);

  return { dots, result, start, clickDot, reset };
}
