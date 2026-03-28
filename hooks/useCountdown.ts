"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type UseCountdownReturn = {
  remainingMs: number;
  isReady: boolean;
  targetTime: number;
  reset: (seconds: number) => void;
};

export function useCountdown(initialSeconds = 10): UseCountdownReturn {
  const [targetTime, setTargetTime] = useState(() => Date.now() + initialSeconds * 1000);
  const [remainingMs, setRemainingMs] = useState(initialSeconds * 1000);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      const remaining = targetTime - Date.now();
      if (remaining <= 0) {
        setRemainingMs(0);
        return;
      }
      setRemainingMs(remaining);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [targetTime]);

  const reset = useCallback((seconds: number) => {
    setTargetTime(Date.now() + seconds * 1000);
    setRemainingMs(seconds * 1000);
  }, []);

  return { remainingMs, isReady: remainingMs <= 0, targetTime, reset };
}
