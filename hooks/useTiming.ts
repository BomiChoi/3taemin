"use client";

import { useState, useCallback } from "react";
import { calcTimingScore } from "@/lib/utils/score";
import type { TimingResult } from "@/types/game";

type UseTimingReturn = {
  result: TimingResult | null;
  click: (targetTime: number) => TimingResult;
  reset: () => void;
};

export function useTiming(): UseTimingReturn {
  const [result, setResult] = useState<TimingResult | null>(null);

  const click = useCallback((targetTime: number): TimingResult => {
    const clickedAt = Date.now();
    const offsetMs = Math.abs(clickedAt - targetTime);
    const { score, grade } = calcTimingScore(offsetMs);
    const r: TimingResult = { offsetMs, score, grade, clickedAt };
    setResult(r);
    return r;
  }, []);

  const reset = useCallback(() => setResult(null), []);

  return { result, click, reset };
}
