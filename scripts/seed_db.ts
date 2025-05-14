import pool, { slugify } from '../lib/db';
const fs = require('fs');
const path = require('path');

async function main() {
  // File paths
  const categoriesPath = path.join(process.cwd(), 'categories.json');
  const productsPath = path.join(process.cwd(), 'products.json');
  const imagesPath = path.join(process.cwd(), 'images.jsonl');
  const productCategoriesPath = path.join(process.cwd(), 'product_categories.json');

  // Read and parse files
  const categories = fs.readFileSync(categoriesPath, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line));
  const products = fs.readFileSync(productsPath, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line.replace(/\\"/g, '"')));
  const images = fs.readFileSync(imagesPath, 'utf8').split('\n').filter(Boolean).map(line => {
    try {
      return JSON.parse(line.replace(/,\s*$/, ''));
    } catch (e) {
      console.error('Error parsing image line:', line, e);
      throw e;
    }
  });
  const productCategories = fs.readFileSync(productCategoriesPath, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line));

  const client = await pool.connect();
  try {
    console.log('Clearing tables...');
    await client.query('BEGIN');
    await client.query('DELETE FROM "ProductCategory"');
    await client.query('DELETE FROM "Image"');
    await client.query('DELETE FROM "Product"');
    await client.query('DELETE FROM "Category"');

    console.log('Inserting categories...');
    for (const cat of categories) {
      await client.query(
        'INSERT INTO "Category" (id, slug, name, description, "parentId", "order") VALUES ($1, $2, $3, $4, $5, $6)',
        [cat.id, cat.slug, cat.name, cat.description, cat.parentId, cat.order]
      );
    }

    console.log('Inserting products...');
    for (const prod of products) {
      const slug = slugify(prod.title);
      await client.query(
        'INSERT INTO "Product" (id, slug, title, description, price, currency, status, "mainImageId", dimension_wide, dimension_deep, dimension_high, weight, condition, origin, period, featured, "created", "updated") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)',
        [prod.id, slug, prod.title, prod.description, prod.price, prod.currency, prod.status, prod.mainImageId,
         prod.dimension_wide !== undefined && !isNaN(Number(prod.dimension_wide)) ? Number(prod.dimension_wide) : null,
         prod.dimension_deep !== undefined && !isNaN(Number(prod.dimension_deep)) ? Number(prod.dimension_deep) : null,
         prod.dimension_high !== undefined && !isNaN(Number(prod.dimension_high)) ? Number(prod.dimension_high) : null,
         prod.weight !== undefined && !isNaN(Number(prod.weight)) ? Number(prod.weight) : null,
         prod.condition, prod.origin, prod.period, prod.featured, prod.created, prod.updated]
      );
    }

    console.log('Inserting images...');
    for (const img of images) {
      await client.query(
        'INSERT INTO "Image" (id, url, alt, "productId", "order") VALUES ($1, $2, $3, $4, $5)',
        [img.id, img.url, img.alt, img.productId, img.order]
      );
    }

    console.log('Inserting product-category relationships...');
    for (const pc of productCategories) {
      await client.query(
        'INSERT INTO "ProductCategory" ("productId", "categoryId") VALUES ($1, $2)',
        [pc.productId, pc.categoryId]
      );
    }

    await client.query('COMMIT');
    console.log('Database seeded successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during seeding:', err);
  } finally {
    client.release();
    process.exit();
  }
}

main(); 