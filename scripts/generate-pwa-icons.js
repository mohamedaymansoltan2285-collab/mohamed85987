import { createCanvas } from "canvas";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Background - purple
  ctx.fillStyle = "#6B3A99";
  ctx.beginPath();
  const radius = size * 0.18;
  ctx.roundRect(0, 0, size, size, radius);
  ctx.fill();

  // Draw a shield shape in white
  const cx = size / 2;
  const cy = size / 2;
  const shieldW = size * 0.5;
  const shieldH = size * 0.58;
  const sx = cx - shieldW / 2;
  const sy = cy - shieldH / 2 - size * 0.03;

  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.beginPath();
  ctx.moveTo(sx + shieldW / 2, sy);
  ctx.lineTo(sx + shieldW, sy + shieldH * 0.3);
  ctx.lineTo(sx + shieldW, sy + shieldH * 0.6);
  ctx.quadraticCurveTo(sx + shieldW, sy + shieldH, sx + shieldW / 2, sy + shieldH);
  ctx.quadraticCurveTo(sx, sy + shieldH, sx, sy + shieldH * 0.6);
  ctx.lineTo(sx, sy + shieldH * 0.3);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = size * 0.035;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx, sy + size * 0.04);
  ctx.lineTo(sx + shieldW - size * 0.01, sy + shieldH * 0.28);
  ctx.lineTo(sx + shieldW - size * 0.01, sy + shieldH * 0.58);
  ctx.quadraticCurveTo(sx + shieldW - size * 0.01, sy + shieldH - size * 0.01, cx, sy + shieldH - size * 0.01);
  ctx.quadraticCurveTo(sx + size * 0.01, sy + shieldH - size * 0.01, sx + size * 0.01, sy + shieldH * 0.58);
  ctx.lineTo(sx + size * 0.01, sy + shieldH * 0.28);
  ctx.closePath();
  ctx.stroke();

  // Heart inside shield
  const hx = cx;
  const hy = cy + size * 0.03;
  const hr = size * 0.1;
  ctx.fillStyle = "#FF6B9E";
  ctx.beginPath();
  ctx.moveTo(hx, hy + hr * 0.5);
  ctx.bezierCurveTo(hx, hy - hr * 0.2, hx - hr * 1.6, hy - hr * 0.2, hx - hr * 1.6, hy + hr * 0.5);
  ctx.bezierCurveTo(hx - hr * 1.6, hy + hr * 1.5, hx, hy + hr * 2.2, hx, hy + hr * 2.2);
  ctx.bezierCurveTo(hx, hy + hr * 2.2, hx + hr * 1.6, hy + hr * 1.5, hx + hr * 1.6, hy + hr * 0.5);
  ctx.bezierCurveTo(hx + hr * 1.6, hy - hr * 0.2, hx, hy - hr * 0.2, hx, hy + hr * 0.5);
  ctx.fill();

  return canvas.toBuffer("image/png");
}

const sizes = [192, 512];
for (const size of sizes) {
  const buffer = generateIcon(size);
  const outPath = join(publicDir, `pwa-${size}x${size}.png`);
  writeFileSync(outPath, buffer);
  console.log(`Generated: pwa-${size}x${size}.png (${buffer.length} bytes)`);
}

console.log("PWA icons generated successfully!");
