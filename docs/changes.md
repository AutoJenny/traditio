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
- All Customer and Message field names now match live DB schema (content, created, updated, etc). Admin/messages page and API now work. New DB dump created and docs updated with schema reference.
- Admin messages UI: Page column now shows only the last part of the URL (e.g., art-nouveau-mirror_109). Product column displays the main product image as a thumbnail if available, otherwise falls back to the slug text.
- Admin message detail UI: Product panel is now aligned right with title, large image, price, and 'Added: <date>' in 'ago' format. Message content is now displayed on a white background for clarity.
- Hardened product image update flow: backend now rejects updates that would remove all images, and frontend warns/prevents saving if no images are present. See changes.log for details.
- Improved admin product image upload: after uploading an image, the page now auto-saves the image order/state to the backend, making the flow foolproof and preventing accidental image loss or state mismatch. See changes.log for details.
- Added admin Database page: a fourth link on the admin dashboard now leads to a page that lists all tables and fields in the database, using a new /api/db endpoint. See changes.log for details.

## 2024-05-13
- Fixed admin product category persistence: robust backend join table update, correct frontend mapping, CORS, and logging. See changes.log for details. 
- Fixed showroom category filtering: updated frontend logic to use cat.category.slug, matching the API response structure so category filtering now works as expected.
- Restored DnD image management UI to admin product images page: drag-and-drop reordering, alt text editing, image upload, and save functionality are now available again. See changes.log for details.

## 2024-05-14
- Fixed admin messages blank view bug: updated /api/messages and /api/messages/[id] endpoints to select created/updated (no createdAt/updatedAt anywhere), matching UI expectations and the live DB schema. Messages now display correctly when clicked in the admin panel.

## 2024-05-13
- Fixed admin product category persistence: robust backend join table update, correct frontend mapping, CORS, and logging. See changes.log for details. 