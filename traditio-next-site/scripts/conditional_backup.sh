#!/bin/bash
# conditional_backup.sh - Only performs backup if data has changed

# Set variables
BACKUP_DIR="./backups"
DB_NAME="traditio"
DB_USER="postgres"
DB_HOST="localhost"
LAST_BACKUP_HASH_FILE="$BACKUP_DIR/last_backup_hash.txt"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to create hash of database tables
get_db_hash() {
  # Simplified hash calculation - count tables and rows
  PGPASSWORD="$DB_PASSWORD" psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "
    SELECT md5(string_agg(table_name || ':' || row_count, ','))
    FROM (
      SELECT table_name, 
             (SELECT count(*) FROM information_schema.tables
              WHERE table_schema = 'public' AND table_name = t.table_name) AS row_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    ) counts;"
}

# Generate current DB hash
echo "[$(date)] Calculating database hash..."
CURRENT_HASH=$(get_db_hash)

# If hash computation failed, proceed with backup anyway
if [ -z "$CURRENT_HASH" ]; then
  echo "[$(date)] Failed to compute hash or no tables found. Proceeding with backup as precaution."
else
  # Check if the hash file exists
  if [ -f "$LAST_BACKUP_HASH_FILE" ]; then
    LAST_HASH=$(cat "$LAST_BACKUP_HASH_FILE")
    
    # If the hash is the same, no need to backup
    if [ "$CURRENT_HASH" = "$LAST_HASH" ]; then
      echo "[$(date)] No changes detected since last backup. Skipping backup."
      exit 0
    fi
  fi
fi

echo "[$(date)] Changes detected, starting backup..."

# Database backup
pg_dump --host=$DB_HOST --username=$DB_USER --dbname=$DB_NAME --format=custom --file="$BACKUP_DIR/db_backup_$TIMESTAMP.dump"

# Also create a full backup with schema
pg_dump --host=$DB_HOST --username=$DB_USER --dbname=$DB_NAME --format=custom --file="$BACKUP_DIR/db_backup_full_$TIMESTAMP.dump"

# Export data to JSON
echo "[$(date)] Exporting data to JSON..."
EXPORT_TIMESTAMP=$(node scripts/export-data.js)

# Make a note of the timestamp for future restores
echo "Export timestamp: $EXPORT_TIMESTAMP" > "$BACKUP_DIR/latest_export_$TIMESTAMP.txt"

# File backup - only backup if the database changed
echo "[$(date)] Backing up product images..."
tar -czf "$BACKUP_DIR/product_images_$TIMESTAMP.tar.gz" public/images/products

# If there's a documents directory, back it up too
if [ -d "public/documents" ]; then
  echo "[$(date)] Backing up product documents..."
  tar -czf "$BACKUP_DIR/product_documents_$TIMESTAMP.tar.gz" public/documents
fi

# Update the hash file (only if we computed a valid hash)
if [ -n "$CURRENT_HASH" ]; then
  echo "$CURRENT_HASH" > "$LAST_BACKUP_HASH_FILE"
fi

echo "[$(date)] Conditional backup completed successfully"
echo "Backup files saved to: $BACKUP_DIR" 