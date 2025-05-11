## [Unreleased]
- Refactored product detail page (`src/app/showroom/[slug]/page.tsx`) to match the design and UX of modants.co.uk:
  - Added interactive image gallery with modal zoom and thumbnail selection.
  - Prominent title, price, badges (Featured/SOLD), and improved details section.
  - Enhanced call-to-action button and delivery info styling.
  - Improved layout, responsive design, and typography for a more elegant, modern look.
- Updated homepage and showroom product panels to link to the product detail page (`/showroom/[slug]`) using Next.js Link and the product slug.
- Fixed product detail page to fetch from `/api/products/[slug]` instead of `/api/products?slug=...` for correct product lookup and to resolve 'Product not found' errors.
- Implemented zoom and pan functionality for product detail modal images using react-zoom-pan-pinch, allowing users to explore images in greater detail. 