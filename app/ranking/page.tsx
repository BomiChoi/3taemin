import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, Trophy } from "lucide-react";
import { LeaderBoard } from "@/components/ranking/LeaderBoard";
import { ModeFilter } from "@/components/ranking/ModeFilter";
import { createServiceClient } from "@/lib/supabase/server";
import type { ScoreRow } from "@/types/database";

export const revalidate = 60;

async function fetchScores(mode?: string): Promise<ScoreRow[]> {
  const supabase = createServiceClient();
  let query = supabase
    .from("scores")
    .select("id, nickname, mode, score, raw_data, created_at")
    .order("score", { ascending: false })
    .limit(50);

  if (mode && ["timing", "captcha", "grape"].includes(mode)) {
    query = query.eq("mode", mode);
  }

  const { data } = await query;
  return (data as ScoreRow[]) ?? [];
}

type PageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function RankingPage({ searchParams }: PageProps) {
  const { mode } = await searchParams;
  const scores = await fetchScores(mode);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            홈
          </Link>
          <span className="text-gray-200">|</span>
          <span className="text-sm font-bold text-blue-700">삼태민</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900">랭킹</h1>
        </div>

        {/* Mode Filter */}
        <Suspense>
          <ModeFilter />
        </Suspense>

        {/* Leaderboard */}
        <LeaderBoard scores={scores} />
      </main>
    </div>
  );
}
