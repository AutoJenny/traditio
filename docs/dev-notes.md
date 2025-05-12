## Migration Policy (2025-05-12)
- All old/corrupt Prisma migration scripts have been deleted.
- A new `baseline.sql` migration was generated to match the current live database structure.
- Always create a full SQL backup with `pg_dump` before any migration or schema changes.
- Never run `prisma migrate reset`, `db push --force-reset`, or similar destructive commands on production or valuable data.
- All future migrations should be created from this baseline. 