"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useCaptcha } from "@/hooks/useCaptcha";
import { Modal } from "@/components/ui/Modal";
import { ResultCard } from "@/components/shared/ResultCard";
import { ScoreSaveForm } from "@/components/shared/ScoreSaveForm";
import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CaptchaPage() {
  const { captcha, result, attempts, loading, fetchCaptcha, submit, reset } = useCaptcha();
  const [answer, setAnswer] = useState("");
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (captcha) inputRef.current?.focus();
  }, [captcha]);

  useEffect(() => {
    if (result) setModalOpen(true);
  }, [result]);

  const handleSubmit = useCallback(async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    const correct = await submit(answer);
    setSubmitting(false);
    if (!correct) {
      setShake(true);
      setAnswer("");
      setTimeout(() => setShake(false), 500);
      // 오답 시 새 CAPTCHA 발급
      await fetchCaptcha();
    }
  }, [answer, submit, fetchCaptcha]);

  const handleRetry = useCallback(() => {
    setModalOpen(false);
    setAnswer("");
    setSaved(false);
    reset();
  }, [reset]);

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-8">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">보안문자 연습</h1>
        <p className="text-sm text-gray-500 mt-1">이미지의 문자를 정확하고 빠르게 입력하세요</p>
      </div>

      {!captcha ? (
        <Button size="xl" onClick={fetchCaptcha} loading={loading} className="w-full">
          연습 시작
        </Button>
      ) : (
        <div className="w-full flex flex-col gap-5">
          {/* CAPTCHA Image */}
          <div className={cn(
            "relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50",
            shake && "animate-[shake_0.4s_ease-in-out]"
          )}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/svg+xml;base64,${captcha.imageBase64}`}
              alt="보안문자"
              className="w-full h-auto"
              draggable={false}
            />
            <button
              onClick={fetchCaptcha}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-white/80 hover:bg-white text-gray-500 hover:text-teal-600 transition-colors"
              title="새로고침"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {attempts > 0 && !result && !submitting && (
            <p className="text-xs text-center text-red-500">
              오답! 새 보안문자가 발급됐어요 (시도: {attempts}회)
            </p>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="보안문자 입력"
              maxLength={6}
              className="flex-1 h-12 px-4 text-lg text-gray-900 font-mono tracking-widest border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase"
              autoComplete="off"
            />
            <Button size="lg" onClick={handleSubmit} disabled={!answer.trim()}>
              확인
            </Button>
          </div>
        </div>
      )}

      {/* Result Modal */}
      <Modal open={modalOpen} onClose={handleRetry} title="결과">
        {result && (
          <div className="flex flex-col gap-6">
            <ResultCard
              title="보안문자 결과"
              score={result.score}
              grade={result.grade}
              items={[
                { label: "소요 시간", value: `${(result.timeMs / 1000).toFixed(2)}초`, highlight: true },
                { label: "시도 횟수", value: `${result.attempts}회` },
                { label: "등급", value: result.grade },
              ]}
            />
            {!saved && (
              <ScoreSaveForm
                mode="captcha"
                score={result.score}
                rawData={{ time_ms: result.timeMs, attempts: result.attempts, accuracy: true }}
                onSaved={() => setSaved(true)}
              />
            )}
            <button
              onClick={handleRetry}
              className="w-full h-10 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              다시 연습하기
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
