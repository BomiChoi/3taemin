"use client";

import { useState, useCallback, useRef } from "react";
import { generateGrapeGrid } from "@/lib/utils/grape";
import type { GrapeDot, GrapeResult } from "@/types/game";

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
    const score = correct ? Math.max(0, 3000 - timeMs) : 0;
    setResult({ correct, timeMs, score, difficulty: "normal" });
  }, [result]);

  const reset = useCallback(() => {
    setDots([]);
    setResult(null);
  }, []);

  return { dots, result, start, clickDot, reset };
}
