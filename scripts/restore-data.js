// scripts/restore-data.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const IMPORT_DIR = path.join(process.cwd(), 'prisma/exports');

// Specify the export timestamp you want to restore
const TIMESTAMP = process.argv[2]; // e.g., '2025-05-15T12-34-56-789Z'
if (!TIMESTAMP) {
  console.error('Please provide an export timestamp to restore');
  console.error('Usage: node scripts/restore-data.js <timestamp>');
  process.exit(1);
}

async function restoreData() {
  console.log(`Restoring data from exports with timestamp: ${TIMESTAMP}`);

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.$transaction([
    prisma.productCategory.deleteMany(),
    prisma.productTag.deleteMany(),
    prisma.image.deleteMany(),
    prisma.badge.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.source.deleteMany(),
    prisma.productDocument.deleteMany(),
  ]);

  // Restore categories
  const categoriesPath = path.join(IMPORT_DIR, `categories_${TIMESTAMP}.json`);
  if (fs.existsSync(categoriesPath)) {
    const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    console.log(`Restoring ${categories.length} categories...`);
    
    for (const category of categories) {
      await prisma.category.create({
        data: {
          ...category,
          id: undefined // Let the database assign new IDs
        }
      });
    }
  } else {
    console.warn(`Warning: Categories file not found at ${categoriesPath}`);
  }

  // Restore products
  const productsPath = path.join(IMPORT_DIR, `products_${TIMESTAMP}.json`);
  if (fs.existsSync(productsPath)) {
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    console.log(`Restoring ${products.length} products...`);
    
    for (const product of products) {
      await prisma.product.create({
        data: {
          ...product,
          id: undefined, // Let the database assign new IDs
          mainImageId: null // Will update this after images are restored
        }
      });
    }
  } else {
    console.warn(`Warning: Products file not found at ${productsPath}`);
  }

  // Map old IDs to new IDs for all entities
  const oldToNewProductIds = {};
  const productsBySlug = {};
  const products = await prisma.product.findMany();
  const oldProductsPath = path.join(IMPORT_DIR, `products_${TIMESTAMP}.json`);
  
  if (fs.existsSync(oldProductsPath)) {
    const oldProducts = JSON.parse(fs.readFileSync(oldProductsPath, 'utf8'));
    for (const oldProduct of oldProducts) {
      const newProduct = products.find(p => p.slug === oldProduct.slug);
      if (newProduct) {
        oldToNewProductIds[oldProduct.id] = newProduct.id;
        productsBySlug[oldProduct.slug] = newProduct.id;
      }
    }
    console.log(`Mapped ${Object.keys(oldToNewProductIds).length} product IDs`);
  }

  const categoriesBySlug = {};
  const categories = await prisma.category.findMany();
  categories.forEach(c => {
    categoriesBySlug[c.slug] = c.id;
  });

  // Restore product-category relationships
  const pcPath = path.join(IMPORT_DIR, `product_categories_${TIMESTAMP}.json`);
  if (fs.existsSync(pcPath)) {
    const productCategories = JSON.parse(fs.readFileSync(pcPath, 'utf8'));
    console.log(`Restoring ${productCategories.length} product-category relationships...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const pc of productCategories) {
      const productId = productsBySlug[pc.productSlug];
      const categoryId = categoriesBySlug[pc.categorySlug];
      
      if (productId && categoryId) {
        try {
          await prisma.productCategory.create({
            data: { productId, categoryId }
          });
          successCount++;
        } catch (error) {
          console.log(`Error restoring product-category: ${error.message}`);
          errorCount++;
        }
      } else {
        console.log(`Missing product (${pc.productSlug}) or category (${pc.categorySlug})`);
        errorCount++;
      }
    }
    
    console.log(`Restored ${successCount} product-category relationships (${errorCount} errors)`);
  } else {
    console.warn(`Warning: Product-category file not found at ${pcPath}`);
  }

  // Restore images
  const imagesPath = path.join(IMPORT_DIR, `images_${TIMESTAMP}.json`);
  if (fs.existsSync(imagesPath)) {
    const images = JSON.parse(fs.readFileSync(imagesPath, 'utf8'));
    console.log(`Restoring ${images.length} images...`);
    
    const imageIdMap = {};
    let successCount = 0;
    let skippedCount = 0;
    
    for (const image of images) {
      if (!image.productSlug) {
        skippedCount++;
        continue;
      }
      
      const product = await prisma.product.findUnique({
        where: { slug: image.productSlug }
      });
      
      if (product) {
        const newImage = await prisma.image.create({
          data: {
            url: image.url,
            alt: image.alt,
            order: image.order,
            productId: product.id
          }
        });
        
        // Keep track of old to new image IDs
        imageIdMap[image.id] = newImage.id;
        successCount++;
      } else {
        skippedCount++;
      }
    }
    
    console.log(`Restored ${successCount} images (${skippedCount} skipped)`);
    
    // Update main images
    console.log('Updating product main images...');
    let mainImageCount = 0;
    
    const productsPath = path.join(IMPORT_DIR, `products_${TIMESTAMP}.json`);
    if (fs.existsSync(productsPath)) {
      const oldProducts = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
      
      for (const oldProduct of oldProducts) {
        if (oldProduct.mainImageId && imageIdMap[oldProduct.mainImageId]) {
          const product = await prisma.product.findUnique({
            where: { slug: oldProduct.slug }
          });
          
          if (product) {
            await prisma.product.update({
              where: { id: product.id },
              data: { mainImageId: imageIdMap[oldProduct.mainImageId] }
            });
            mainImageCount++;
          }
        }
      }
    }
    
    console.log(`Updated ${mainImageCount} product main images`);
  } else {
    console.warn(`Warning: Images file not found at ${imagesPath}`);
  }

  // Restore tags
  const tagsPath = path.join(IMPORT_DIR, `tags_${TIMESTAMP}.json`);
  if (fs.existsSync(tagsPath)) {
    const tags = JSON.parse(fs.readFileSync(tagsPath, 'utf8'));
    console.log(`Restoring ${tags.length} tags...`);
    
    for (const tag of tags) {
      await prisma.tag.create({
        data: {
          ...tag,
          id: undefined
        }
      });
    }
  }

  // Map tag names to IDs
  const tagsByName = {};
  const tags = await prisma.tag.findMany();
  tags.forEach(t => {
    tagsByName[t.name] = t.id;
  });

  // Restore product tags
  const productTagsPath = path.join(IMPORT_DIR, `product_tags_${TIMESTAMP}.json`);
  if (fs.existsSync(productTagsPath)) {
    const productTags = JSON.parse(fs.readFileSync(productTagsPath, 'utf8'));
    console.log(`Restoring ${productTags.length} product-tag relationships...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const pt of productTags) {
      const productId = productsBySlug[pt.productSlug];
      const tagId = tagsByName[pt.tagName];
      
      if (productId && tagId) {
        try {
          await prisma.productTag.create({
            data: { productId, tagId }
          });
          successCount++;
        } catch (error) {
          console.log(`Error restoring product-tag: ${error.message}`);
          errorCount++;
        }
      }
    }
    
    console.log(`Restored ${successCount} product-tag relationships (${errorCount} errors)`);
  }

  // Restore sources
  const sourcesPath = path.join(IMPORT_DIR, `sources_${TIMESTAMP}.json`);
  if (fs.existsSync(sourcesPath)) {
    const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
    console.log(`Restoring ${sources.length} sources...`);
    
    for (const source of sources) {
      await prisma.source.create({
        data: {
          ...source,
          id: undefined
        }
      });
    }
  }

  // Map source names to IDs
  const sourcesByName = {};
  const sources = await prisma.source.findMany();
  sources.forEach(s => {
    sourcesByName[s.name] = s.id;
  });

  // Update products with source IDs
  console.log('Updating product sources...');
  let updatedSources = 0;
  
  const productsWithSources = products.filter(p => p.sourceId);
  for (const product of productsWithSources) {
    const oldSourceId = product.sourceId;
    const oldSource = sources.find(s => s.id === oldSourceId);
    
    if (oldSource && sourcesByName[oldSource.name]) {
      await prisma.product.update({
        where: { id: product.id },
        data: { sourceId: sourcesByName[oldSource.name] }
      });
      updatedSources++;
    }
  }
  
  console.log(`Updated ${updatedSources} product sources`);

  // Restore badges
  const badgesPath = path.join(IMPORT_DIR, `badges_${TIMESTAMP}.json`);
  if (fs.existsSync(badgesPath)) {
    const badges = JSON.parse(fs.readFileSync(badgesPath, 'utf8'));
    console.log(`Restoring ${badges.length} badges...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const badge of badges) {
      const productId = productsBySlug[badge.productSlug];
      
      if (productId) {
        try {
          await prisma.badge.create({
            data: {
              label: badge.label,
              productId
            }
          });
          successCount++;
        } catch (error) {
          console.log(`Error restoring badge: ${error.message}`);
          errorCount++;
        }
      }
    }
    
    console.log(`Restored ${successCount} badges (${errorCount} errors)`);
  }

  // Restore product documents
  const documentsPath = path.join(IMPORT_DIR, `product_documents_${TIMESTAMP}.json`);
  if (fs.existsSync(documentsPath)) {
    const documents = JSON.parse(fs.readFileSync(documentsPath, 'utf8'));
    console.log(`Restoring ${documents.length} product documents...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const doc of documents) {
      const productId = productsBySlug[doc.productSlug];
      
      if (productId) {
        try {
          await prisma.productDocument.create({
            data: {
              url: doc.url,
              type: doc.type,
              notes: doc.notes,
              productId,
              uploadedAt: new Date(doc.uploadedAt)
            }
          });
          successCount++;
        } catch (error) {
          console.log(`Error restoring document: ${error.message}`);
          errorCount++;
        }
      }
    }
    
    console.log(`Restored ${successCount} product documents (${errorCount} errors)`);
  }

  console.log('\n🎉 Restore completed successfully!');
  console.log('\nTo restore product images, run:');
  console.log('  node scripts/restore-images.js');
}

restoreData()
  .catch(e => {
    console.error('Error during restore:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 