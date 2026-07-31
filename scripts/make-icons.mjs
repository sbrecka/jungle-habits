/**
 * Generates the PWA icons into public/.
 *
 * The art is drawn on a small pixel grid and scaled up with nearest-neighbour,
 * so the icon stays chunky and matches the game rather than turning into a
 * smooth blob. PNGs are encoded by hand — a whole image library would be a lot
 * of dependency for four small files.
 *
 *   node scripts/make-icons.mjs
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

/* ---------- PNG encoding ---------- */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** `pixels` is RGBA, width * height * 4 bytes. */
function encodePng(width, height, pixels) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

/* ---------- the artwork ---------- */

const hex = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
  255
];

const BG = hex("#12121a");
const GOLD = hex("#e0a53c");
const GOLD_HI = hex("#f7d98a");
const GOLD_LO = hex("#a86f20");
const EDGE = hex("#23202b");

/** A coin on a dark field: the whole game is about the money. */
function drawGrid(size) {
  const g = new Array(size * size).fill(BG);
  const c = (size - 1) / 2;
  const r = size * 0.36;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - c;
      const dy = y - c;
      const d = Math.hypot(dx, dy);
      let px = null;

      if (d <= r - 1) px = GOLD;
      if (d <= r - 1 && dx + dy < -r * 0.45) px = GOLD_HI;
      if (d <= r - 1 && dx + dy > r * 0.55) px = GOLD_LO;
      if (d > r - 1 && d <= r) px = EDGE;

      if (px) g[y * size + x] = px;
    }
  }

  // A slot through the middle, so it reads as a coin and not a ball.
  const slotW = Math.max(1, Math.round(size * 0.09));
  const slotH = Math.round(r * 1.05);
  for (let y = Math.round(c - slotH / 2); y <= Math.round(c + slotH / 2); y++) {
    for (let x = Math.round(c - slotW / 2); x < Math.round(c + slotW / 2) + 1; x++) {
      if (x >= 0 && y >= 0 && x < size && y < size) g[y * size + x] = hex("#fff0c0");
    }
  }
  return g;
}

/** Nearest-neighbour, so the pixels stay square. */
function render(gridSize, target) {
  const grid = drawGrid(gridSize);
  const scale = target / gridSize;
  const out = Buffer.alloc(target * target * 4);
  for (let y = 0; y < target; y++) {
    for (let x = 0; x < target; x++) {
      const src = grid[Math.floor(y / scale) * gridSize + Math.floor(x / scale)];
      out.set(src, (y * target + x) * 4);
    }
  }
  return encodePng(target, target, out);
}

mkdirSync(OUT, { recursive: true });
for (const [name, size] of [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["apple-icon.png", 180],
  ["favicon-32.png", 32]
]) {
  writeFileSync(join(OUT, name), render(32, size));
  console.log(`wrote public/${name} (${size}x${size})`);
}
