import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../../lib/prisma';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public/images/products');

export async function POST(req, context) {
  const { slug } = await context.params;
  // Find product
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  // Parse form data using Web API
  const formData = await req.formData();
  const files = formData.getAll('images'); // Array of File/Blob
  const productDir = path.join(PUBLIC_DIR, slug);
  if (!fs.existsSync(productDir)) fs.mkdirSync(productDir, { recursive: true });

  // Find next available N for <slug>_N.jpg
  const existing = await prisma.image.findMany({ where: { productId: product.id }, orderBy: { order: 'asc' } });
  let nextN = existing.length + 1;
  const newImages = [];

  for (const file of files) {
    if (!file || typeof file === 'string') continue;
    const origName = file.name || 'upload.jpg';
    const ext = path.extname(origName) || '.jpg';
    const filename = `${slug}_${nextN}${ext}`;
    const destPath = path.join(productDir, filename);
    // Read Blob to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destPath, buffer);
    const url = `/images/products/${slug}/${filename}`;
    const image = await prisma.image.create({
      data: {
        url,
        productId: product.id,
        order: nextN - 1,
      },
    });
    newImages.push(image);
    nextN++;
  }

  // Return updated images
  const images = await prisma.image.findMany({ where: { productId: product.id }, orderBy: { order: 'asc' } });
  return NextResponse.json({ images, mainImageId: product.mainImageId });
} 