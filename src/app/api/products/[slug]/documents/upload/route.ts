import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../../lib/prisma';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public/documents/products');

export async function POST(req, context) {
  const { slug } = context.params;
  // Find product
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

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
    const doc = await prisma.productDocument.create({
      data: {
        url,
        productId: product.id,
        type: docType,
        notes: notes,
      },
    });
    newDocs.push(doc);
  }

  // Return updated documents
  const documents = await prisma.productDocument.findMany({ where: { productId: product.id }, orderBy: { uploadedAt: 'asc' } });
  return NextResponse.json({ documents });
} 