import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';

const source = 'public/logo.png';
const outDir = 'public/icons';

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 167, 180, 192, 256, 384, 512];

async function run() {
  for (const size of sizes) {
    const dest = `${outDir}/icon-${size}.png`;
    await sharp(source)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toFile(dest);
  }

  // Maskable versions for Android adaptive icons
  for (const size of [192, 512]) {
    const dest = `${outDir}/icon-${size}-maskable.png`;
    await sharp(source)
      .resize(size, size, { fit: 'cover' })
      .png({ compressionLevel: 9 })
      .toFile(dest);
  }

  console.log('Icons generated in public/icons');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
