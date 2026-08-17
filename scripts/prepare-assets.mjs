import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

await mkdir("public/media", { recursive: true });

const originalLogo = "public/logo.png";
const { data, info } = await sharp(originalLogo)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

let minX = info.width;
let minY = info.height;
let maxX = -1;
let maxY = -1;
let greenish = 0;

for (let y = 0; y < info.height; y += 1) {
  for (let x = 0; x < info.width; x += 1) {
    const i = (y * info.width + x) * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a > 12) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }

    const isGreenFringe = g > 90 && g > r + 10 && g > b + 10;

    if (a < 24 || isGreenFringe) {
      if (a > 0) greenish += 1;
      data[i + 3] = 0;
    }
  }
}

const cleanedLogo = await sharp(data, { raw: info })
  .extract({
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  })
  .extend({
    top: 66,
    bottom: 65,
    left: 64,
    right: 63,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  })
  .png({ compressionLevel: 9 })
  .toBuffer();

await sharp(cleanedLogo)
  .resize(1024, 1024, { fit: "contain", withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile("public/logo-transparent.png");
await sharp(cleanedLogo)
  .resize(768, 768, { fit: "contain", withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile("public/logo-clean.png");
await sharp(cleanedLogo)
  .resize(620, 620, { fit: "contain", withoutEnlargement: true })
  .webp({ quality: 92 })
  .toFile("public/logo-clean.webp");
await sharp(cleanedLogo)
  .resize(192, 192, { fit: "contain" })
  .png()
  .toFile("public/favicon.png");
await sharp(cleanedLogo)
  .resize(180, 180, { fit: "contain" })
  .png()
  .toFile("public/apple-touch-icon.png");

const cc0FieldSource = "public/media/halfway-source.jpg";
if (existsSync(cc0FieldSource)) {
  const fieldWide = sharp(cc0FieldSource).rotate().resize(1600, 1000, {
    fit: "cover",
    position: "center"
  });
  await fieldWide.clone().webp({ quality: 78 }).toFile("public/media/field-wide-1600.webp");
  await fieldWide.clone().avif({ quality: 55 }).toFile("public/media/field-wide-1600.avif");

  const fieldPortrait = sharp(cc0FieldSource).rotate().resize(960, 1200, {
    fit: "cover",
    position: "center"
  });
  await fieldPortrait.clone().webp({ quality: 78 }).toFile("public/media/field-portrait-960.webp");
  await fieldPortrait.clone().avif({ quality: 55 }).toFile("public/media/field-portrait-960.avif");

  const fieldBanner = sharp(cc0FieldSource).rotate().resize(1200, 675, {
    fit: "cover",
    position: "center"
  });
  await fieldBanner.clone().webp({ quality: 78 }).toFile("public/media/field-banner-1200.webp");
  await fieldBanner.clone().avif({ quality: 55 }).toFile("public/media/field-banner-1200.avif");
}

const ogSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="#063A78"/>
      <stop offset=".5" stop-color="#67314F"/>
      <stop offset="1" stop-color="#C52032"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#07111F"/>
  <rect width="1200" height="10" fill="url(#g)"/>
  <circle cx="970" cy="305" r="180" fill="none" stroke="url(#g)" stroke-width="22" stroke-dasharray="760 420" transform="rotate(-20 970 305)"/>
  <path d="M620 470 H1130 M690 520 H1040 M760 570 H970" stroke="#29394E" stroke-width="2"/>
  <text x="390" y="185" fill="#B6C0CD" font-family="Arial, sans-serif" font-size="28" letter-spacing="4">FK MILUTINAC / ZEMUN / OD 1947.</text>
  <text x="390" y="285" fill="#FAF8F3" font-family="Georgia, serif" font-size="70" font-weight="700">Škola fudbala i</text>
  <text x="390" y="365" fill="#FAF8F3" font-family="Georgia, serif" font-size="70" font-weight="700">sportski kompleks</text>
  <text x="390" y="435" fill="#FAF8F3" font-family="Arial, sans-serif" font-size="30">Nade Dimić 5–7, Zemun</text>
</svg>`;

await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: { r: 7, g: 17, b: 31, alpha: 1 }
  }
})
  .composite([
    {
      input: await sharp(cleanedLogo).resize(260, 260, { fit: "contain" }).png().toBuffer(),
      left: 80,
      top: 185
    },
    { input: Buffer.from(ogSvg), left: 0, top: 0 }
  ])
  .png()
  .toFile("public/og.png");

console.log(
  JSON.stringify(
    {
      sourceLogo: `${info.width}x${info.height}`,
      visibleBox: {
        x: `${minX}-${maxX}`,
        y: `${minY}-${maxY}`,
        size: `${maxX - minX + 1}x${maxY - minY + 1}`
      },
      cleanedPixels: greenish
    },
    null,
    2
  )
);
