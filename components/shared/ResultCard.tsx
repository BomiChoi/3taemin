import { cn } from "@/lib/utils";
import type { TimingGrade } from "@/types/game";

type GradeConfig = {
  label: string;
  color: string;
  bg: string;
};

const gradeConfigs: Record<TimingGrade, GradeConfig> = {
  Perfect: { label: "PERFECT", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
  Excellent: { label: "EXCELLENT", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  Good: { label: "GOOD", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  Late: { label: "LATE", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
};

type ResultItem = {
  label: string;
  value: string | number;
  highlight?: boolean;
};

type ResultCardProps = {
  title: string;
  score: number;
  grade?: TimingGrade;
  items?: ResultItem[];
  className?: string;
};

export function ResultCard({ title, score, grade, items, className }: ResultCardProps) {
  const gradeConfig = grade ? gradeConfigs[grade] : null;

  return (
    <div className={cn("flex flex-col items-center gap-4 text-center", className)}>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>

      {gradeConfig && (
        <div className={cn("px-4 py-1.5 rounded-full border text-sm font-bold", gradeConfig.color, gradeConfig.bg)}>
          {gradeConfig.label}
        </div>
      )}

      <div className="flex flex-col items-center gap-1">
        <span className="text-5xl font-bold text-teal-700 tabular-nums">
          {score.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500">점</span>
      </div>

      {items && items.length > 0 && (
        <div className="w-full flex flex-col gap-2 pt-2 border-t border-gray-100">
          {items.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-gray-500">{item.label}</span>
              <span className={cn("font-medium", item.highlight ? "text-teal-700" : "text-gray-900")}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
