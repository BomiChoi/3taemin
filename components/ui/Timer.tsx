"use client";

import { cn } from "@/lib/utils";

type TimerProps = {
  remainingMs: number;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeStyles = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
};

export function Timer({ remainingMs, className, size = "md" }: TimerProps) {
  const isUrgent = remainingMs <= 3000 && remainingMs > 0;
  const isDone = remainingMs <= 0;

  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.max(0, remainingMs % 1000);

  const display =
    minutes > 0
      ? `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${String(seconds).padStart(2, "0")}.${String(Math.floor(ms / 10)).padStart(2, "0")}`;

  return (
    <div
      className={cn(
        "font-mono font-bold tabular-nums transition-colors",
        sizeStyles[size],
        isDone && "text-blue-700",
        isUrgent && !isDone && "text-red-500 animate-pulse",
        !isUrgent && !isDone && "text-gray-900",
        className
      )}
    >
      {display}
    </div>
  );
}
