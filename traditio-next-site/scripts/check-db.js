// scripts/check-db.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const productCount = await prisma.product.count();
    console.log(`Database has ${productCount} products`);
    
    const categoryCount = await prisma.category.count();
    console.log(`Database has ${categoryCount} categories`);
    
    const imageCount = await prisma.image.count();
    console.log(`Database has ${imageCount} images`);

    // List products if there are any
    if (productCount > 0) {
      const products = await prisma.product.findMany({
        select: {
          id: true,
          slug: true,
          title: true,
          _count: {
            select: { images: true }
          }
        },
        take: 10
      });
      
      console.log('\nFirst 10 products:');
      products.forEach(p => {
        console.log(`ID: ${p.id}, Slug: ${p.slug}, Title: ${p.title}, Images: ${p._count.images}`);
      });
    }
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase(); 