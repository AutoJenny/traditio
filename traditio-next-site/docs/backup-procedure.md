# Database Backup & Restore Procedures

This document outlines the recommended procedures for backing up and restoring the Traditio database and associated files.

## Backup Procedure

### 1. Database Backup

#### Option 1: Using pg_dump (Recommended)

```bash
# Connect to the database and create a full backup with data only (no schema)
pg_dump --host=localhost --username=postgres --dbname=traditio_next --format=custom --data-only --file=backup_$(date +%Y%m%d).dump

# For a complete backup including schema
pg_dump --host=localhost --username=postgres --dbname=traditio_next --format=custom --file=backup_full_$(date +%Y%m%d).dump
```

#### Option 2: Using Prisma Export (JSON Format)

Create a script to export all records to JSON files:

```javascript
// scripts/export-data.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const EXPORT_DIR = path.join(process.cwd(), 'prisma/exports');

async function exportData() {
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

  // Export categories with slugs
  const categories = await prisma.category.findMany();
  fs.writeFileSync(
    path.join(EXPORT_DIR, `categories_${timestamp}.json`),
    JSON.stringify(categories, null, 2)
  );

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

  // Export other tables
  const tags = await prisma.tag.findMany();
  fs.writeFileSync(
    path.join(EXPORT_DIR, `tags_${timestamp}.json`),
    JSON.stringify(tags, null, 2)
  );

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

  const sources = await prisma.source.findMany();
  fs.writeFileSync(
    path.join(EXPORT_DIR, `sources_${timestamp}.json`),
    JSON.stringify(sources, null, 2)
  );

  console.log(`Data exported to ${EXPORT_DIR}`);
}

exportData()
  .catch(e => {
    console.error('Error exporting data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 2. File Backup

Back up all product images and documents:

```bash
# Backup product images
tar -czf product_images_$(date +%Y%m%d).tar.gz public/images/products

# Backup product documents (if applicable)
tar -czf product_documents_$(date +%Y%m%d).tar.gz public/documents
```

### 3. Automated Backup Script

Create a shell script for automating the backup process:

```bash
#!/bin/bash
# backup.sh

# Set variables
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d)
DB_NAME="traditio_next"
DB_USER="postgres"
DB_HOST="localhost"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Database backup
echo "Creating database backup..."
pg_dump --host=$DB_HOST --username=$DB_USER --dbname=$DB_NAME --format=custom --file="$BACKUP_DIR/db_backup_$DATE.dump"

# Export data to JSON (run Node.js script)
echo "Exporting data to JSON..."
node scripts/export-data.js

# File backup
echo "Backing up product images..."
tar -czf "$BACKUP_DIR/product_images_$DATE.tar.gz" public/images/products

echo "Backup completed: $(date)"
```

### 4. Hourly Conditional Backups

To set up hourly backups that only run when the database has changed, create a new script:

```bash
#!/bin/bash
# conditional_backup.sh - Only performs backup if data has changed

# Set variables
BACKUP_DIR="./backups"
DB_NAME="traditio_next"
DB_USER="postgres"
DB_HOST="localhost"
LAST_BACKUP_HASH_FILE="$BACKUP_DIR/last_backup_hash.txt"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to create hash of database tables
get_db_hash() {
  # Get MD5 hashes of row counts and last updated timestamps
  PGPASSWORD="$DB_PASSWORD" psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "
    SELECT md5(string_agg(concat(table_name, ':', cnt, ':', last_update), ',')) 
    FROM (
      SELECT 
        tables.table_name, 
        (SELECT count(*) FROM \"${tables.table_name}\") as cnt,
        COALESCE(
          (SELECT max(\"updatedAt\") FROM \"${tables.table_name}\" WHERE \"updatedAt\" IS NOT NULL),
          '1970-01-01'
        ) as last_update
      FROM information_schema.tables AS tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY tables.table_name
    ) t;"
}

# Generate current DB hash
CURRENT_HASH=$(get_db_hash)

# Check if the hash file exists
if [ -f "$LAST_BACKUP_HASH_FILE" ]; then
  LAST_HASH=$(cat "$LAST_BACKUP_HASH_FILE")
  
  # If the hash is the same, no need to backup
  if [ "$CURRENT_HASH" = "$LAST_HASH" ]; then
    echo "[$(date)] No changes detected since last backup. Skipping backup."
    exit 0
  fi
fi

echo "[$(date)] Changes detected, starting backup..."

# Database backup
pg_dump --host=$DB_HOST --username=$DB_USER --dbname=$DB_NAME --format=custom --file="$BACKUP_DIR/db_backup_$TIMESTAMP.dump"

# Export data to JSON
node scripts/export-data.js

# File backup - only backup if the database changed
tar -czf "$BACKUP_DIR/product_images_$TIMESTAMP.tar.gz" public/images/products

# If there's a documents directory, back it up too
if [ -d "public/documents" ]; then
  tar -czf "$BACKUP_DIR/product_documents_$TIMESTAMP.tar.gz" public/documents
fi

# Update the hash file
echo "$CURRENT_HASH" > "$LAST_BACKUP_HASH_FILE"

echo "[$(date)] Conditional backup completed"
```

#### Setting Up a Cron Job for Hourly Backups

To run the conditional backup every hour, add a cron job:

```bash
# Edit crontab
crontab -e

# Add this line to run the backup script hourly
0 * * * * cd /path/to/your/project && ./scripts/conditional_backup.sh >> ./backups/backup.log 2>&1
```

This cron job will:
1. Run at the start of every hour (0 * * * *)
2. Change to your project directory
3. Run the conditional backup script
4. Log both standard output and errors to backup.log

#### Backup Rotation and Cleanup

To prevent backups from consuming too much disk space, create a cleanup script:

```bash
#!/bin/bash
# cleanup_backups.sh - Removes old backups while keeping important ones

BACKUP_DIR="./backups"
# Keep daily backups for 7 days
DAILY_RETENTION=7
# Keep weekly backups for 4 weeks
WEEKLY_RETENTION=4
# Keep monthly backups for 12 months
MONTHLY_RETENTION=12

# Delete hourly backups older than 24 hours, except the first backup of each day
find "$BACKUP_DIR" -name "db_backup_*_*.dump" -type f -mtime +1 | sort | 
  grep -v "db_backup_[0-9]\{8\}_0[0-9][0-9][0-9][0-9][0-9].dump" | xargs rm -f

# Keep one backup per day for the past week
find "$BACKUP_DIR" -name "db_backup_*_*.dump" -type f -mtime +$DAILY_RETENTION | sort |
  grep "db_backup_[0-9]\{8\}_0[0-9][0-9][0-9][0-9][0-9].dump" | xargs rm -f

# Keep one backup per week for the past month
# (Sunday backups)
find "$BACKUP_DIR" -name "db_backup_*_*.dump" -type f -mtime +$WEEKLY_RETENTION |
  grep -v "db_backup_[0-9]\{6\}0_" | xargs rm -f

# Keep one backup per month for the past year
# (First day of month)
find "$BACKUP_DIR" -name "db_backup_*_*.dump" -type f -mtime +$MONTHLY_RETENTION |
  grep -v "db_backup_[0-9]\{4\}01_" | xargs rm -f

echo "[$(date)] Backup cleanup completed"
```

Add this script to your crontab to run daily:

```bash
# Run cleanup at 3 AM every day
0 3 * * * cd /path/to/your/project && ./scripts/cleanup_backups.sh >> ./backups/backup.log 2>&1
```

## Restore Procedure

### 1. Database Restore

#### Option 1: Using pg_restore (Recommended)

```bash
# For a complete restore (schema and data)
pg_restore --host=localhost --username=postgres --dbname=traditio_next --clean --no-owner --role=postgres backup_full_YYYYMMDD.dump

# For data-only restore (assumes schema exists)
pg_restore --host=localhost --username=postgres --dbname=traditio_next --data-only --no-owner --role=postgres backup_YYYYMMDD.dump
```

#### Option 2: Using Prisma and JSON Exports

Create a restore script:

```javascript
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
  process.exit(1);
}

async function restoreData() {
  console.log(`Restoring data from exports with timestamp: ${TIMESTAMP}`);

  // Clear existing data
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
  }

  // Map old IDs to new IDs
  const oldToNewProductIds = {};
  const products = await prisma.product.findMany();
  const productsPath = path.join(IMPORT_DIR, `products_${TIMESTAMP}.json`);
  if (fs.existsSync(productsPath)) {
    const oldProducts = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    for (const oldProduct of oldProducts) {
      const newProduct = products.find(p => p.slug === oldProduct.slug);
      if (newProduct) {
        oldToNewProductIds[oldProduct.id] = newProduct.id;
      }
    }
  }

  // Restore product-category relationships
  const pcPath = path.join(IMPORT_DIR, `product_categories_${TIMESTAMP}.json`);
  if (fs.existsSync(pcPath)) {
    const productCategories = JSON.parse(fs.readFileSync(pcPath, 'utf8'));
    console.log(`Restoring ${productCategories.length} product-category relationships...`);
    
    // Get all products and categories by slug
    const productsBySlug = {};
    const products = await prisma.product.findMany();
    products.forEach(p => {
      productsBySlug[p.slug] = p.id;
    });
    
    const categoriesBySlug = {};
    const categories = await prisma.category.findMany();
    categories.forEach(c => {
      categoriesBySlug[c.slug] = c.id;
    });
    
    for (const pc of productCategories) {
      const productId = productsBySlug[pc.productSlug];
      const categoryId = categoriesBySlug[pc.categorySlug];
      
      if (productId && categoryId) {
        try {
          await prisma.productCategory.create({
            data: { productId, categoryId }
          });
        } catch (error) {
          console.log(`Error restoring product-category: ${error.message}`);
        }
      }
    }
  }

  // Restore images
  const imagesPath = path.join(IMPORT_DIR, `images_${TIMESTAMP}.json`);
  if (fs.existsSync(imagesPath)) {
    const images = JSON.parse(fs.readFileSync(imagesPath, 'utf8'));
    console.log(`Restoring ${images.length} images...`);
    
    const imageIdMap = {};
    
    for (const image of images) {
      if (!image.productSlug) continue;
      
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
      }
    }
    
    // Update main images
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
          }
        }
      }
    }
  }

  // TODO: Restore other entities (tags, sources, etc.) using the same pattern

  console.log('Restore completed!');
}

restoreData()
  .catch(e => {
    console.error('Error during restore:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 2. File Restore

```bash
# Restore product images
tar -xzf product_images_YYYYMMDD.tar.gz -C /path/to/project

# Restore product documents
tar -xzf product_documents_YYYYMMDD.tar.gz -C /path/to/project
```

### 3. Images and Database Synchronization

After restoring both the database and files, run the image restoration script to ensure all product-image relationships are correctly established:

```bash
node scripts/restore-images.js
```

## Special Handling for Problematic Data

### Handling Escaped Characters in Data

Some database records may contain special characters that cause issues during export/import, particularly when using JSON line-by-line format. For example, a product with dimensions like `6\" high` (with an escaped quote) may fail to parse correctly.

In such cases, you can create specialized scripts to handle these records:

```javascript
// Example script for handling a specific problematic product
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixProblematicRecord() {
  await prisma.product.upsert({
    where: { slug: 'problematic-product-slug' },
    update: {
      // Fixed data with properly handled special characters
      dimensions: '6" high', // Quotes handled properly
      // other fields...
    },
    create: {
      slug: 'problematic-product-slug',
      title: 'Product Title',
      description: 'Product description',
      // other required fields...
      dimensions: '6" high',
    }
  });
}

fixProblematicRecord()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

For more systematic handling, you can improve your export/import scripts to better handle special characters:

1. Use `JSON.stringify(data, null, 2)` to create properly escaped JSON
2. Alternatively, use a robust format like JSONL with proper escaping
3. Consider using a library like `csv-parser` for complex data exports

## Best Practices

1. **Regular Backups**: Schedule backups to run automatically at least once daily.

2. **Multiple Backup Methods**: Use both SQL dumps and JSON exports for redundancy.

3. **Version Control**: Keep database schema changes in version control.

4. **Test Restores**: Regularly test the restore process to ensure backups are viable.

5. **Offsite Copies**: Store backups in multiple locations (local, cloud storage, etc.).

6. **Slug-Based References**: When possible, use slugs rather than IDs to reference related entities to make restores more robust.

7. **Document Changes**: Keep a log of significant database changes to aid in troubleshooting restore issues.

## Troubleshooting

### Foreign Key Constraint Failures

When encountering foreign key constraint errors during restore:

1. Ensure you restore tables in the correct order (dependencies first).
2. For pg_restore, use the `--disable-triggers` option if necessary.
3. Use the JSON export/import method with slug-based references for more robust restores.

### Missing Images After Restore

1. Verify that both the image files and database references were backed up.
2. Run the `restore-images.js` script to reconnect images to products based on directory names.
3. Check the database for orphaned image records (those without a valid productId).

### JSON Parse Errors

If encountering JSON parse errors during restore:

1. Check for special characters in your data that might not be properly escaped.
2. Consider using more robust parsing methods or libraries.
3. Create separate scripts for handling problematic records with special characters.

### Testing Your Backup/Restore Process

To ensure your backup and restore process works correctly:

1. Create a backup using the procedures above.
2. Set up a test environment or database.
3. Restore to the test environment.
4. Verify data integrity by checking record counts, relationships, and a sample of records.
5. Test application functionality to ensure all restored data works properly. 