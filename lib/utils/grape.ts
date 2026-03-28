import type { GrapeDot, GrapeDifficulty } from "@/types/game";

type GridConfig = {
  cols: number;
  rows: number;
  soldRatio: number; // 매진 비율
};

const DIFFICULTY_CONFIG: Record<GrapeDifficulty, GridConfig> = {
  easy:   { cols: 10, rows: 7,  soldRatio: 0.72 },
  normal: { cols: 14, rows: 9,  soldRatio: 0.76 },
  hard:   { cols: 18, rows: 11, soldRatio: 0.80 },
};

export function generateGrapeGrid(difficulty: GrapeDifficulty): GrapeDot[] {
  const { cols, rows, soldRatio } = DIFFICULTY_CONFIG[difficulty];
  const total = cols * rows;
  const dots: GrapeDot[] = [];

  // 매진 여부를 먼저 결정
  const soldSet = new Set<number>();
  while (soldSet.size < Math.floor(total * soldRatio)) {
    soldSet.add(Math.floor(Math.random() * total));
  }

  // 가용 인덱스 목록
  const availableIndices: number[] = [];
  for (let i = 0; i < total; i++) {
    if (!soldSet.has(i)) availableIndices.push(i);
  }

  // 타겟 1개 랜덤 선택
  const targetIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];

  for (let i = 0; i < total; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    let state: GrapeDot["state"];
    if (i === targetIndex) state = "target";
    else if (soldSet.has(i)) state = "sold";
    else state = "available";

    dots.push({ id: i, row, col, state });
  }

  return dots;
}

export function getGridDimensions(difficulty: GrapeDifficulty) {
  return DIFFICULTY_CONFIG[difficulty];
}
