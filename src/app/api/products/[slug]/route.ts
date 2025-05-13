import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

function withCors(response: Response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS() {
  console.log('OPTIONS handler called');
  return withCors(new Response(null, { status: 204 }));
}

export async function GET(req: Request, context: any) {
  const { params } = await context;
  const slug = params.slug;
  console.log('GET handler called for', slug);
  try {
    const productRes = await pool.query('SELECT *, "createdAt" as created, "updatedAt" as updated FROM "Product" WHERE slug = $1', [slug]);
    if (productRes.rows.length === 0) {
      return withCors(NextResponse.json({ error: 'Product not found' }, { status: 404 }));
    }
    const product = productRes.rows[0];
    const { createdAt, updatedAt, ...rest } = product;
    const { rows: images } = await pool.query('SELECT * FROM "Image" WHERE "productId" = $1', [product.id]);
    const { rows: categories } = await pool.query(`
      SELECT pc."productId", c.*
      FROM "ProductCategory" pc
      JOIN "Category" c ON pc."categoryId" = c.id
      WHERE pc."productId" = $1
    `, [product.id]);
    const normalizedProduct = {
      ...rest,
      created: product.created || product.createdAt,
      updated: product.updated || product.updatedAt,
      images,
      categories
    };
    return withCors(NextResponse.json({ product: normalizedProduct }));
  } catch (error) {
    console.error('GET /api/products/[slug] error:', error);
    return withCors(NextResponse.json({ error: typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error) }, { status: 500 }));
  }
}

export async function PUT(req: Request, context: any) {
  const { params } = await context;
  const slug = params.slug;
  console.log('PUT handler called for', slug);
  let body;
  try {
    body = await req.json();
  } catch (err) {
    console.error('PUT /api/products/[slug] invalid JSON:', err);
    return withCors(NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }));
  }
  try {
    const { categoryIds, images, title, description, price, currency, status, mainImageId, dimensions, condition, origin, period, featured } = body;
    if (!title || !price) {
      return withCors(NextResponse.json({ error: 'Title and price are required' }, { status: 400 }));
    }
    // Find product by slug
    const productRes = await pool.query('SELECT * FROM "Product" WHERE slug = $1', [slug]);
    if (productRes.rows.length === 0) return withCors(NextResponse.json({ error: 'Product not found' }, { status: 404 }));
    const product = productRes.rows[0];
    // Update product fields
    await pool.query(
      `UPDATE "Product" SET title=$1, description=$2, price=$3, currency=$4, status=$5, "mainImageId"=$6, dimensions=$7, condition=$8, origin=$9, period=$10, featured=$11, updated=NOW() WHERE id=$12`,
      [title, description, parseFloat(price), currency, status, mainImageId, dimensions, condition, origin, period, featured, product.id]
    );
    // Update categories if provided
    if (Array.isArray(categoryIds)) {
      await pool.query('DELETE FROM "ProductCategory" WHERE "productId" = $1', [product.id]);
      if (categoryIds.length > 0) {
        await pool.query(
          `INSERT INTO "ProductCategory" ("productId", "categoryId") VALUES ${categoryIds.map((_: any, i: number) => `($1, $${i + 2})`).join(', ')}`,
          [product.id, ...categoryIds.map(Number)]
        );
      }
    }
    // Update images if provided
    if (Array.isArray(images)) {
      await pool.query('DELETE FROM "Image" WHERE "productId" = $1', [product.id]);
      for (const img of images) {
        await pool.query(
          'INSERT INTO "Image" (url, alt, order, "productId") VALUES ($1, $2, $3, $4)',
          [img.url, img.alt || null, typeof img.order === 'number' ? img.order : null, product.id]
        );
      }
    }
    // Fetch updated product, images, and categories
    const updatedProductRes = await pool.query('SELECT * FROM "Product" WHERE id = $1', [product.id]);
    const updatedProduct = updatedProductRes.rows[0];
    const { rows: updatedImages } = await pool.query('SELECT * FROM "Image" WHERE "productId" = $1', [product.id]);
    const { rows: updatedCategories } = await pool.query(`
      SELECT pc."productId", c.*
      FROM "ProductCategory" pc
      JOIN "Category" c ON pc."categoryId" = c.id
      WHERE pc."productId" = $1
    `, [product.id]);
    return withCors(NextResponse.json({ product: { ...updatedProduct, images: updatedImages, categories: updatedCategories } }));
  } catch (error) {
    console.error('PUT /api/products/[slug] error:', error, 'Request body:', body);
    return withCors(NextResponse.json({ error: typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error) }, { status: 500 }));
  }
}

export async function DELETE(req: Request, context: any) {
  const { params } = await context;
  const slug = params.slug;
  console.log('DELETE handler called for', slug);
  try {
    // Find product by slug
    const productRes = await pool.query('SELECT * FROM "Product" WHERE slug = $1', [slug]);
    if (productRes.rows.length === 0) {
      console.log('DELETE: Product not found for slug', slug);
      return withCors(NextResponse.json({ error: 'Product not found' }, { status: 404 }));
    }
    const product = productRes.rows[0];
    // Soft delete: set status to 'deleted' and update updatedAt, regardless of completeness
    await pool.query('UPDATE "Product" SET status = $1, updated = NOW() WHERE id = $2', ['deleted', product.id]);
    // Fetch updated product
    const updatedProductRes = await pool.query('SELECT * FROM "Product" WHERE id = $1', [product.id]);
    const updatedProduct = updatedProductRes.rows[0];
    console.log('DELETE: Product soft-deleted', slug);
    return withCors(NextResponse.json({ product: updatedProduct }));
  } catch (error) {
    console.error('DELETE /api/products/[slug] error:', error);
    return withCors(NextResponse.json({ error: typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error) }, { status: 500 }));
  }
} 