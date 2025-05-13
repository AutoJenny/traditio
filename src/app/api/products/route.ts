import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET(req) {
  try {
    const url = req?.url ? new URL(req.url, 'http://localhost') : null;
    const showDeleted = url && url.searchParams.get('showDeleted');
    // Fetch products (optionally including deleted)
    const { rows: products } = await pool.query(`
      SELECT * FROM "Product"${showDeleted ? '' : ' WHERE status != \'deleted\''} ORDER BY "createdAt" DESC
    `);

    // Fetch all images for these products
    const productIds = products.map(p => p.id);
    let images = [];
    let categories = [];
    if (productIds.length > 0) {
      const imgRes = await pool.query(
        `SELECT * FROM "Image" WHERE "productId" = ANY($1::int[])`, [productIds]
      );
      images = imgRes.rows;
      // Join to get categories (and their slugs)
      const catRes = await pool.query(`
        SELECT pc."productId", c.*
        FROM "ProductCategory" pc
        JOIN "Category" c ON pc."categoryId" = c.id
        WHERE pc."productId" = ANY($1::int[])
      `, [productIds]);
      categories = catRes.rows;
    }

    // Attach images and categories to products
    const productsWithDetails = products.map(prod => ({
      ...prod,
      images: images.filter(img => img.productId === prod.id),
      categories: categories.filter(cat => cat.productId === prod.id)
    }));

    return NextResponse.json(productsWithDetails);
  } catch (error) {
    console.error('API /api/products error:', error);
    return NextResponse.json({ error: typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { categoryIds, title, price, ...data } = body;
    // Step 1: Generate slug from title
    const tempSlug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'product';
    // Step 2: Insert product (without images)
    const insertProductRes = await pool.query(
      `INSERT INTO "Product" (title, slug, description, price, currency, status, featured, dimensions, condition, origin, period, createdAt, updatedAt)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()) RETURNING *`,
      [
        title,
        tempSlug,
        data.description || '',
        parseFloat(price),
        data.currency || 'GBP',
        data.status || 'available',
        data.featured || false,
        data.dimensions || '',
        data.condition || '',
        data.origin || '',
        data.period || ''
      ]
    );
    const product = insertProductRes.rows[0];
    // Step 3: Update slug to include ID
    const newSlug = `${tempSlug}-${product.id}`;
    await pool.query(`UPDATE "Product" SET slug = $1 WHERE id = $2`, [newSlug, product.id]);
    // Step 4: Insert categories
    if (categoryIds && categoryIds.length > 0) {
      await pool.query(
        `INSERT INTO "ProductCategory" ("productId", "categoryId") VALUES ${categoryIds.map((_, i) => `($1, $${i + 2})`).join(', ')}`,
        [product.id, ...categoryIds.map(Number)]
      );
    }
    // Step 5: Fetch product with images and categories
    const { rows: images } = await pool.query(`SELECT * FROM "Image" WHERE "productId" = $1`, [product.id]);
    const { rows: categories } = await pool.query(`
      SELECT pc."productId", c.*
      FROM "ProductCategory" pc
      JOIN "Category" c ON pc."categoryId" = c.id
      WHERE pc."productId" = $1
    `, [product.id]);
    return NextResponse.json({ product: { ...product, slug: newSlug, images, categories } });
  } catch (error) {
    console.error('API /api/products POST error:', error);
    return NextResponse.json({ error: typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error) }, { status: 500 });
  }
}

export async function PUT(req) {
  // This is a workaround for Next.js API routes: use PUT to /api/products?init=1
  const url = new URL(req.url, 'http://localhost');
  if (url.searchParams.get('init') === '1') {
    try {
      // Generate a unique draft slug
      const draftSlug = `draft-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const insertRes = await pool.query(
        `INSERT INTO "Product" (status, slug, title, description, price, currency, featured, dimensions, condition, origin, period, createdAt, updatedAt)
         VALUES ('draft', $1, 'Draft', 'Draft', 0, 'GBP', false, '', '', '', '', NOW(), NOW()) RETURNING id`,
        [draftSlug]
      );
      return NextResponse.json({ id: insertRes.rows[0].id });
    } catch (error) {
      return NextResponse.json({ error: typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error) }, { status: 500 });
    }
  }
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
} 