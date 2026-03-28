# 티켓팅 연습 사이트 기획

## 개요

실제 티켓팅에서 필요한 3가지 동작을 반복 연습할 수 있는 사이트.

- **기술 스택**: Next.js (App Router), Supabase, Vercel
- **언어**: TypeScript, Tailwind CSS

---

## 3가지 연습 모드

### 1. 정각 클릭 (`/timing`)
정각에 예매 버튼을 클릭하는 연습.

- 목표 시각까지 카운트다운 표시 (현재 시각 기준 10~60초 후 자동 설정)
- 정각이 되면 "예매하기" 버튼 활성화
- 클릭 즉시 정각으로부터의 offset을 ms 단위로 측정

**점수 계산**
```
offset_ms = |클릭 시각 - 목표 시각|
score = max(0, 1000 - offset_ms)
```

| 등급 | 범위 |
|---|---|
| Perfect | 0 ~ 10ms |
| Excellent | 11 ~ 50ms |
| Good | 51 ~ 200ms |
| Late | 201ms 이상 |

---

### 2. 보안문자 입력 (`/captcha`)
왜곡된 텍스트 이미지를 보고 문자를 입력하는 연습.

- 서버에서 5~6자리 영숫자 CAPTCHA 이미지 생성 (혼동 문자 제외: 0, O, 1, l, I)
- 노이즈, 기울기, 방해선 추가
- 정확도 및 입력 시간 측정

**점수 계산**
```
score = max(0, 1000 - (time_ms / 10) - ((attempts - 1) * 200))
```

---

### 3. 포도알 클릭 (`/grape`)
인터파크 방식의 좌석 선택 미니게임.

- N×M 그리드에 원형 도트(포도알) 배치
- 70~80%는 매진(회색), 나머지는 선택 가능(초록)
- 그 중 타겟 1개를 찾아 클릭
- 난이도에 따라 그리드 크기 및 타겟 식별 난이도 조절

**점수 계산**
```
score = max(0, 3000 - time_ms) × 난이도 배수
난이도 배수: Easy(1x), Normal(1.5x), Hard(2x)
오답 시 -500점
```

---

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # 홈 - 모드 선택
│   ├── (practice)/
│   │   ├── layout.tsx
│   │   ├── timing/page.tsx
│   │   ├── captcha/page.tsx
│   │   └── grape/page.tsx
│   ├── ranking/page.tsx            # 리더보드
│   └── api/
│       ├── scores/route.ts         # GET 랭킹 조회 / POST 점수 저장
│       └── captcha/route.ts        # GET CAPTCHA 이미지 발급
├── components/
│   ├── ui/                         # Button, Card, Modal, Timer
│   ├── timing/                     # CountdownDisplay, ReservationButton, TimingResult
│   ├── captcha/                    # CaptchaImage, CaptchaInput, CaptchaResult
│   ├── grape/                      # GrapeGrid, GrapeDot, GrapeResult
│   ├── ranking/                    # LeaderBoard, ModeFilter
│   └── shared/                     # ScoreSaveForm, ResultCard
├── hooks/
│   ├── useCountdown.ts
│   ├── useTiming.ts
│   ├── useCaptcha.ts
│   └── useGrape.ts
└── lib/
    ├── supabase/
    │   ├── client.ts
    │   └── server.ts
    ├── captcha/generator.ts
    └── utils/
        ├── score.ts
        ├── time.ts
        └── grape.ts
```

---

## Supabase 스키마

### scores
```sql
CREATE TABLE scores (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname   TEXT NOT NULL,
  mode       TEXT NOT NULL CHECK (mode IN ('timing', 'captcha', 'grape')),
  score      INTEGER NOT NULL,
  raw_data   JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

`raw_data` 예시:
- timing: `{ "offset_ms": 47, "target_time": "14:00:00" }`
- captcha: `{ "accuracy": true, "time_ms": 3200, "attempts": 1 }`
- grape: `{ "time_ms": 1850, "correct": true, "grid_size": 10 }`

### captcha_sessions
```sql
CREATE TABLE captcha_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key TEXT NOT NULL UNIQUE,
  answer      TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS 정책
- `scores`: 누구나 읽기/삽입 가능, 수정/삭제 불가
- `captcha_sessions`: 서비스 롤만 접근

---

## 주요 기술 결정

| 항목 | 결정 | 이유 |
|---|---|---|
| 카운트다운 | `requestAnimationFrame` | `setInterval`은 탭 비활성 시 throttle되어 정밀도 저하 |
| CAPTCHA 생성 | 서버사이드 (`@napi-rs/canvas`) | 클라이언트에서 생성 시 정답 노출 |
| 점수 저장 | API Route 경유 | ANON KEY 직접 노출 방지, 서버 유효성 검증 |
| 랭킹 페이지 | Server Component + `revalidate: 60` | 캐싱으로 불필요한 DB 조회 최소화 |

---

## 주요 패키지

```
@supabase/supabase-js
@supabase/ssr
@napi-rs/canvas       # 서버사이드 CAPTCHA 이미지 생성
lucide-react          # 아이콘
clsx
tailwind-merge
```

---

## 환경변수

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # 서버 전용
```

---

## 구현 순서

| Phase | 내용 |
|---|---|
| 1 | 프로젝트 초기 설정 (create-next-app, Supabase 연동, 테이블 생성) |
| 2 | 공통 컴포넌트 (Button, Modal, Timer, ResultCard) + 홈 페이지 |
| 3 | 정각 클릭 기능 |
| 4 | 보안문자 기능 |
| 5 | 포도알 클릭 기능 |
| 6 | 랭킹 시스템 |
| 7 | 반응형 점검 및 Vercel 배포 |
