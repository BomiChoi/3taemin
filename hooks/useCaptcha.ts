"use client";

import { useState, useCallback, useRef } from "react";
import { calcCaptchaScore } from "@/lib/utils/score";
import type { CaptchaResult, TimingGrade } from "@/types/game";

function calcCaptchaGrade(timeMs: number, attempts: number): TimingGrade {
  if (attempts === 1 && timeMs <= 4000) return "Perfect";
  if (attempts === 1 && timeMs <= 5000) return "Excellent";
  if (attempts <= 2 && timeMs <= 6000) return "Good";
  return "Late";
}

type CaptchaState = {
  sessionKey: string;
  imageBase64: string;
} | null;

type UseCaptchaReturn = {
  captcha: CaptchaState;
  result: CaptchaResult | null;
  attempts: number;
  loading: boolean;
  fetchCaptcha: () => Promise<void>;
  submit: (answer: string) => Promise<boolean>;
  reset: () => void;
};

export function useCaptcha(): UseCaptchaReturn {
  const [captcha, setCaptcha] = useState<CaptchaState>(null);
  const [result, setResult] = useState<CaptchaResult | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const startTimeRef = useRef<number>(0);

  const fetchCaptcha = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/captcha");
      const data = await res.json();
      setCaptcha({ sessionKey: data.sessionKey, imageBase64: data.imageBase64 });
      if (startTimeRef.current === 0) {
        startTimeRef.current = Date.now();
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const submit = useCallback(async (answer: string): Promise<boolean> => {
    if (!captcha) return false;

    const currentAttempt = attempts + 1;
    setAttempts(currentAttempt);

    const res = await fetch("/api/captcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionKey: captcha.sessionKey, answer }),
    });
    const data = await res.json();

    if (data.correct) {
      const timeMs = Date.now() - startTimeRef.current;
      const score = calcCaptchaScore(timeMs, currentAttempt);
      const grade = calcCaptchaGrade(timeMs, currentAttempt);
      setResult({ correct: true, timeMs, attempts: currentAttempt, score, grade });
    }

    return data.correct;
  }, [captcha, attempts]);

  const reset = useCallback(() => {
    setCaptcha(null);
    setResult(null);
    setAttempts(0);
    startTimeRef.current = 0;
  }, []);

  return { captcha, result, attempts, loading, fetchCaptcha, submit, reset };
}
