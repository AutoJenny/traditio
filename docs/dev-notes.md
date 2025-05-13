## NOTE: Prisma is no longer used (2025-05-12)
- All database access, migrations, and seeding are now handled via raw SQL and the `pg` package.
- The Prisma schema, client, and migration tools have been fully removed from the project.
- All future DB changes should be made by editing migration SQL files directly and updating scripts as needed.

## Migration Policy (2025-05-12)
- All old/corrupt Prisma migration scripts have been deleted.
- A new `baseline.sql` migration was generated to match the current live database structure.
- Always create a full SQL backup with `pg_dump` before any migration or schema changes.
- Never run `prisma migrate reset`, `db push --force-reset`, or similar destructive commands on production or valuable data.
- All future migrations should be created from this baseline.

## Database Seeding (2025-05-13)
- Prisma is no longer used in this project. All seeding and DB access is now via raw SQL and the `pg` package.
- To reseed the database, run `ts-node scripts/seed_db.ts` (or `node scripts/seed_db.js` if compiled).
- This script will clear and repopulate the Category, Product, Image, and ProductCategory tables using the JSON files in the project root.

- /api/products/[slug] now supports DELETE for soft-deleting products (status='deleted').

# IMPORTANT: Always use port 3000 for dev server
- If port 3000 is blocked, stop the process using it and restart the dev server.
- Never use or spawn alternate ports (e.g., 3001) for development. This causes confusion and bugs.
- Always ensure http://localhost:3000 is the only active dev server. 