import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import fs from 'fs';

function loadJson(filename: string) {
  try {
    return fs.readFileSync(filename, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line));
  } catch (e) {
    return [];
  }
}

async function main() {
  // Clear all tables
  await prisma.productCategory.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.source.deleteMany({});
  await prisma.image.deleteMany({});
  await prisma.badge.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.productTag.deleteMany({});
  await prisma.productDocument.deleteMany({});

  // Load data from JSON
  const products = loadJson('products.json');
  const categories = loadJson('categories.json');
  const productCategories = loadJson('product_categories.json');
  const images = loadJson('images.jsonl');

  // Insert categories and build slug->id map
  const categorySlugToId: Record<string, number> = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: { ...cat, id: undefined } });
    categorySlugToId[created.slug] = created.id;
  }

  // Insert products and build slug->id map
  const productSlugToId: Record<string, number> = {};
  for (const prod of products) {
    const created = await prisma.product.create({ data: { ...prod, id: undefined } });
    productSlugToId[created.slug] = created.id;
  }

  // Insert images (map productId by slug if possible)
  for (const img of images) {
    if (img.productId) {
      // Try to find the product by slug (if available in your data), else use the mapped ID
      await prisma.image.create({ data: { ...img, id: undefined, productId: img.productId } });
    }
  }

  // Insert product-category relationships using mapped IDs
  for (const pc of productCategories) {
    // Try to map by productId and categoryId, or by slug if available
    let productId = pc.productId;
    let categoryId = pc.categoryId;
    // If your product_categories.json has slugs, use them here
    // Otherwise, use the mapped IDs
    if (!productId && pc.productSlug) productId = productSlugToId[pc.productSlug];
    if (!categoryId && pc.categorySlug) categoryId = categorySlugToId[pc.categorySlug];
    if (productId && categoryId) {
      await prisma.productCategory.create({ data: { productId, categoryId } });
    } else {
      console.warn(`Skipping ProductCategory: productId ${productId} or categoryId ${categoryId} does not exist`);
    }
  }

  // Sample data for empty tables
  // Tags
  const tag1 = await prisma.tag.create({ data: { name: 'antique' } });
  const tag2 = await prisma.tag.create({ data: { name: 'vintage' } });
  // ProductTag
  const sampleProduct = await prisma.product.findFirst();
  if (sampleProduct) {
    await prisma.productTag.create({ data: { productId: sampleProduct.id, tagId: tag1.id } });
    await prisma.productTag.create({ data: { productId: sampleProduct.id, tagId: tag2.id } });
  }
  // Sources
  const source1 = await prisma.source.create({ data: { name: 'Sample Auction House', address: '123 Main St', postcode: 'AB12 3CD', notes: 'Sample source' } });
  // Badges
  if (sampleProduct) {
    await prisma.badge.create({ data: { label: 'Featured', productId: sampleProduct.id } });
  }
  // ProductDocument
  if (sampleProduct) {
    await prisma.productDocument.create({ data: { productId: sampleProduct.id, url: '/docs/sample.pdf', type: 'receipt', notes: 'Sample document' } });
  }

  // Reset sequences for all tables with IDs
  const maxProduct = await prisma.product.findFirst({ orderBy: { id: 'desc' } });
  const maxCategory = await prisma.category.findFirst({ orderBy: { id: 'desc' } });
  const maxImage = await prisma.image.findFirst({ orderBy: { id: 'desc' } });
  const maxTag = await prisma.tag.findFirst({ orderBy: { id: 'desc' } });
  const maxBadge = await prisma.badge.findFirst({ orderBy: { id: 'desc' } });
  const maxSource = await prisma.source.findFirst({ orderBy: { id: 'desc' } });
  const maxProductDocument = await prisma.productDocument.findFirst({ orderBy: { id: 'desc' } });

  await prisma.$executeRawUnsafe(`SELECT setval('"Product_id_seq"', ${maxProduct ? maxProduct.id + 1 : 1}, false)`);
  await prisma.$executeRawUnsafe(`SELECT setval('"Category_id_seq"', ${maxCategory ? maxCategory.id + 1 : 1}, false)`);
  await prisma.$executeRawUnsafe(`SELECT setval('"Image_id_seq"', ${maxImage ? maxImage.id + 1 : 1}, false)`);
  await prisma.$executeRawUnsafe(`SELECT setval('"Tag_id_seq"', ${maxTag ? maxTag.id + 1 : 1}, false)`);
  await prisma.$executeRawUnsafe(`SELECT setval('"Badge_id_seq"', ${maxBadge ? maxBadge.id + 1 : 1}, false)`);
  await prisma.$executeRawUnsafe(`SELECT setval('"Source_id_seq"', ${maxSource ? maxSource.id + 1 : 1}, false)`);
  await prisma.$executeRawUnsafe(`SELECT setval('"ProductDocument_id_seq"', ${maxProductDocument ? maxProductDocument.id + 1 : 1}, false)`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect()); 