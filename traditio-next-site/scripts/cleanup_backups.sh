#!/bin/bash
# cleanup_backups.sh - Removes old backups while keeping important ones

BACKUP_DIR="./backups"
# Keep daily backups for 7 days
DAILY_RETENTION=7
# Keep weekly backups for 4 weeks
WEEKLY_RETENTION=4
# Keep monthly backups for 12 months
MONTHLY_RETENTION=12

echo "[$(date)] Starting backup cleanup process..."

# Delete hourly backups older than 24 hours, except the first backup of each day
find "$BACKUP_DIR" -name "db_backup_*_*.dump" -type f -mtime +1 | sort | 
  grep -v "db_backup_[0-9]\{8\}_0[0-9][0-9][0-9][0-9][0-9].dump" | xargs rm -f 2>/dev/null || true

# Keep one backup per day for the past week
find "$BACKUP_DIR" -name "db_backup_*_*.dump" -type f -mtime +$DAILY_RETENTION | sort |
  grep "db_backup_[0-9]\{8\}_0[0-9][0-9][0-9][0-9][0-9].dump" | xargs rm -f 2>/dev/null || true

# Keep one backup per week for the past month
# (Sunday backups)
find "$BACKUP_DIR" -name "db_backup_*_*.dump" -type f -mtime +$WEEKLY_RETENTION |
  grep -v "db_backup_[0-9]\{6\}0_" | xargs rm -f 2>/dev/null || true

# Keep one backup per month for the past year
# (First day of month)
find "$BACKUP_DIR" -name "db_backup_*_*.dump" -type f -mtime +$MONTHLY_RETENTION |
  grep -v "db_backup_[0-9]\{4\}01_" | xargs rm -f 2>/dev/null || true

# Clean up associated image backups using the same pattern
# (match the timestamps in the db backups that we're keeping)
DB_BACKUP_TIMESTAMPS=$(find "$BACKUP_DIR" -name "db_backup_*.dump" | sed -E 's/.*db_backup_([0-9_]+)\.dump/\1/g')

# Delete any image backups that don't have a corresponding DB backup
for IMAGE_BACKUP in $(find "$BACKUP_DIR" -name "product_images_*.tar.gz"); do
  TIMESTAMP=$(echo "$IMAGE_BACKUP" | sed -E 's/.*product_images_([0-9_]+)\.tar\.gz/\1/g')
  if ! echo "$DB_BACKUP_TIMESTAMPS" | grep -q "$TIMESTAMP"; then
    echo "Removing orphaned image backup: $IMAGE_BACKUP"
    rm -f "$IMAGE_BACKUP"
  fi
done

# Same for document backups
for DOC_BACKUP in $(find "$BACKUP_DIR" -name "product_documents_*.tar.gz"); do
  TIMESTAMP=$(echo "$DOC_BACKUP" | sed -E 's/.*product_documents_([0-9_]+)\.tar\.gz/\1/g')
  if ! echo "$DB_BACKUP_TIMESTAMPS" | grep -q "$TIMESTAMP"; then
    echo "Removing orphaned document backup: $DOC_BACKUP"
    rm -f "$DOC_BACKUP"
  fi
done

# Also clean up any export timestamp files that don't have a corresponding DB backup
for EXPORT_FILE in $(find "$BACKUP_DIR" -name "latest_export_*.txt"); do
  TIMESTAMP=$(echo "$EXPORT_FILE" | sed -E 's/.*latest_export_([0-9_]+)\.txt/\1/g')
  if ! echo "$DB_BACKUP_TIMESTAMPS" | grep -q "$TIMESTAMP"; then
    echo "Removing orphaned export file: $EXPORT_FILE"
    rm -f "$EXPORT_FILE"
  fi
done

# Count remaining backups
DB_BACKUP_COUNT=$(find "$BACKUP_DIR" -name "db_backup_*.dump" | wc -l)
IMAGE_BACKUP_COUNT=$(find "$BACKUP_DIR" -name "product_images_*.tar.gz" | wc -l)
DOC_BACKUP_COUNT=$(find "$BACKUP_DIR" -name "product_documents_*.tar.gz" | wc -l)

echo "[$(date)] Backup cleanup completed"
echo "Remaining backups: $DB_BACKUP_COUNT database, $IMAGE_BACKUP_COUNT image, $DOC_BACKUP_COUNT document backups" 