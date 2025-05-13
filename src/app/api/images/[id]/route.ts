import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

export async function DELETE(req, context) {
  const { id } = context.params;
  // Find the image record
  const imgRes = await pool.query('SELECT * FROM "Image" WHERE id = $1', [id]);
  if (imgRes.rows.length === 0) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }
  const img = imgRes.rows[0];
  // Delete the image record
  await pool.query('DELETE FROM "Image" WHERE id = $1', [id]);
  // Remove the file from the filesystem
  if (img.url && img.url.startsWith('/images/')) {
    const filePath = path.join(PUBLIC_DIR, img.url);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      // Log but don't fail the request if file deletion fails
      console.error('Failed to delete image file:', filePath, err);
    }
  }
  return NextResponse.json({ success: true });
} 