import { NextResponse } from 'next/server';
import pool from '../../../../../../../lib/db';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public/documents/products');

export async function POST(req, context) {
  const { slug } = context.params;
  // Find product
  const productRes = await pool.query('SELECT * FROM "Product" WHERE slug = $1', [slug]);
  if (productRes.rows.length === 0) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  const product = productRes.rows[0];

  // Parse form data
  const formData = await req.formData();
  const files = formData.getAll('documents'); // Array of File/Blob
  const docType = formData.get('type') || null;
  const notes = formData.get('notes') || null;
  const productDir = path.join(PUBLIC_DIR, slug);
  if (!fs.existsSync(productDir)) fs.mkdirSync(productDir, { recursive: true });

  const newDocs = [];
  for (const file of files) {
    if (!file || typeof file === 'string') continue;
    const origName = file.name || 'upload.pdf';
    const ext = path.extname(origName) || '.pdf';
    const filename = `${slug}_${Date.now()}${ext}`;
    const destPath = path.join(productDir, filename);
    // Read Blob to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destPath, buffer);
    const url = `/documents/products/${slug}/${filename}`;
    const insertRes = await pool.query(
      'INSERT INTO "ProductDocument" (url, "productId", type, notes, "uploadedAt") VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [url, product.id, docType, notes]
    );
    newDocs.push(insertRes.rows[0]);
  }

  // Return updated documents
  const docsRes = await pool.query('SELECT * FROM "ProductDocument" WHERE "productId" = $1 ORDER BY "uploadedAt" ASC', [product.id]);
  return NextResponse.json({ documents: docsRes.rows });
} 