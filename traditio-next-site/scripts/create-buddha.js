const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function createBuddha() {
  try {
    console.log('Creating the rare-buddha product...');
    
    // Check if it already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: 'rare-buddha_101' }
    });
    
    if (existingProduct) {
      console.log('Product rare-buddha_101 already exists');
      return;
    }
    
    // Create the product
    const product = await prisma.product.create({
      data: {
        id: 101,
        slug: 'rare-buddha_101',
        title: 'Rare Buddha',
        description: 'A unique and rare Buddha statue for testing porpoises.',
        price: 15500,
        currency: 'GBP',
        status: 'sold',
        dimensions: '6" high',
        condition: 'As new',
        origin: 'Tibet',
        period: 'c. 11th century',
        featured: true,
        createdAt: new Date('2025-05-11T17:54:04.39'),
        updatedAt: new Date('2025-05-11T20:09:29.287')
      }
    });
    
    console.log('Created product:', product);
    
    // Now run the image restoration specifically for this product
    const productsDir = path.join(process.cwd(), 'public/images/products');
    const dirName = 'rare-buddha_101';
    const imageDir = path.join(productsDir, dirName);
    
    if (!fs.existsSync(imageDir)) {
      console.log(`Image directory ${imageDir} does not exist`);
      return;
    }
    
    const imageFiles = fs.readdirSync(imageDir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });
    
    console.log(`Found ${imageFiles.length} images for rare-buddha_101`);
    
    // Add each image to the database
    let imageCounter = 0;
    for (const imageFile of imageFiles) {
      const url = `/images/products/${dirName}/${imageFile}`;
      
      // Create new image
      const image = await prisma.image.create({
        data: {
          url,
          productId: product.id,
          order: imageCounter
        }
      });
      
      console.log(`Added image: ${url}`);
      imageCounter++;
    }
    
    if (imageCounter > 0) {
      // Set the first image as the main image
      const firstImage = await prisma.image.findFirst({
        where: { productId: product.id },
        orderBy: { order: 'asc' }
      });
      
      if (firstImage) {
        await prisma.product.update({
          where: { id: product.id },
          data: { mainImageId: firstImage.id }
        });
        console.log('Set main image for rare-buddha_101');
      }
    }
    
    console.log(`Added ${imageCounter} images to rare-buddha_101`);
  } catch (error) {
    console.error('Error creating Buddha product:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createBuddha(); 