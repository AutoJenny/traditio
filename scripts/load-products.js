// scripts/load-products.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function loadProducts() {
  try {
    console.log('Loading products from products.json...');
    
    // Read the products.json file
    const filePath = path.join(process.cwd(), 'products.json');
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const products = content.split('\n').filter(Boolean).map(line => {
      try {
        return JSON.parse(line);
      } catch (e) {
        console.error('Error parsing line:', line);
        return null;
      }
    }).filter(Boolean);
    
    console.log(`Found ${products.length} products in products.json`);
    
    // Count existing products
    const existingCount = await prisma.product.count();
    console.log(`Database currently has ${existingCount} products`);
    
    if (existingCount > 0) {
      console.log('Clearing existing products...');
      await prisma.productCategory.deleteMany({});
      await prisma.productTag.deleteMany({});
      await prisma.badge.deleteMany({});
      await prisma.image.deleteMany({});
      await prisma.product.deleteMany({});
    }
    
    // Insert products
    let successCount = 0;
    let errorCount = 0;
    
    for (const prod of products) {
      try {
        // Convert date strings to Date objects
        const data = {
          ...prod,
          created: new Date(prod.created),
          updated: new Date(prod.updated)
        };
        
        await prisma.product.create({ data });
        successCount++;
      } catch (error) {
        console.error(`Error creating product ${prod.slug}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`Successfully inserted ${successCount} products (${errorCount} errors)`);
    
    // Verify products were inserted
    const finalCount = await prisma.product.count();
    console.log(`Database now has ${finalCount} products`);
    
    // List a few products to verify
    if (finalCount > 0) {
      const sampleProducts = await prisma.product.findMany({
        select: {
          id: true,
          slug: true,
          title: true
        },
        take: 5
      });
      
      console.log('\nSample of products loaded:');
      sampleProducts.forEach(p => {
        console.log(`ID: ${p.id}, Slug: ${p.slug}, Title: ${p.title}`);
      });
    }
  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

loadProducts(); 