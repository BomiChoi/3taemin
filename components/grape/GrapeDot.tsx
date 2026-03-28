"use client";

import { cn } from "@/lib/utils";
import type { GrapeDot as GrapeDotType } from "@/types/game";

type GrapeDotProps = {
  dot: GrapeDotType;
  revealed: boolean;
  onClick: (dot: GrapeDotType) => void;
  size: number;
};

const stateStyles = {
  sold:      "bg-gray-200 cursor-not-allowed",
  available: "bg-green-400 hover:bg-green-500 cursor-pointer shadow-sm",
  target:    "bg-orange-400 hover:bg-orange-500 cursor-pointer shadow-sm ring-2 ring-orange-300",
};

const revealedStyles = {
  sold:      "bg-gray-200",
  available: "bg-green-400",
  target:    "bg-orange-500 ring-2 ring-orange-300 scale-110",
};

export function GrapeDot({ dot, revealed, onClick, size }: GrapeDotProps) {
  const isClickable = dot.state !== "sold" && !revealed;

  return (
    <button
      onClick={() => isClickable && onClick(dot)}
      className={cn(
        "rounded-full transition-transform duration-100 active:scale-90",
        revealed ? revealedStyles[dot.state] : stateStyles[dot.state]
      )}
      style={{ width: size, height: size }}
      tabIndex={-1}
    />
  );
}
