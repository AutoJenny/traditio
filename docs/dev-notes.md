## NOTE: Prisma is no longer used (2025-05-12)
- All database access, migrations, and seeding are now handled via raw SQL and the `pg` package.
- The Prisma schema, client, and migration tools have been fully removed from the project.
- All future DB changes should be made by editing migration SQL files directly and updating scripts as needed.
- Migration SQL files are stored in prisma/migrations/ for convenience, but are applied manually using psql (Prisma tooling is not used).

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

- Admin product list: Edit is a blue button, Delete is a trash icon button that sends a DELETE request (not a PUT) to /api/products/[slug].

- Product enquiry form now includes pageUrl (page source) in the message payload, and the API stores it in the Message table. This matches the contact form and helps track the source of each enquiry.

# Database Schema (as of latest dump)

## Customer
- id (integer, PK)
- name (text)
- email (text, unique)
- phone (text)
- newsletter (boolean, default false)
- created (timestamp, default NOW())
- updated (timestamp, default NOW())

## Message
- id (integer, PK)
- customerId (integer, FK to Customer)
- content (text)
- created (timestamp, default NOW())
- updated (timestamp, default NOW())
- productSlug (text, nullable)
- pageUrl (text, nullable)
- status (text, default 'unread')

- [2024-05-13] Hardened product image update flow: backend now rejects updates that would remove all images, and frontend warns/prevents saving if no images are present. This prevents accidental image loss during product updates.
- [2024-05-13] Improved admin product image upload: after uploading an image, the page now auto-saves the image order/state to the backend, making the flow foolproof and preventing accidental image loss or state mismatch. 