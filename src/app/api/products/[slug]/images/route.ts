import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../../../lib/db';

export async function PUT(req, context) {
  const { slug } = context.params;
  const body = await req.json();
  const { images } = body;

  // Find the product
  const productRes = await pool.query('SELECT * FROM "Product" WHERE slug = $1', [slug]);
  if (productRes.rows.length === 0) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  const product = productRes.rows[0];

  // Update each image's order and alt text
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    await pool.query(
      'UPDATE "Image" SET "order" = $1, alt = $2 WHERE id = $3',
      [i, img.alt || null, img.id]
    );
  }

  // Fetch updated images
  const updatedImagesRes = await pool.query(
    'SELECT * FROM "Image" WHERE "productId" = $1 ORDER BY "order" ASC',
    [product.id]
  );

  return NextResponse.json({ images: updatedImagesRes.rows });
} 