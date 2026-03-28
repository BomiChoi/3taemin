import { cn } from "@/lib/utils";
import type { ScoreRow } from "@/types/database";

type LeaderBoardProps = {
  scores: ScoreRow[];
};

const modeLabels: Record<string, string> = {
  timing:  "정각 클릭",
  captcha: "보안문자",
  grape:   "포도알",
};

const rankStyles: Record<number, string> = {
  1: "text-yellow-500 font-black",
  2: "text-gray-400 font-black",
  3: "text-orange-400 font-black",
};

export function LeaderBoard({ scores }: LeaderBoardProps) {
  if (scores.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">🎫</p>
        <p className="text-sm">아직 기록이 없어요. 연습을 시작해보세요!</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <th className="px-4 py-3 text-center w-12">#</th>
            <th className="px-4 py-3 text-left">닉네임</th>
            <th className="px-4 py-3 text-center">모드</th>
            <th className="px-4 py-3 text-right">점수</th>
            <th className="px-4 py-3 text-right hidden sm:table-cell">날짜</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, idx) => (
            <tr
              key={score.id}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <td className={cn("px-4 py-3 text-center", rankStyles[idx + 1] ?? "text-gray-400 font-medium")}>
                {idx + 1}
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">{score.nickname}</td>
              <td className="px-4 py-3 text-center">
                <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-teal-50 text-teal-700 font-medium">
                  {modeLabels[score.mode] ?? score.mode}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-bold text-teal-700 tabular-nums">
                {score.score.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right text-gray-400 hidden sm:table-cell">
                {new Date(score.created_at).toLocaleDateString("ko-KR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
