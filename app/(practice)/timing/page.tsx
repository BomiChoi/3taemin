"use client";

import { useState, useCallback } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { useTiming } from "@/hooks/useTiming";
import { Timer } from "@/components/ui/Timer";
import { Modal } from "@/components/ui/Modal";
import { ResultCard } from "@/components/shared/ResultCard";
import { ScoreSaveForm } from "@/components/shared/ScoreSaveForm";
import { cn } from "@/lib/utils";
import type { TimingResult } from "@/types/game";

const COUNTDOWN_SECONDS = 10;

const gradeMessages: Record<string, string> = {
  Perfect: "완벽해요! 티켓 잡을 준비 됐네요 🎫",
  Excellent: "아주 빠릅니다! 조금만 더 연습하면 완벽해요",
  Good: "괜찮아요! 꾸준히 연습하면 늘 거예요",
  Late: "아쉽네요. 정각을 잘 노려보세요!",
};

export default function TimingPage() {
  const [started, setStarted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [lastResult, setLastResult] = useState<TimingResult | null>(null);
  const [saved, setSaved] = useState(false);

  const { remainingMs, isReady, targetTime, reset: resetCountdown } = useCountdown(COUNTDOWN_SECONDS);
  const { result, click, reset: resetTiming } = useTiming();

  const handleStart = useCallback(() => {
    setStarted(true);
    setSaved(false);
    resetCountdown(COUNTDOWN_SECONDS);
    resetTiming();
  }, [resetCountdown, resetTiming]);

  const handleClick = useCallback(() => {
    if (!started || !isReady || result) return;
    const r = click(targetTime);
    setLastResult(r);
    setModalOpen(true);
  }, [started, isReady, result, click, targetTime]);

  const handleRetry = useCallback(() => {
    setModalOpen(false);
    setStarted(false);
    setLastResult(null);
    setSaved(false);
    resetTiming();
  }, [resetTiming]);

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-8">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">예매버튼 클릭 연습</h1>
        <p className="text-sm text-gray-500 mt-1">카운트다운이 0이 되는 순간 버튼을 클릭하세요.</p>
      </div>

      {/* Countdown */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          {!started ? "대기 중" : isReady ? "지금!" : "남은 시간"}
        </p>
        <Timer
          remainingMs={started ? remainingMs : COUNTDOWN_SECONDS * 1000}
          size="lg"
        />
      </div>

      {/* Reservation Button */}
      <button
        onClick={handleClick}
        disabled={!started || !isReady || !!result}
        className={cn(
          "w-full h-16 rounded-xl text-lg font-bold transition-all duration-150 select-none",
          !started || !isReady
            ? "bg-gray-200 text-gray-400"
            : result
            ? "bg-gray-300 text-gray-500"
            : "bg-teal-600 text-white hover:bg-teal-800 active:scale-95 shadow-lg shadow-teal-200 cursor-pointer"
        )}
      >
        {!started ? "대기 중" : isReady && !result ? "예매하기" : isReady ? "완료" : "예매하기"}
      </button>

      {/* Start / Retry Button */}
      {!started && (
        <button
          onClick={handleStart}
          className="w-full h-12 rounded-xl border-2 border-teal-600 text-teal-600 font-semibold hover:bg-teal-50 transition-colors cursor-pointer"
        >
          연습 시작
        </button>
      )}

      {/* Result Modal */}
      <Modal open={modalOpen} onClose={handleRetry} title="결과">
        {lastResult && (
          <div className="flex flex-col gap-6">
            <ResultCard
              title="클릭 결과"
              score={lastResult.score}
              grade={lastResult.grade}
              items={[
                { label: "반응 오차", value: `${lastResult.offsetMs}ms`, highlight: true },
                { label: "등급", value: lastResult.grade },
              ]}
            />
            <p className="text-sm text-center text-gray-500">
              {gradeMessages[lastResult.grade]}
            </p>
            {!saved && (
              <ScoreSaveForm
                mode="timing"
                score={lastResult.score}
                rawData={{ offset_ms: lastResult.offsetMs, grade: lastResult.grade }}
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
