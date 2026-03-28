-- ============================
-- 삼태민(3taemin) 티켓팅 연습 사이트
-- Supabase Schema
-- ============================

-- 1. scores 테이블 (통합 점수)
CREATE TABLE IF NOT EXISTS scores (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname   TEXT NOT NULL,
  mode       TEXT NOT NULL CHECK (mode IN ('timing', 'captcha', 'grape')),
  score      INTEGER NOT NULL,
  raw_data   JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- raw_data 구조 예시:
-- timing:  { "offset_ms": 47, "target_time": "14:00:00", "grade": "Perfect" }
-- captcha: { "accuracy": true, "time_ms": 3200, "attempts": 1 }
-- grape:   { "time_ms": 1850, "correct": true, "difficulty": "normal" }

CREATE INDEX IF NOT EXISTS idx_scores_mode_score ON scores (mode, score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_created_at ON scores (created_at DESC);

-- 2. captcha_sessions 테이블 (CAPTCHA 세션 관리)
CREATE TABLE IF NOT EXISTS captcha_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key TEXT NOT NULL UNIQUE,
  answer      TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_captcha_session_key ON captcha_sessions (session_key);

-- ============================
-- Row Level Security (RLS)
-- ============================

-- scores: 누구나 읽기/삽입 가능, 수정/삭제 불가
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read scores"
  ON scores FOR SELECT USING (true);

CREATE POLICY "Anyone can insert scores"
  ON scores FOR INSERT WITH CHECK (true);

-- captcha_sessions: 서비스 롤만 접근 (RLS로 일반 접근 차단)
ALTER TABLE captcha_sessions ENABLE ROW LEVEL SECURITY;

-- ============================
-- 만료된 captcha_sessions 정리 함수
-- ============================
CREATE OR REPLACE FUNCTION delete_expired_captcha_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM captcha_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
