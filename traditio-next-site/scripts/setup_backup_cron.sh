#!/bin/bash
# setup_backup_cron.sh - Sets up cron jobs for database backups

# Get the absolute path to the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="$PROJECT_DIR/backups"
SCRIPTS_DIR="$PROJECT_DIR/scripts"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Make sure all scripts are executable
chmod +x "$SCRIPTS_DIR/conditional_backup.sh" "$SCRIPTS_DIR/cleanup_backups.sh"

# Create a temporary file for the new crontab
TEMP_CRONTAB=$(mktemp)

# Export existing crontab
crontab -l > "$TEMP_CRONTAB" 2>/dev/null || echo "# Traditio backup cron jobs" > "$TEMP_CRONTAB"

# Check if our cron jobs already exist
if ! grep -q "conditional_backup.sh" "$TEMP_CRONTAB"; then
  # Add hourly conditional backup
  echo "# Traditio hourly conditional backup" >> "$TEMP_CRONTAB"
  echo "0 * * * * cd $PROJECT_DIR && DB_PASSWORD=\$DB_PASSWORD $SCRIPTS_DIR/conditional_backup.sh >> $BACKUP_DIR/backup.log 2>&1" >> "$TEMP_CRONTAB"
  echo "# ⚠️ NOTE: Replace \$DB_PASSWORD with your actual database password" >> "$TEMP_CRONTAB"
  echo "" >> "$TEMP_CRONTAB"
fi

if ! grep -q "cleanup_backups.sh" "$TEMP_CRONTAB"; then
  # Add daily cleanup job
  echo "# Traditio daily backup cleanup (runs at 3 AM)" >> "$TEMP_CRONTAB"
  echo "0 3 * * * cd $PROJECT_DIR && $SCRIPTS_DIR/cleanup_backups.sh >> $BACKUP_DIR/backup.log 2>&1" >> "$TEMP_CRONTAB"
  echo "" >> "$TEMP_CRONTAB"
fi

# Display the new crontab
echo "==== New crontab configuration ===="
cat "$TEMP_CRONTAB"
echo "=================================="

# Ask for confirmation before installing
read -p "Do you want to install these cron jobs? (y/n) " -n 1 -r
echo    # move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]; then
  # Install the new crontab
  crontab "$TEMP_CRONTAB"
  echo "Cron jobs have been installed!"
  echo "⚠️ IMPORTANT: Make sure to edit your crontab manually to set your database password:"
  echo "  crontab -e"
  echo "And replace \$DB_PASSWORD with your actual PostgreSQL password."
else
  echo "Cron job installation canceled."
fi

# Clean up
rm "$TEMP_CRONTAB"

echo "To verify your cron jobs, run: crontab -l" 