// scripts/export-data.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const EXPORT_DIR = path.join(process.cwd(), 'prisma/exports');

async function exportData() {
  console.log('Starting data export...');
  
  // Ensure export directory exists
  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
  }

  // Get timestamp for filenames
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  // Export products with slugs
  const products = await prisma.product.findMany();
  fs.writeFileSync(
    path.join(EXPORT_DIR, `products_${timestamp}.json`),
    JSON.stringify(products, null, 2)
  );
  console.log(`Exported ${products.length} products`);

  // Export categories with slugs
  const categories = await prisma.category.findMany();
  fs.writeFileSync(
    path.join(EXPORT_DIR, `categories_${timestamp}.json`),
    JSON.stringify(categories, null, 2)
  );
  console.log(`Exported ${categories.length} categories`);

  // Export product-category relationships with both IDs and slugs for robust mapping
  const productCategories = await prisma.productCategory.findMany({
    include: {
      product: { select: { slug: true } },
      category: { select: { slug: true } }
    }
  });
  
  // Transform to include both IDs and slugs
  const pcWithSlugs = productCategories.map(pc => ({
    productId: pc.productId,
    categoryId: pc.categoryId,
    productSlug: pc.product.slug,
    categorySlug: pc.category.slug
  }));
  
  fs.writeFileSync(
    path.join(EXPORT_DIR, `product_categories_${timestamp}.json`),
    JSON.stringify(pcWithSlugs, null, 2)
  );
  console.log(`Exported ${pcWithSlugs.length} product-category relationships`);

  // Export images with both IDs and slugs
  const images = await prisma.image.findMany({
    include: {
      product: { select: { slug: true } }
    }
  });
  
  // Transform to include product slugs
  const imagesWithSlugs = images.map(img => ({
    id: img.id,
    url: img.url,
    alt: img.alt,
    order: img.order,
    productId: img.productId,
    productSlug: img.product?.slug || null
  }));
  
  fs.writeFileSync(
    path.join(EXPORT_DIR, `images_${timestamp}.json`),
    JSON.stringify(imagesWithSlugs, null, 2)
  );
  console.log(`Exported ${imagesWithSlugs.length} images`);

  // Export other tables
  const tags = await prisma.tag.findMany();
  fs.writeFileSync(
    path.join(EXPORT_DIR, `tags_${timestamp}.json`),
    JSON.stringify(tags, null, 2)
  );
  console.log(`Exported ${tags.length} tags`);

  const productTags = await prisma.productTag.findMany({
    include: {
      product: { select: { slug: true } },
      tag: { select: { name: true } }
    }
  });
  
  const ptWithNames = productTags.map(pt => ({
    productId: pt.productId,
    tagId: pt.tagId,
    productSlug: pt.product.slug,
    tagName: pt.tag.name
  }));
  
  fs.writeFileSync(
    path.join(EXPORT_DIR, `product_tags_${timestamp}.json`),
    JSON.stringify(ptWithNames, null, 2)
  );
  console.log(`Exported ${ptWithNames.length} product-tag relationships`);

  const sources = await prisma.source.findMany();
  fs.writeFileSync(
    path.join(EXPORT_DIR, `sources_${timestamp}.json`),
    JSON.stringify(sources, null, 2)
  );
  console.log(`Exported ${sources.length} sources`);

  // Export badges
  const badges = await prisma.badge.findMany({
    include: {
      product: { select: { slug: true } }
    }
  });
  
  const badgesWithSlugs = badges.map(badge => ({
    id: badge.id,
    label: badge.label,
    productId: badge.productId,
    productSlug: badge.product.slug
  }));
  
  fs.writeFileSync(
    path.join(EXPORT_DIR, `badges_${timestamp}.json`),
    JSON.stringify(badgesWithSlugs, null, 2)
  );
  console.log(`Exported ${badgesWithSlugs.length} badges`);

  // Export product documents
  const documents = await prisma.productDocument.findMany({
    include: {
      product: { select: { slug: true } }
    }
  });
  
  const documentsWithSlugs = documents.map(doc => ({
    id: doc.id,
    url: doc.url,
    type: doc.type,
    uploadedAt: doc.uploadedAt,
    notes: doc.notes,
    productId: doc.productId,
    productSlug: doc.product.slug
  }));
  
  fs.writeFileSync(
    path.join(EXPORT_DIR, `product_documents_${timestamp}.json`),
    JSON.stringify(documentsWithSlugs, null, 2)
  );
  console.log(`Exported ${documentsWithSlugs.length} product documents`);

  console.log(`\nData export completed! All files saved to ${EXPORT_DIR}`);
  console.log(`Timestamp: ${timestamp}`);
  
  // Print timestamp to stdout for scripts that capture it
  process.stdout.write(timestamp);
  return timestamp;
}

// If running directly (not required by another script)
if (require.main === module) {
  exportData()
    .catch(e => {
      console.error('Error exporting data:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
} else {
  // If required as a module, export the function
  module.exports = exportData;
} 