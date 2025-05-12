import { NextResponse } from 'next/server';
import pool from '../../../../../../../lib/db';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public/images/products');

export async function POST(req, context) {
  const { slug } = await context.params;
  // Find product
  const productRes = await pool.query('SELECT * FROM "Product" WHERE slug = $1', [slug]);
  if (productRes.rows.length === 0) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  const product = productRes.rows[0];

  // Parse form data using Web API
  const formData = await req.formData();
  const files = formData.getAll('images'); // Array of File/Blob
  const productDir = path.join(PUBLIC_DIR, slug);
  if (!fs.existsSync(productDir)) fs.mkdirSync(productDir, { recursive: true });

  // Find next available N for <slug>_N.jpg
  const existingRes = await pool.query('SELECT * FROM "Image" WHERE "productId" = $1 ORDER BY "order" ASC', [product.id]);
  let nextN = existingRes.rows.length + 1;
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
    const insertRes = await pool.query(
      'INSERT INTO "Image" (url, "productId", "order") VALUES ($1, $2, $3) RETURNING *',
      [url, product.id, nextN - 1]
    );
    newImages.push(insertRes.rows[0]);
    nextN++;
  }

  // Return updated images
  const imagesRes = await pool.query('SELECT * FROM "Image" WHERE "productId" = $1 ORDER BY "order" ASC', [product.id]);
  return NextResponse.json({ images: imagesRes.rows, mainImageId: product.mainImageId });
} 