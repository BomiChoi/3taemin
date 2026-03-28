"use client";

import { Button } from "@/components/ui/Button";
import type { ScoreMode } from "@/types/database";
import { useState } from "react";

type ScoreSaveFormProps = {
  mode: ScoreMode;
  score: number;
  rawData?: Record<string, unknown>;
  onSaved?: () => void;
};

export function ScoreSaveForm({ mode, score, rawData, onSaved }: ScoreSaveFormProps) {
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSave() {
    if (!nickname.trim()) return;
    setStatus("loading");

    const res = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname: nickname.trim(), mode, score, raw_data: rawData }),
    });

    if (res.ok) {
      setStatus("done");
      onSaved?.();
    } else {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-center text-sm text-green-600 font-medium">
        점수가 저장됐어요!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700">
        닉네임을 입력하고 점수를 저장하세요
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder="닉네임 (최대 10자)"
          maxLength={10}
          className="flex-1 h-10 px-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <Button
          size="md"
          loading={status === "loading"}
          disabled={!nickname.trim()}
          onClick={handleSave}
        >
          저장
        </Button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-500">저장에 실패했어요. 다시 시도해주세요.</p>
      )}
    </div>
  );
}
