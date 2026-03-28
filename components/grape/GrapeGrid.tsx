"use client";

import { GrapeDot as GrapeDotComponent } from "./GrapeDot";
import type { GrapeDot, GrapeDifficulty } from "@/types/game";
import { getGridDimensions } from "@/lib/utils/grape";

type GrapeGridProps = {
  dots: GrapeDot[];
  difficulty: GrapeDifficulty;
  revealed: boolean;
  onClickDot: (dot: GrapeDot) => void;
};

const dotSizes: Record<GrapeDifficulty, number> = {
  easy:   22,
  normal: 18,
  hard:   14,
};

export function GrapeGrid({ dots, difficulty, revealed, onClickDot }: GrapeGridProps) {
  const { cols } = getGridDimensions(difficulty);
  const dotSize = dotSizes[difficulty];
  const gap = 3;

  return (
    <div
      className="overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-3 select-none"
      style={{ maxWidth: "100%" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
          gap: `${gap}px`,
        }}
      >
        {dots.map((dot) => (
          <GrapeDotComponent
            key={dot.id}
            dot={dot}
            revealed={revealed}
            onClick={onClickDot}
            size={dotSize}
          />
        ))}
      </div>
    </div>
  );
}
