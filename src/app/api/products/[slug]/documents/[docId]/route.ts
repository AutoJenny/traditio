import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../../../lib/prisma';
import fs from 'fs';
import path from 'path';

export async function DELETE(req, context) {
  const { docId } = context.params;
  const doc = await prisma.productDocument.findUnique({ where: { id: Number(docId) } });
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  // Remove file from disk
  const filePath = path.join(process.cwd(), 'public', doc.url);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await prisma.productDocument.delete({ where: { id: doc.id } });
  return NextResponse.json({ success: true });
} 