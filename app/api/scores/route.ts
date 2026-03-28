import { createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { SaveScoreRequest } from "@/types/api";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const mode = searchParams.get("mode");
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);

  const supabase = createServiceClient();

  let query = supabase
    .from("scores")
    .select("id, nickname, mode, score, raw_data, created_at")
    .order("score", { ascending: false })
    .limit(limit);

  if (mode && ["timing", "captcha", "grape"].includes(mode)) {
    query = query.eq("mode", mode);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ scores: data });
}

export async function POST(req: NextRequest) {
  const body: SaveScoreRequest = await req.json();
  const { nickname, mode, score, raw_data } = body;

  if (!nickname?.trim() || !mode || score == null) {
    return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
  }

  if (!["timing", "captcha", "grape"].includes(mode)) {
    return NextResponse.json({ error: "유효하지 않은 모드" }, { status: 400 });
  }

  if (score < 0 || score > 6000) {
    return NextResponse.json({ error: "유효하지 않은 점수" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("scores")
    .insert({ nickname: nickname.trim(), mode, score, raw_data })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id });
}
