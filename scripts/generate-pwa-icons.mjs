import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const iconsDir = join(publicDir, 'icons');

const svg = readFileSync(join(publicDir, 'pwa-icon.svg'));

await mkdir(iconsDir, { recursive: true });

const sizes = [
  { size: 72, name: 'icon-72.png' },
  { size: 96, name: 'icon-96.png' },
  { size: 128, name: 'icon-128.png' },
  { size: 144, name: 'icon-144.png' },
  { size: 152, name: 'icon-152.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 384, name: 'icon-384.png' },
  { size: 512, name: 'icon-512.png' },
];

for (const { size, name } of sizes) {
  await sharp(svg).resize(size, size).png().toFile(join(iconsDir, name));
}

await sharp(svg).resize(512, 512).png().toFile(join(publicDir, 'apple-touch-icon.png'));

await sharp(svg)
  .resize(512, 512)
  .extend({
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
    background: { r: 5, g: 8, b: 16, alpha: 1 },
  })
  .png()
  .toFile(join(iconsDir, 'icon-maskable-512.png'));

await sharp(svg)
  .resize(192, 192)
  .extend({
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
    background: { r: 5, g: 8, b: 16, alpha: 1 },
  })
  .png()
  .toFile(join(iconsDir, 'icon-maskable-192.png'));

console.log('PWA icons generated in public/icons/');
