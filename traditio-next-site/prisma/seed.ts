import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear join table and related tables for a clean seed
  await prisma.productCategory.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // 1. Create categories
  await prisma.category.createMany({
    data: [
      { slug: 'decorative', name: 'Decorative' },
      { slug: 'garden', name: 'Garden' },
      { slug: 'lighting', name: 'Lighting' },
      { slug: 'mirrors', name: 'Mirrors' },
      { slug: 'rugs', name: 'Rugs' },
      { slug: 'seating', name: 'Seating' },
      { slug: 'storage', name: 'Storage' },
      { slug: 'tables', name: 'Tables' },
    ],
    skipDuplicates: true,
  });

  // 2. Fetch categories with IDs
  const cats = await prisma.category.findMany();
  const catMap = Object.fromEntries(cats.map(c => [c.slug, c.id]));

  // 3. Create products (NO categoryId field)
  await prisma.product.createMany({
    data: [
      { slug: 'vintage-vase', title: 'Vintage French Vase', description: 'A beautiful hand-painted vase.', price: 120 },
      { slug: 'bronze-statue', title: 'Bronze Art Deco Statue', description: 'Elegant 1920s bronze statue.', price: 340 },
      { slug: 'gilded-frame', title: 'Gilded Frame', description: 'Ornate 19th-century frame.', price: 95 },
      { slug: 'rare-buddha', title: 'Rare Buddha', description: 'A unique and rare Buddha statue for testing.', price: 999, featured: true },
      { slug: 'stone-birdbath', title: 'Stone Birdbath', description: 'Classic garden birdbath.', price: 210 },
      { slug: 'iron-garden-bench', title: 'Iron Garden Bench', description: 'Victorian-style bench.', price: 450 },
      { slug: 'terracotta-pot', title: 'Large Terracotta Pot', description: 'Handmade terracotta.', price: 60 },
      { slug: 'crystal-chandelier', title: 'Crystal Chandelier', description: 'Sparkling French chandelier.', price: 1200 },
      { slug: 'brass-lamp', title: 'Brass Table Lamp', description: 'Classic brass lamp.', price: 180 },
      { slug: 'industrial-sconce', title: 'Industrial Wall Sconce', description: 'Vintage industrial sconce.', price: 75 },
      { slug: 'ornate-mirror', title: 'Ornate Gold Mirror', description: 'Large gilded mirror.', price: 350 },
      { slug: 'art-nouveau-mirror', title: 'Art Nouveau Mirror', description: 'Curved wood frame.', price: 220 },
      { slug: 'trumeau-mirror', title: 'Trumeau Mirror', description: 'Antique French trumeau.', price: 480 },
      { slug: 'persian-rug', title: 'Persian Rug', description: 'Hand-knotted wool rug.', price: 900 },
      { slug: 'kilim-runner', title: 'Kilim Runner', description: 'Colorful kilim runner.', price: 320 },
      { slug: 'aubusson-tapestry', title: 'Aubusson Tapestry', description: 'French tapestry panel.', price: 1100 },
      { slug: 'louis-xvi-chair', title: 'Louis XVI Chair', description: 'Carved wood, upholstered.', price: 600 },
      { slug: 'bistro-stool', title: 'Paris Bistro Stool', description: 'Classic French bistro stool.', price: 130 },
      { slug: 'velvet-sofa', title: 'Velvet Sofa', description: 'Plush velvet 3-seater.', price: 1500 },
      { slug: 'armoire', title: 'French Armoire', description: '19th-century oak armoire.', price: 2100 },
      { slug: 'vintage-trunk', title: 'Vintage Steamer Trunk', description: 'Leather and brass trunk.', price: 390 },
      { slug: 'bookcase', title: 'Carved Bookcase', description: 'Tall carved bookcase.', price: 800 },
      { slug: 'marble-console', title: 'Marble Console Table', description: 'Louis XV style console.', price: 950 },
      { slug: 'farmhouse-table', title: 'Farmhouse Dining Table', description: 'Rustic oak table.', price: 1800 },
      { slug: 'side-table', title: 'Round Side Table', description: 'Small round side table.', price: 220 },
      { slug: 'bamboo-plant-stand', title: 'Bamboo Plant Stand', description: 'Art Deco plant stand.', price: 140 },
      { slug: 'garden-urn', title: 'Cast Iron Garden Urn', description: 'Heavy cast iron urn.', price: 320 },
      { slug: 'opaline-lamp', title: 'Opaline Glass Lamp', description: 'French opaline lamp.', price: 260 },
      { slug: 'triptych-mirror', title: 'Triptych Mirror', description: 'Three-panel mirror.', price: 410 },
      { slug: 'moroccan-rug', title: 'Moroccan Rug', description: 'Handwoven Moroccan rug.', price: 780 },
      { slug: 'club-chair', title: 'Leather Club Chair', description: 'Classic leather club chair.', price: 950 },
      { slug: 'wine-cabinet', title: 'Wine Cabinet', description: 'French wine storage.', price: 1200 },
      { slug: 'nesting-tables', title: 'Nesting Tables', description: 'Set of three tables.', price: 330 },
    ],
    skipDuplicates: true,
  });

  // 4. Fetch products with IDs
  const allProducts = await prisma.product.findMany();
  const productMap = Object.fromEntries(allProducts.map(p => [p.slug, p.id]));

  // 5. Define product-category relationships
  const productCategoryData = [
    { productSlug: 'vintage-vase', categorySlug: 'decorative' },
    { productSlug: 'bronze-statue', categorySlug: 'decorative' },
    { productSlug: 'gilded-frame', categorySlug: 'decorative' },
    { productSlug: 'rare-buddha', categorySlug: 'decorative' },
    { productSlug: 'bamboo-plant-stand', categorySlug: 'decorative' },
    { productSlug: 'stone-birdbath', categorySlug: 'garden' },
    { productSlug: 'iron-garden-bench', categorySlug: 'garden' },
    { productSlug: 'terracotta-pot', categorySlug: 'garden' },
    { productSlug: 'garden-urn', categorySlug: 'garden' },
    { productSlug: 'crystal-chandelier', categorySlug: 'lighting' },
    { productSlug: 'brass-lamp', categorySlug: 'lighting' },
    { productSlug: 'industrial-sconce', categorySlug: 'lighting' },
    { productSlug: 'opaline-lamp', categorySlug: 'lighting' },
    { productSlug: 'ornate-mirror', categorySlug: 'mirrors' },
    { productSlug: 'art-nouveau-mirror', categorySlug: 'mirrors' },
    { productSlug: 'trumeau-mirror', categorySlug: 'mirrors' },
    { productSlug: 'triptych-mirror', categorySlug: 'mirrors' },
    { productSlug: 'persian-rug', categorySlug: 'rugs' },
    { productSlug: 'kilim-runner', categorySlug: 'rugs' },
    { productSlug: 'aubusson-tapestry', categorySlug: 'rugs' },
    { productSlug: 'moroccan-rug', categorySlug: 'rugs' },
    { productSlug: 'louis-xvi-chair', categorySlug: 'seating' },
    { productSlug: 'bistro-stool', categorySlug: 'seating' },
    { productSlug: 'velvet-sofa', categorySlug: 'seating' },
    { productSlug: 'club-chair', categorySlug: 'seating' },
    { productSlug: 'armoire', categorySlug: 'storage' },
    { productSlug: 'vintage-trunk', categorySlug: 'storage' },
    { productSlug: 'bookcase', categorySlug: 'storage' },
    { productSlug: 'wine-cabinet', categorySlug: 'storage' },
    { productSlug: 'marble-console', categorySlug: 'tables' },
    { productSlug: 'farmhouse-table', categorySlug: 'tables' },
    { productSlug: 'side-table', categorySlug: 'tables' },
    { productSlug: 'nesting-tables', categorySlug: 'tables' },
  ];

  // 6. Create ProductCategory join entries
  for (const { productSlug, categorySlug } of productCategoryData) {
    const productId = productMap[productSlug];
    const categoryId = catMap[categorySlug];
    if (productId && categoryId) {
      console.log(`Creating join: product ${productSlug} (${productId}) -> category ${categorySlug} (${categoryId})`);
      await prisma.productCategory.create({
        data: { productId, categoryId }
      });
    } else {
      console.warn(`Missing product or category for: product ${productSlug} (${productId}), category ${categorySlug} (${categoryId})`);
    }
  }

  // Mark a few products as featured
  await prisma.product.updateMany({
    where: { slug: { in: [
      'vintage-vase',
      'crystal-chandelier',
      'ornate-mirror',
      'louis-xvi-chair',
      'armoire',
      'marble-console',
      'rare-buddha',
    ]}},
    data: { featured: true },
  });

  // Add images for Rare Buddha
  const rareBuddha = await prisma.product.findUnique({ where: { slug: 'rare-buddha' } });
  if (rareBuddha) {
    await prisma.image.createMany({
      data: [
        { url: '/images/products/test/IMG_1603.jpeg', productId: rareBuddha.id, alt: 'Rare Buddha angle 1' },
        { url: '/images/products/test/IMG_1604.jpeg', productId: rareBuddha.id, alt: 'Rare Buddha angle 2' },
        { url: '/images/products/test/IMG_1606.jpeg', productId: rareBuddha.id, alt: 'Rare Buddha angle 3' },
        { url: '/images/products/test/IMG_1607.jpeg', productId: rareBuddha.id, alt: 'Rare Buddha angle 4' },
      ],
      skipDuplicates: true,
    });
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect()); 