import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../../lib/prisma';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public/documents/products');

// GET /api/products/[slug]/documents
export async function GET(req, context) {
  const { slug } = context.params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return NextResponse.json({ documents: [] });
  const documents = await prisma.productDocument.findMany({ where: { productId: product.id }, orderBy: { uploadedAt: 'asc' } });
  return NextResponse.json({ documents });
}

// DELETE /api/products/[slug]/documents/[docId]
export async function DELETE(req, context) {
  const { slug, docId } = context.params;
  const doc = await prisma.productDocument.findUnique({ where: { id: Number(docId) } });
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  // Remove file from disk
  const filePath = path.join(process.cwd(), 'public', doc.url);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await prisma.productDocument.delete({ where: { id: doc.id } });
  return NextResponse.json({ success: true });
} 