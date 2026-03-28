"use client";

import { GrapeDot as GrapeDotComponent } from "./GrapeDot";
import type { GrapeDot } from "@/types/game";
import { getGridCols } from "@/lib/utils/grape";

type GrapeGridProps = {
  dots: GrapeDot[];
  revealed: boolean;
  onClickDot: (dot: GrapeDot) => void;
};

const DOT_SIZE = 20;
const GAP = 3;

export function GrapeGrid({ dots, revealed, onClickDot }: GrapeGridProps) {
  const cols = getGridCols();

  return (
    <div
      className="overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-3 select-none"
      style={{ maxWidth: "100%" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${DOT_SIZE}px)`,
          gap: `${GAP}px`,
        }}
      >
        {dots.map((dot) => (
          <GrapeDotComponent
            key={dot.id}
            dot={dot}
            revealed={revealed}
            onClick={onClickDot}
            size={DOT_SIZE}
          />
        ))}
      </div>
    </div>
  );
}
