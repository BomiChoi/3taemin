"use client";

import { useState, useEffect, useCallback } from "react";
import { useGrape } from "@/hooks/useGrape";
import { GrapeGrid } from "@/components/grape/GrapeGrid";
import { Modal } from "@/components/ui/Modal";
import { ResultCard } from "@/components/shared/ResultCard";
import { ScoreSaveForm } from "@/components/shared/ScoreSaveForm";

export default function GrapePage() {
  const { dots, result, start, clickDot, reset } = useGrape();
  const [modalOpen, setModalOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (result) {
      setRevealed(true);
      setTimeout(() => setModalOpen(true), 400);
    }
  }, [result]);

  const handleStart = useCallback(() => {
    setStarted(true);
    setRevealed(false);
    setSaved(false);
    start();
  }, [start]);

  const handleRetry = useCallback(() => {
    setModalOpen(false);
    setStarted(false);
    setRevealed(false);
    setSaved(false);
    reset();
  }, [reset]);

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">포도알 클릭 연습</h1>
        <p className="text-sm text-gray-500 mt-1">
          <span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-1 align-middle" />
          보라색 포도알을 빠르게 찾아 클릭하세요
        </p>
      </div>

      {/* Legend */}
      {started && (
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" /> 매진
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-400 inline-block" /> 선택 가능
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> 목표
          </span>
        </div>
      )}

      {/* Grid */}
      {started && dots.length > 0 && (
        <GrapeGrid
          dots={dots}
          revealed={revealed}
          onClickDot={clickDot}
        />
      )}

      {/* Start Button */}
      {!started && (
        <button
          onClick={handleStart}
          className="w-full max-w-xs h-12 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
        >
          연습 시작
        </button>
      )}

      {/* Result Modal */}
      <Modal open={modalOpen} onClose={handleRetry} title="결과">
        {result && (
          <div className="flex flex-col gap-6">
            <ResultCard
              title={result.correct ? "성공!" : "실패"}
              score={result.score}
              grade={result.correct ? result.grade : undefined}
              items={[
                { label: "소요 시간", value: `${(result.timeMs / 1000).toFixed(2)}초`, highlight: true },
                ...(result.correct ? [{ label: "등급", value: result.grade }] : []),
              ]}
            />
            {result.correct && !saved && (
              <ScoreSaveForm
                mode="grape"
                score={result.score}
                rawData={{ time_ms: result.timeMs, correct: result.correct }}
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
