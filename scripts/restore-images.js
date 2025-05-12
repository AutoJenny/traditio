// Script to restore product images by mapping directory names to product slugs
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PRODUCTS_DIR = path.join(process.cwd(), 'public/images/products');

async function main() {
  console.log('Starting image restoration process...');
  
  // Get all product directories
  const productDirs = fs.readdirSync(PRODUCTS_DIR).filter(dir => 
    fs.statSync(path.join(PRODUCTS_DIR, dir)).isDirectory()
  );
  
  console.log(`Found ${productDirs.length} product image directories`);
  
  // Get all products from the database
  const dbProducts = await prisma.product.findMany();
  console.log(`Found ${dbProducts.length} products in the database`);
  
  // Create a mapping of base slugs to full slugs
  const baseSlugToFullSlug = {};
  for (const product of dbProducts) {
    // Extract base slug by removing the ID suffix (_123)
    const baseSlug = product.slug.replace(/_\d+$/, '');
    baseSlugToFullSlug[baseSlug] = product.slug;
  }
  
  // Also create a direct map for exact matches
  const directSlugMap = {};
  for (const product of dbProducts) {
    directSlugMap[product.slug] = product.slug;
  }
  
  console.log('Created slug mappings');
  
  // Process each directory
  let totalImagesAdded = 0;
  for (const dirName of productDirs) {
    // Skip special directories like 'test'
    if (dirName === 'test') continue;
    
    // Try direct match first
    let matchedSlug = directSlugMap[dirName];
    
    // If no direct match, try base slug match
    if (!matchedSlug) {
      const baseSlug = dirName.replace(/_\d+$/, '');
      matchedSlug = baseSlugToFullSlug[baseSlug];
    }
    
    if (!matchedSlug) {
      console.log(`⚠️ No matching product found for directory: ${dirName}`);
      continue;
    }
    
    // Get the product from the database
    const product = await prisma.product.findUnique({ where: { slug: matchedSlug } });
    if (!product) {
      console.log(`⚠️ Product with slug ${matchedSlug} not found in database`);
      continue;
    }
    
    // Get all image files in the directory
    const imageDir = path.join(PRODUCTS_DIR, dirName);
    const imageFiles = fs.readdirSync(imageDir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });
    
    // Add each image to the database
    let imageCounter = 0;
    for (const imageFile of imageFiles) {
      const url = `/images/products/${dirName}/${imageFile}`;
      
      // Check if image already exists
      const existingImage = await prisma.image.findFirst({
        where: { url, productId: product.id }
      });
      
      if (existingImage) {
        console.log(`Image ${url} already exists for product ${product.slug}`);
        continue;
      }
      
      // Create new image
      await prisma.image.create({
        data: {
          url,
          productId: product.id,
          order: imageCounter
        }
      });
      
      imageCounter++;
      totalImagesAdded++;
    }
    
    console.log(`✅ Added ${imageCounter} images for product ${product.slug}`);
    
    // Update the main image if needed and none exists
    if (imageCounter > 0 && !product.mainImageId) {
      const firstImage = await prisma.image.findFirst({
        where: { productId: product.id },
        orderBy: { order: 'asc' }
      });
      
      if (firstImage) {
        await prisma.product.update({
          where: { id: product.id },
          data: { mainImageId: firstImage.id }
        });
        console.log(`✅ Set main image for product ${product.slug}`);
      }
    }
  }
  
  console.log(`\n🎉 Restoration complete! Added ${totalImagesAdded} images to products.`);
}

main()
  .catch(e => {
    console.error('Error during image restoration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 