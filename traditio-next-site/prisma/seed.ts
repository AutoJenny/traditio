import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
const prisma = new PrismaClient();

function loadJson(filename: string) {
  try {
    console.log(`Loading data from ${filename}...`);
    const filePath = path.join(process.cwd(), filename);
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return [];
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    // For JSONL format (one JSON object per line)
    if (filename.endsWith('.jsonl')) {
      return content.split('\n').filter(Boolean).map(line => JSON.parse(line));
    }
    
    // For regular JSON files (either array or one object per line)
    if (content.trim().startsWith('[')) {
      // Standard JSON array
      return JSON.parse(content);
    } else {
      // One JSON object per line
      return content.split('\n').filter(Boolean).map(line => JSON.parse(line));
    }
  } catch (e) {
    console.error(`Error loading ${filename}:`, e);
    return [];
  }
}

async function main() {
  console.log("Starting database seed process...");
  
  // Clear all tables
  console.log("Clearing existing data...");
  await prisma.productCategory.deleteMany({});
  await prisma.productTag.deleteMany({});
  await prisma.badge.deleteMany({});
  await prisma.image.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.source.deleteMany({});
  await prisma.productDocument.deleteMany({});

  // Load data from JSON
  const products = loadJson('products.json');
  const categories = loadJson('categories.json');
  const productCategories = loadJson('product_categories.json');

  console.log(`Loaded ${products.length} products, ${categories.length} categories, ${productCategories.length} product-category relationships`);

  // Insert categories
  console.log("Inserting categories...");
  for (const cat of categories) {
    try {
      await prisma.category.create({ data: cat });
    } catch (error) {
      console.error(`Error creating category ${cat.slug}:`, error);
    }
  }

  // Insert products
  console.log("Inserting products...");
  for (const prod of products) {
    try {
      // Convert date strings to Date objects
      const data = {
        ...prod,
        createdAt: new Date(prod.createdAt),
        updatedAt: new Date(prod.updatedAt)
      };
      await prisma.product.create({ data });
    } catch (error) {
      console.error(`Error creating product ${prod.slug}:`, error);
    }
  }

  // Insert product-category relationships
  if (productCategories.length > 0) {
    console.log("Inserting product-category relationships...");
    for (const pc of productCategories) {
      try {
        await prisma.productCategory.create({ data: pc });
      } catch (error) {
        console.error(`Error creating product-category relationship:`, error);
      }
    }
  }

  // Count products, categories, relationships
  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  const pcCount = await prisma.productCategory.count();

  console.log(`Seeded ${productCount} products, ${categoryCount} categories, ${pcCount} product-category relationships`);

  // Only create sample data if tables are empty
  if (productCount === 0) {
    console.log("Creating sample data...");
    // Tags
    const tag1 = await prisma.tag.create({ data: { name: 'antique' } });
    const tag2 = await prisma.tag.create({ data: { name: 'vintage' } });
    
    // Create a sample product if none exists
    const sampleProduct = await prisma.product.create({
      data: {
        slug: 'sample-product',
        title: 'Sample Product',
        description: 'This is a sample product',
        price: 99.99,
        currency: 'GBP',
        status: 'available'
      }
    });
    
    // ProductTag
    await prisma.productTag.create({ data: { productId: sampleProduct.id, tagId: tag1.id } });
    await prisma.productTag.create({ data: { productId: sampleProduct.id, tagId: tag2.id } });
    
    // Sources
    const source1 = await prisma.source.create({ data: { name: 'Sample Auction House', address: '123 Main St', postcode: 'AB12 3CD', notes: 'Sample source' } });
    
    // Images
    await prisma.image.create({ data: { url: '/images/products/sample.jpg', alt: 'Sample image', productId: sampleProduct.id, order: 1 } });
    
    // Badges
    await prisma.badge.create({ data: { label: 'Featured', productId: sampleProduct.id } });
    
    // ProductDocument
    await prisma.productDocument.create({ data: { productId: sampleProduct.id, url: '/docs/sample.pdf', type: 'receipt', notes: 'Sample document' } });
  }

  console.log("Seed process completed successfully!");
}

main()
  .catch(e => { 
    console.error("Seed process failed:", e); 
    process.exit(1); 
  })
  .finally(() => prisma.$disconnect()); 