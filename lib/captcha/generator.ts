// 혼동 문자 제외: 0, O, 1, I, l
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCaptchaText(length = 5): string {
  return Array.from({ length }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
}

export function generateCaptchaImage(text: string): string {
  const width = 200;
  const height = 70;
  const charWidth = width / (text.length + 1);

  // 노이즈 점
  const dots = Array.from({ length: 200 }, () =>
    `<circle cx="${rand(0, width)}" cy="${rand(0, height)}" r="${rand(1, 2)}" fill="rgba(${rand(100, 200)},${rand(100, 200)},${rand(100, 200)},0.4)"/>`
  ).join("");

  // 방해선 (베지어 곡선)
  const lines = Array.from({ length: 4 }, () => {
    const x1 = rand(0, width / 3), y1 = rand(0, height);
    const x2 = rand(width / 4, width / 2), y2 = rand(0, height);
    const x3 = rand(width / 2, (3 * width) / 4), y3 = rand(0, height);
    const x4 = rand((2 * width) / 3, width), y4 = rand(0, height);
    const color = `rgba(${rand(80, 160)},${rand(80, 160)},${rand(80, 160)},0.5)`;
    return `<path d="M${x1},${y1} C${x2},${y2} ${x3},${y3} ${x4},${y4}" stroke="${color}" stroke-width="${rand(1, 2)}" fill="none"/>`;
  }).join("");

  // 각 문자 (rotate + translate로 왜곡)
  const chars = text.split("").map((char, i) => {
    const x = Math.round(charWidth * (i + 0.8) + rand(-4, 4));
    const y = Math.round(height / 2 + rand(-6, 6));
    const angle = rand(-25, 25);
    const fontSize = rand(28, 36);
    const color = `rgb(${rand(20, 80)},${rand(20, 80)},${rand(20, 80)})`;
    return `<text x="${x}" y="${y}" transform="rotate(${angle},${x},${y})" font-family="'Courier New',Courier,monospace" font-size="${fontSize}" font-weight="bold" fill="${color}" text-anchor="middle" dominant-baseline="middle">${char}</text>`;
  }).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="#f8f9fa"/>${dots}${lines}${chars}</svg>`;

  return Buffer.from(svg).toString("base64");
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
