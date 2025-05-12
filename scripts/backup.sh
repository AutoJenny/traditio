#!/bin/bash
# backup.sh - Automates the Traditio database and file backup process
# NOTE: As of 2025-05-14, all scripts are run from the project root. Any previous references to 'traditio-next-site' now refer to the root directory.

# Set variables
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d)
DB_NAME="traditio"
DB_USER="postgres"
DB_HOST="localhost"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Database backup using pg_dump
echo "Creating database backup..."
pg_dump --host=$DB_HOST --username=$DB_USER --dbname=$DB_NAME --format=custom --file="$BACKUP_DIR/db_backup_$DATE.dump"

# Also create a full backup with schema
pg_dump --host=$DB_HOST --username=$DB_USER --dbname=$DB_NAME --format=custom --file="$BACKUP_DIR/db_backup_full_$DATE.dump"

# Export data to JSON (run Node.js script)
echo "Exporting data to JSON..."
TIMESTAMP=$(node scripts/export-data.js)

# Make a note of the timestamp for future restores
echo "Export timestamp: $TIMESTAMP" > "$BACKUP_DIR/latest_export_$DATE.txt"

# File backup
echo "Backing up product images..."
tar -czf "$BACKUP_DIR/product_images_$DATE.tar.gz" public/images/products

# Backup product documents if the directory exists
if [ -d "public/documents" ]; then
  echo "Backing up product documents..."
  tar -czf "$BACKUP_DIR/product_documents_$DATE.tar.gz" public/documents
fi

# Create a README in the backup directory
cat > "$BACKUP_DIR/README.md" << EOF
# Traditio Backup

This directory contains backups of the Traditio database and files.

## Files

- \`db_backup_DATE.dump\`: PostgreSQL data-only backup
- \`db_backup_full_DATE.dump\`: Complete PostgreSQL backup (schema + data)
- \`product_images_DATE.tar.gz\`: Archive of product images
- \`product_documents_DATE.tar.gz\`: Archive of product documents (if applicable)
- \`latest_export_DATE.txt\`: Contains the timestamp for the latest JSON export

## Restore Instructions

1. Restore the database:
   \`\`\`
   pg_restore --host=localhost --username=postgres --dbname=traditio_next --clean --no-owner --role=postgres backups/db_backup_full_YYYYMMDD.dump
   \`\`\`

2. Restore files:
   \`\`\`
   tar -xzf backups/product_images_YYYYMMDD.tar.gz -C /path/to/project
   tar -xzf backups/product_documents_YYYYMMDD.tar.gz -C /path/to/project
   \`\`\`

3. If using JSON exports, restore from the JSON export files:
   \`\`\`
   node scripts/restore-data.js TIMESTAMP
   \`\`\`
   (Get the TIMESTAMP from the latest_export_YYYYMMDD.txt file)

4. Reconnect images to products:
   \`\`\`
   node scripts/restore-images.js
   \`\`\`
EOF

echo "Backup completed: $(date)"
echo "All files saved to: $BACKUP_DIR" 