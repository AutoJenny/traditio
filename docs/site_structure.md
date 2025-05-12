# Traditio Next.js Site: Technical Structure Overview

This document provides a technical overview of the Traditio Next.js site to help new developers quickly understand the codebase, routing, backend integration, and static assets.

---

## 1. Directory Structure

```
traditio-next-site/
├── src/
│   ├── app/                # Main Next.js app directory (App Router)
│   │   ├── page.tsx        # Homepage route (/)
│   │   ├── layout.tsx      # Root layout for all pages
│   │   ├── globals.css     # Global styles (imported in layout)
│   │   ├── page.module.css # Homepage-specific styles
│   │   ├── about/          # /about static route
│   │   │   └── page.tsx
│   │   ├── blog/           # /blog static route
│   │   │   └── page.tsx
│   │   ├── contact/        # /contact static route
│   │   │   └── page.tsx
│   │   ├── delivery/       # /delivery static route
│   │   │   └── page.tsx
│   │   ├── privacy/        # /privacy static route
│   │   │   └── page.tsx
│   │   ├── returns/        # /returns static route
│   │   │   └── page.tsx
│   │   ├── reviews/        # /reviews static route
│   │   │   └── page.tsx
│   │   ├── viewings/       # /viewings static route
│   │   │   └── page.tsx
│   │   ├── showroom/       # /showroom static route and dynamic product pages
│   │   │   ├── page.tsx    # /showroom (uses ProductGrid, sort dropdown, category filter)
│   │   │   └── [slug]/     # /showroom/[slug] dynamic route
│   │   │       └── page.tsx  # Product detail page (interactive gallery, modal zoom, related products via ProductGrid)
│   │   ├── components/         # Shared React components (e.g., ProductGrid, Button, Badge)
│   │   └── api/            # API routes (Next.js Route Handlers)
│   │       ├── products/
│   │       │   ├── route.ts      # /api/products (GET: list featured products)
│   │       │   └── [slug]/
│   │       │       └── route.ts  # /api/products/[slug] (GET: product detail)
│   │       └── categories/
│   │           └── route.ts      # /api/categories (GET: list categories)
│   └── generated/
│       └── prisma/         # Auto-generated Prisma client and types
├── lib/
│   └── prisma.ts           # Prisma client singleton
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # DB seeding script
│   └── migrations/         # DB migration history
├── public/
│   ├── images/
│   │   ├── products/       # Product images (organized by folder)
│   │   └── site/           # Site-wide images (e.g., logo)
│   └── ...                 # Other static assets (SVGs, CSS, etc.)
├── package.json
├── next.config.ts
├── tsconfig.json
└── ...
```

---

## 2. Routing Overview

### Static Pages
- `/`           → `src/app/page.tsx`
- `/about`      → `src/app/about/page.tsx`
- `/blog`       → `src/app/blog/page.tsx`
- `/contact`    → `src/app/contact/page.tsx`
- `/delivery`   → `src/app/delivery/page.tsx`
- `/privacy`    → `src/app/privacy/page.tsx`
- `/returns`    → `src/app/returns/page.tsx`
- `/reviews`    → `src/app/reviews/page.tsx`
- `/viewings`   → `src/app/viewings/page.tsx`
- `/showroom`   → `src/app/showroom/page.tsx` (uses ProductGrid, sort dropdown, category filter)

### Dynamic Pages
- `/showroom/[slug]` → `src/app/showroom/[slug]/page.tsx`
  - Displays product details for a given slug.
  - Features interactive image gallery, modal zoom, improved layout/UX, and related products (ProductGrid)

### API Endpoints (Route Handlers)
- `/api/products`         → `src/app/api/products/route.ts` (GET: list featured products)
- `/api/products/[slug]`  → `src/app/api/products/[slug]/route.ts` (GET: product detail + related)
- `/api/categories`       → `src/app/api/categories/route.ts` (GET: list categories)

### Admin Pages
- `/admin/products/[slug]/images` → Admin image management stub page (upload, reorder, set main, alt, delete coming soon)
- `/admin/products/[slug]` → **Tabbed admin product edit page** (file: `src/app/admin/products/[slug]/page.tsx`)
  - Features a tabbed interface with the following tabs:
    - **Source**: (Planned) Acquisition source, date, price, provenance, and document upload
    - **Description**: Title, price, status, categories, description, dimensions, condition, origin, period
    - **Images**: Image summary and link to image management
    - **Sale**: (Planned) Sale details and workflow
  - Tab switching is handled in React state; each tab displays its relevant form or summary.

---

## 3. Backend Integration

- **Prisma ORM** is used for database access.
  - Prisma client is instantiated in `lib/prisma.ts` (singleton pattern for hot-reloading).
  - Database schema is defined in `prisma/schema.prisma`.
  - Migrations are tracked in `prisma/migrations/`.
  - Seed data can be added via `prisma/seed.ts`.
  - The generated Prisma client is in `src/generated/prisma/`.

- **API Route Handlers** (in `src/app/api/`) use Prisma to fetch and return data as JSON.

---

## 4. Static Assets

- All static assets are in `public/`.
  - Product images: `public/images/products/`
  - Site images (e.g., logo): `public/images/site/`
  - SVGs, CSS, and other assets are also in `public/`.

---

## 5. Styling

- **Global styles**: `src/app/globals.css` (imported in `layout.tsx`)
- **Component/page styles**: CSS modules (e.g., `page.module.css`)
- **Tailwind CSS**: Used throughout for utility-first styling (see `tailwind.config.js`)
- **ProductGrid component**: Used for all product grids (homepage, showroom, related products, admin list). Handles layout, hover effects, SOLD badge display, and links to product detail.
- **SOLD badge**: Appears on product cards in all grids when product is sold (top right, all-caps, bold, muted or red, matches reference site).
- **Sort dropdown**: Right-aligned in showroom header, subtle/transparent, faint underline, blends with theme, no label, SHOWROOM heading centered.

---

## 6. Key Conventions

- **App Router**: Uses the new Next.js app directory structure (`src/app/`).
- **Each route** is a folder with a `page.tsx` file (and optionally a `layout.tsx`).
- **API endpoints** are colocated in `src/app/api/` using route handlers.
- **Dynamic routes** use `[param]` folder syntax.
- **Prisma** is the only DB access layer; never import Prisma client directly except via `lib/prisma.ts`.
- **Static assets** are always referenced from `/public`.

---

## 7. Getting Started for New Developers

1. `cd traditio-next-site`
2. `npm install`
3. `npm run dev` (starts on http://localhost:3000)
4. Edit files in `src/app/` to add or change routes/pages.
5. For backend/API changes, edit files in `src/app/api/` and/or `prisma/`.
6. For DB changes, update `prisma/schema.prisma`, run `npx prisma migrate dev`, and update seed data as needed.

---

## 8. Useful References
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs/)

---

For further questions, see the README or ask a maintainer. 