import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Categories
  const categories = [
    { slug: 'all', name: 'All' },
    { slug: 'decorative', name: 'Decorative' },
    { slug: 'garden', name: 'Garden' },
    { slug: 'lighting', name: 'Lighting' },
    { slug: 'mirrors', name: 'Mirrors' },
    { slug: 'rugs', name: 'Rugs' },
    { slug: 'seating', name: 'Seating' },
    { slug: 'storage', name: 'Storage' },
    { slug: 'tables', name: 'Tables' },
  ];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Products
  const products = [
    {
      slug: 'antique-oak-table',
      title: 'Antique Oak Table',
      description: 'A beautiful antique oak table, perfect for any dining room.',
      price: 1200,
      status: 'available',
      category: { connect: { slug: 'tables' } },
      featured: true,
      images: {
        create: [
          { url: '/images/products/oak-table-1.jpg', alt: 'Antique Oak Table' },
          { url: '/images/products/oak-table-2.jpg', alt: 'Antique Oak Table - Detail' },
        ],
      },
      dimensions: '180cm x 90cm x 75cm',
      condition: 'Excellent',
      origin: 'Scotland',
      period: '19th Century',
    },
    {
      slug: 'vintage-armchair',
      title: 'Vintage Armchair',
      description: 'A comfortable vintage armchair with original upholstery.',
      price: 650,
      status: 'sold',
      category: { connect: { slug: 'seating' } },
      featured: false,
      images: {
        create: [
          { url: '/images/products/armchair-1.jpg', alt: 'Vintage Armchair' },
        ],
      },
      dimensions: '80cm x 75cm x 100cm',
      condition: 'Good',
      origin: 'England',
      period: 'Early 20th Century',
    },
    {
      slug: 'gilded-mirror',
      title: 'Gilded Mirror',
      description: 'A large gilded mirror with ornate frame.',
      price: 950,
      status: 'available',
      category: { connect: { slug: 'mirrors' } },
      featured: true,
      images: {
        create: [
          { url: '/images/products/gilded-mirror-1.jpg', alt: 'Gilded Mirror' },
        ],
      },
      dimensions: '120cm x 180cm',
      condition: 'Restored',
      origin: 'France',
      period: 'Late 19th Century',
    },
    {
      slug: 'rare-buddha',
      title: 'Rare Buddha',
      description: 'A rare Buddha statue, perfect for collectors and interior design.',
      price: 2200,
      status: 'available',
      category: { connect: { slug: 'decorative' } },
      featured: true,
      images: {
        create: [
          { url: '/images/products/test/IMG_1603.jpeg', alt: 'Rare Buddha - Angle 1' },
          { url: '/images/products/test/IMG_1604.jpeg', alt: 'Rare Buddha - Angle 2' },
          { url: '/images/products/test/IMG_1606.jpeg', alt: 'Rare Buddha - Angle 3' },
          { url: '/images/products/test/IMG_1607.jpeg', alt: 'Rare Buddha - Angle 4' },
        ],
      },
      dimensions: '30cm x 20cm x 15cm',
      condition: 'Excellent',
      origin: 'Asia',
      period: 'Unknown',
    },
  ];
  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 