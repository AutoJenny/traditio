## 2025-05-12
- Fixed enquiry form backend: messages are now associated with products by productId, not productSlug.
- Updated Prisma schema to add productId relation to Message model.
- Ran migration and reset database to apply schema changes.
- Deleted all old/corrupt Prisma migration scripts to avoid confusion and future issues.
- Generated a new baseline migration (`baseline.sql`) reflecting the current live database structure.
- Created a full SQL backup of the database before making any changes, stored in `prisma/exports/`.
- The project is now ready for safe, reliable future migrations. 