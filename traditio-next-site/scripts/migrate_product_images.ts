import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(__dirname, '../public/images/products');

async function migrateImages() {
  const products = await prisma.product.findMany({ include: { images: true } });
  for (const product of products) {
    const slug = product.slug;
    const productDir = path.join(PUBLIC_DIR, slug);
    if (!fs.existsSync(productDir)) fs.mkdirSync(productDir, { recursive: true });
    for (let i = 0; i < product.images.length; i++) {
      const img = product.images[i];
      // Extract old filename
      const oldPath = path.join(PUBLIC_DIR, img.url.replace(/^\/images\/products\//, ''));
      const ext = path.extname(img.url) || '.jpg';
      const newFilename = `${slug}_${i + 1}${ext}`;
      const newPath = path.join(productDir, newFilename);
      // Move/rename file if it exists
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Moved: ${oldPath} -> ${newPath}`);
      } else {
        console.warn(`File not found: ${oldPath}`);
      }
      // Update DB url
      const newUrl = `/images/products/${slug}/${newFilename}`;
      await prisma.image.update({ where: { id: img.id }, data: { url: newUrl } });
      console.log(`Updated DB: image ${img.id} url -> ${newUrl}`);
    }
  }
  console.log('Image migration complete.');
  await prisma.$disconnect();
}

migrateImages().catch(e => { console.error(e); process.exit(1); }); 