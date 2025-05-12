import { prisma } from '../lib/prisma';

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function migrateSlugs() {
  const products = await prisma.product.findMany();
  for (const product of products) {
    const newSlug = `${slugify(product.title)}_${product.id}`;
    if (product.slug !== newSlug) {
      await prisma.product.update({ where: { id: product.id }, data: { slug: newSlug } });
      console.log(`Updated product ${product.id}: ${product.slug} -> ${newSlug}`);
    }
  }
  console.log('Migration complete.');
  await prisma.$disconnect();
}

migrateSlugs().catch(e => { console.error(e); process.exit(1); }); 