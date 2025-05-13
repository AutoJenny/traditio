import { NextResponse } from 'next/server';
import pool from '../../../../../../../lib/db';
import fs from 'fs';
import path from 'path';

export async function DELETE(req, context) {
  const { docId } = context.params;
  const docRes = await pool.query('SELECT * FROM "ProductDocument" WHERE id = $1', [Number(docId)]);
  if (docRes.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const doc = docRes.rows[0];
  // Remove file from disk
  const filePath = path.join(process.cwd(), 'public', doc.url);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await pool.query('DELETE FROM "ProductDocument" WHERE id = $1', [doc.id]);
  return NextResponse.json({ success: true });
} 