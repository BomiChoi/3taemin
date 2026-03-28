import { createCanvas } from "@napi-rs/canvas";

// 혼동 문자 제외: 0, O, 1, I, l
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCaptchaText(length = 5): string {
  return Array.from({ length }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
}

export function generateCaptchaImage(text: string): string {
  const width = 200;
  const height = 70;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // 배경
  ctx.fillStyle = "#f8f9fa";
  ctx.fillRect(0, 0, width, height);

  // 배경 노이즈 픽셀
  for (let i = 0; i < 300; i++) {
    ctx.fillStyle = `rgba(${rand(100, 200)},${rand(100, 200)},${rand(100, 200)},0.4)`;
    ctx.fillRect(rand(0, width), rand(0, height), 2, 2);
  }

  // 방해선
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `rgba(${rand(80, 160)},${rand(80, 160)},${rand(80, 160)},0.5)`;
    ctx.lineWidth = rand(1, 2);
    ctx.beginPath();
    ctx.moveTo(rand(0, width / 3), rand(0, height));
    ctx.bezierCurveTo(
      rand(width / 4, width / 2), rand(0, height),
      rand(width / 2, (3 * width) / 4), rand(0, height),
      rand((2 * width) / 3, width), rand(0, height)
    );
    ctx.stroke();
  }

  // 문자 그리기
  const charWidth = width / (text.length + 1);
  for (let i = 0; i < text.length; i++) {
    ctx.save();
    const x = charWidth * (i + 0.8) + rand(-4, 4);
    const y = height / 2 + rand(-6, 6);
    const angle = ((rand(-25, 25)) * Math.PI) / 180;
    const fontSize = rand(28, 36);

    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = `rgb(${rand(20, 80)},${rand(20, 80)},${rand(20, 80)})`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }

  return canvas.toBuffer("image/png").toString("base64");
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
