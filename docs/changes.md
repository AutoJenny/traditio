## 2025-05-12
- Fixed enquiry form backend: messages are now associated with products by productId, not productSlug.
- Updated Prisma schema to add productId relation to Message model.
- Ran migration and reset database to apply schema changes.
- Deleted all old/corrupt Prisma migration scripts to avoid confusion and future issues.
- Generated a new baseline migration (`baseline.sql`) reflecting the current live database structure.
- Created a full SQL backup of the database before making any changes, stored in `prisma/exports/`.
- The project is now ready for safe, reliable future migrations.
- Manually created Customer and Message tables in the database to support the contact form, due to Prisma migration drift. This is a temporary workaround until migration history is rebuilt.
- Migrated Product-Category relationship to pure many-to-many: dropped categoryId from Product, all relationships now via ProductCategory join table, and updated seed script accordingly. See changes.log for details.
- Added DELETE handler to /api/products/[slug] for soft-deleting products (sets status='deleted').
- Admin product list: Edit button is now a small blue circle with a pen icon instead of text.
- Show Deleted checkbox now works: API supports ?showDeleted=1 to include deleted products; frontend refetches accordingly.
- Product enquiry API (/api/enquiry) now stores pageUrl (page source) with each message, matching the contact form. This allows admins to see which product page the enquiry was sent from.

## 2024-05-13
- Fixed admin product category persistence: robust backend join table update, correct frontend mapping, CORS, and logging. See changes.log for details. 
- Fixed showroom category filtering: updated frontend logic to use cat.category.slug, matching the API response structure so category filtering now works as expected.
- Restored DnD image management UI to admin product images page: drag-and-drop reordering, alt text editing, image upload, and save functionality are now available again. See changes.log for details.

## 2024-05-13
- Fixed admin product category persistence: robust backend join table update, correct frontend mapping, CORS, and logging. See changes.log for details. 