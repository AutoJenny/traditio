import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await prisma.category.createMany({
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

  // Fetch categories with IDs
  const cats = await prisma.category.findMany();
  const catMap = Object.fromEntries(cats.map(c => [c.slug, c.id]));

  // Create products
  await prisma.product.createMany({
    data: [
      // Decorative
      { slug: 'vintage-vase', title: 'Vintage French Vase', description: 'A beautiful hand-painted vase.', price: 120, categoryId: catMap['decorative'] },
      { slug: 'bronze-statue', title: 'Bronze Art Deco Statue', description: 'Elegant 1920s bronze statue.', price: 340, categoryId: catMap['decorative'] },
      { slug: 'gilded-frame', title: 'Gilded Frame', description: 'Ornate 19th-century frame.', price: 95, categoryId: catMap['decorative'] },
      { slug: 'rare-buddha', title: 'Rare Buddha', description: 'A unique and rare Buddha statue for testing.', price: 999, categoryId: catMap['decorative'], featured: true },
      // Garden
      { slug: 'stone-birdbath', title: 'Stone Birdbath', description: 'Classic garden birdbath.', price: 210, categoryId: catMap['garden'] },
      { slug: 'iron-garden-bench', title: 'Iron Garden Bench', description: 'Victorian-style bench.', price: 450, categoryId: catMap['garden'] },
      { slug: 'terracotta-pot', title: 'Large Terracotta Pot', description: 'Handmade terracotta.', price: 60, categoryId: catMap['garden'] },
      // Lighting
      { slug: 'crystal-chandelier', title: 'Crystal Chandelier', description: 'Sparkling French chandelier.', price: 1200, categoryId: catMap['lighting'] },
      { slug: 'brass-lamp', title: 'Brass Table Lamp', description: 'Classic brass lamp.', price: 180, categoryId: catMap['lighting'] },
      { slug: 'industrial-sconce', title: 'Industrial Wall Sconce', description: 'Vintage industrial sconce.', price: 75, categoryId: catMap['lighting'] },
      // Mirrors
      { slug: 'ornate-mirror', title: 'Ornate Gold Mirror', description: 'Large gilded mirror.', price: 350, categoryId: catMap['mirrors'] },
      { slug: 'art-nouveau-mirror', title: 'Art Nouveau Mirror', description: 'Curved wood frame.', price: 220, categoryId: catMap['mirrors'] },
      { slug: 'trumeau-mirror', title: 'Trumeau Mirror', description: 'Antique French trumeau.', price: 480, categoryId: catMap['mirrors'] },
      // Rugs
      { slug: 'persian-rug', title: 'Persian Rug', description: 'Hand-knotted wool rug.', price: 900, categoryId: catMap['rugs'] },
      { slug: 'kilim-runner', title: 'Kilim Runner', description: 'Colorful kilim runner.', price: 320, categoryId: catMap['rugs'] },
      { slug: 'aubusson-tapestry', title: 'Aubusson Tapestry', description: 'French tapestry panel.', price: 1100, categoryId: catMap['rugs'] },
      // Seating
      { slug: 'louis-xvi-chair', title: 'Louis XVI Chair', description: 'Carved wood, upholstered.', price: 600, categoryId: catMap['seating'] },
      { slug: 'bistro-stool', title: 'Paris Bistro Stool', description: 'Classic French bistro stool.', price: 130, categoryId: catMap['seating'] },
      { slug: 'velvet-sofa', title: 'Velvet Sofa', description: 'Plush velvet 3-seater.', price: 1500, categoryId: catMap['seating'] },
      // Storage
      { slug: 'armoire', title: 'French Armoire', description: '19th-century oak armoire.', price: 2100, categoryId: catMap['storage'] },
      { slug: 'vintage-trunk', title: 'Vintage Steamer Trunk', description: 'Leather and brass trunk.', price: 390, categoryId: catMap['storage'] },
      { slug: 'bookcase', title: 'Carved Bookcase', description: 'Tall carved bookcase.', price: 800, categoryId: catMap['storage'] },
      // Tables
      { slug: 'marble-console', title: 'Marble Console Table', description: 'Louis XV style console.', price: 950, categoryId: catMap['tables'] },
      { slug: 'farmhouse-table', title: 'Farmhouse Dining Table', description: 'Rustic oak table.', price: 1800, categoryId: catMap['tables'] },
      { slug: 'side-table', title: 'Round Side Table', description: 'Small round side table.', price: 220, categoryId: catMap['tables'] },
      // More for variety
      { slug: 'bamboo-plant-stand', title: 'Bamboo Plant Stand', description: 'Art Deco plant stand.', price: 140, categoryId: catMap['decorative'] },
      { slug: 'garden-urn', title: 'Cast Iron Garden Urn', description: 'Heavy cast iron urn.', price: 320, categoryId: catMap['garden'] },
      { slug: 'opaline-lamp', title: 'Opaline Glass Lamp', description: 'French opaline lamp.', price: 260, categoryId: catMap['lighting'] },
      { slug: 'triptych-mirror', title: 'Triptych Mirror', description: 'Three-panel mirror.', price: 410, categoryId: catMap['mirrors'] },
      { slug: 'moroccan-rug', title: 'Moroccan Rug', description: 'Handwoven Moroccan rug.', price: 780, categoryId: catMap['rugs'] },
      { slug: 'club-chair', title: 'Leather Club Chair', description: 'Classic leather club chair.', price: 950, categoryId: catMap['seating'] },
      { slug: 'wine-cabinet', title: 'Wine Cabinet', description: 'French wine storage.', price: 1200, categoryId: catMap['storage'] },
      { slug: 'nesting-tables', title: 'Nesting Tables', description: 'Set of three tables.', price: 330, categoryId: catMap['tables'] },
    ],
    skipDuplicates: true,
  });

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