const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'binary');
  const body = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crcBuf]);
}

function createPng(width, height, r, g, b, isRound = false) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  const radius = Math.min(width, height) / 2;
  const cx = width / 2;
  const cy = height / 2;
  
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      let alpha = 255;
      if (isRound) {
        const dist = Math.hypot(x - cx, y - cy);
        if (dist > radius) {
          alpha = 0;
        } else if (dist > radius - 1) {
          alpha = Math.round(255 * (radius - dist));
        }
      }
      const distC = Math.hypot(x - cx, y - cy);
      let pr = r, pg = g, pb = b;
      if (alpha > 0 && distC < radius * 0.55 && distC > radius * 0.4) {
        pr = 255; pg = 255; pb = 255;
      }
      rawData[offset++] = pr;
      rawData[offset++] = pg;
      rawData[offset++] = pb;
      rawData[offset++] = alpha;
    }
  }
  
  const idatData = zlib.deflateSync(rawData);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const baseResDir = path.resolve(__dirname, '../android/app/src/main/res');

// Mipmap sizes
const mipmaps = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

mipmaps.forEach(({ dir, size }) => {
  const fullDir = path.join(baseResDir, dir);
  if (!fs.existsSync(fullDir)) fs.mkdirSync(fullDir, { recursive: true });
  
  // ic_launcher.png (square / rounded corner)
  const launcher = createPng(size, size, 15, 118, 110, false);
  fs.writeFileSync(path.join(fullDir, 'ic_launcher.png'), launcher);
  
  // ic_launcher_round.png (round)
  const launcherRound = createPng(size, size, 15, 118, 110, true);
  fs.writeFileSync(path.join(fullDir, 'ic_launcher_round.png'), launcherRound);

  // ic_launcher_foreground.png
  const launcherFg = createPng(size, size, 255, 255, 255, true);
  fs.writeFileSync(path.join(fullDir, 'ic_launcher_foreground.png'), launcherFg);
  
  console.log(`Generated icons in ${dir} (${size}x${size})`);
});

// Splash screens
const splashDirs = [
  { dir: 'drawable', w: 480, h: 800 },
  { dir: 'drawable-land-mdpi', w: 480, h: 320 },
  { dir: 'drawable-land-hdpi', w: 800, h: 480 },
  { dir: 'drawable-land-xhdpi', w: 1280, h: 720 },
  { dir: 'drawable-land-xxhdpi', w: 1600, h: 960 },
  { dir: 'drawable-land-xxxhdpi', w: 1920, h: 1080 },
  { dir: 'drawable-port-mdpi', w: 320, h: 480 },
  { dir: 'drawable-port-hdpi', w: 480, h: 800 },
  { dir: 'drawable-port-xhdpi', w: 720, h: 1280 },
  { dir: 'drawable-port-xxhdpi', w: 960, h: 1600 },
  { dir: 'drawable-port-xxxhdpi', w: 1080, h: 1920 },
];

splashDirs.forEach(({ dir, w, h }) => {
  const fullDir = path.join(baseResDir, dir);
  if (!fs.existsSync(fullDir)) fs.mkdirSync(fullDir, { recursive: true });
  const splash = createPng(w, h, 15, 118, 110, false);
  fs.writeFileSync(path.join(fullDir, 'splash.png'), splash);
  console.log(`Generated splash in ${dir} (${w}x${h})`);
});

console.log('All Android icon and splash assets generated successfully!');
