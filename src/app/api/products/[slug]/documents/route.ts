import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../../../lib/db';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public/documents/products');

// GET /api/products/[slug]/documents
export async function GET(req, context) {
  const { slug } = context.params;
  const productRes = await pool.query('SELECT * FROM "Product" WHERE slug = $1', [slug]);
  if (productRes.rows.length === 0) return NextResponse.json({ documents: [] });
  const product = productRes.rows[0];
  const docsRes = await pool.query('SELECT * FROM "ProductDocument" WHERE "productId" = $1 ORDER BY "uploadedAt" ASC', [product.id]);
  return NextResponse.json({ documents: docsRes.rows });
}

// DELETE /api/products/[slug]/documents/[docId]
export async function DELETE(req, context) {
  const { slug, docId } = context.params;
  const docRes = await pool.query('SELECT * FROM "ProductDocument" WHERE id = $1', [Number(docId)]);
  if (docRes.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const doc = docRes.rows[0];
  // Remove file from disk
  const filePath = path.join(process.cwd(), 'public', doc.url);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await pool.query('DELETE FROM "ProductDocument" WHERE id = $1', [doc.id]);
  return NextResponse.json({ success: true });
} 