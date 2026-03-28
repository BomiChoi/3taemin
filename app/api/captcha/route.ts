export const runtime = "nodejs";

import { createServiceClient } from "@/lib/supabase/server";
import { generateCaptchaText, generateCaptchaImage } from "@/lib/captcha/generator";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type { VerifyCaptchaRequest } from "@/types/api";

// GET /api/captcha — 새 CAPTCHA 발급
export async function GET() {
  const text = generateCaptchaText(5);
  const imageBase64 = generateCaptchaImage(text);
  const sessionKey = randomUUID();

  const supabase = createServiceClient();
  const { error } = await supabase.from("captcha_sessions").insert({
    session_key: sessionKey,
    answer: text.toLowerCase(),
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5분
  });

  if (error) {
    return NextResponse.json({ error: "CAPTCHA 생성 실패" }, { status: 500 });
  }

  return NextResponse.json({ sessionKey, imageBase64 });
}

// POST /api/captcha — 정답 검증
export async function POST(req: NextRequest) {
  const body: VerifyCaptchaRequest = await req.json();
  const { sessionKey, answer } = body;

  if (!sessionKey || !answer) {
    return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("captcha_sessions")
    .select("answer, expires_at, used")
    .eq("session_key", sessionKey)
    .single();

  if (error || !data) {
    return NextResponse.json({ correct: false, error: "유효하지 않은 세션" }, { status: 400 });
  }

  if (data.used) {
    return NextResponse.json({ correct: false, error: "이미 사용된 세션" }, { status: 400 });
  }

  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ correct: false, error: "만료된 세션" }, { status: 400 });
  }

  const correct = data.answer === answer.toLowerCase().trim();

  // 세션 사용 처리
  await supabase
    .from("captcha_sessions")
    .update({ used: true })
    .eq("session_key", sessionKey);

  return NextResponse.json({ correct });
}
