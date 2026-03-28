import type { GrapeDot } from "@/types/game";

const COLS = 10;
const ROWS = 10;
const SOLD_RATIO = 0.75;

export function generateGrapeGrid(): GrapeDot[] {
  const total = COLS * ROWS;
  const dots: GrapeDot[] = [];

  const soldSet = new Set<number>();
  while (soldSet.size < Math.floor(total * SOLD_RATIO)) {
    soldSet.add(Math.floor(Math.random() * total));
  }

  const availableIndices: number[] = [];
  for (let i = 0; i < total; i++) {
    if (!soldSet.has(i)) availableIndices.push(i);
  }

  const targetIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];

  for (let i = 0; i < total; i++) {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    let state: GrapeDot["state"];
    if (i === targetIndex) state = "target";
    else if (soldSet.has(i)) state = "sold";
    else state = "available";

    dots.push({ id: i, row, col, state });
  }

  return dots;
}

export function getGridCols() {
  return COLS;
}
