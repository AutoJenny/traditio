# Traditio Site Build Checklist (Modelled on https://www.modants.co.uk/)

**IMPORTANT: Coders must follow this checklist in order, without seeking further permission or instructions unless a step is ambiguous or blocked. Do not ask the project owner for next steps if the checklist is clear.**

## 0. General Instructions
- [x] For each section/component below, **first** closely examine the equivalent on https://www.modants.co.uk/ (using browser dev tools for layout, dimensions, transitions, and JS behaviors).
- [x] Document findings in the 'Component-by-Component Reference' section of the style guide **before** starting implementation.
- [x] Only begin implementation after the analysis/documentation step is complete and reviewed.

---

## 1. Project Setup (do these first)
- [x] Closely examine the reference site's global layout, breakpoints, and overall structure. Document in style guide.
- [x] Set up Next.js project with custom styles (Traditio palette, fonts, etc.)
- [x] Install and configure Tailwind CSS
- [x] Set up image optimization and lazy loading (logo confirmed working)

---

## 2. Core Layout
- [x] **ANALYZE:** Examine and document the reference site's top navigation and footer (layout, spacing, transitions, mobile behavior) in the style guide.
- [x] Implement top navigation: logo (left), navigation links (Home, About, Showroom, Blog, Viewings, Delivery, Contact), account (Sign In/My Account), cart (icon with item count)
- [x] Implement footer: contact details, address, phone, email, hours, newsletter signup, legal links, copyright

---

## 3. Homepage
- [x] **ANALYZE:** Examine and document the reference site's homepage (hero, featured grid, category nav, newsletter) in the style guide.
- [x] Implement hero section: large, minimal, headline ("FRENCH ANTIQUES & VINTAGE"), CTA
- [x] Implement Shop Collection CTA
- [x] Implement featured product grid (matches reference site layout and hover effects)
- [x] Grid now fetches and displays only featured products from the backend API, replacing placeholder content. (2024-05-13)
- [x] Implement category navigation (All, Decorative, Garden, Lighting, Mirrors, Rugs, Seating, Storage, Tables)
- [x] Implement newsletter signup (as in footer)

---

## 4. Shop/Showroom Page
- [x] **ANALYZE:** Examine and document the reference site's shop/showroom grid, category filter, product card, and pagination in the style guide.
- [x] Implement responsive product grid (masonry/flex, matches reference site)
- [x] Implement category filter (sidebar or top, with JS animation)
- [x] Implement product card: image, title, price, SOLD badge, hover effect (zoom/shadow)
- [x] Implement pagination or infinite scroll

---

## 5. Product Detail Page
- [x] **ANALYZE:** Examine and document the reference site's product detail page (gallery, info, add to cart, delivery info, social share, related products) in the style guide.
- [x] Implement image gallery (main image + thumbnails)
- [x] Implement product info: title, price, description, dimensions, condition, origin, SOLD badge
- [x] Implement add to cart (disabled if sold)
- [x] Implement delivery info (expandable/collapsible section)
- [x] Implement social share (Facebook, Twitter, Pinterest)
- [x] Implement related products ("See all Decorative" or similar)

---

## 6. Other Pages
- [x] **ANALYZE:** Examine and document the reference site's About, Contact, Blog, and static content pages in the style guide.
- [x] Implement About: brand story, philosophy, images
- [x] Implement Contact: contact form, address, map, hours
- [x] Implement Blog: list of posts, each with image, title, excerpt, read more
- [x] Implement Viewings, Delivery, Returns, Privacy, Reviews: static content pages

---

## 7. Components & Styling
- [x] **ANALYZE:** Examine and document all reusable components (buttons, cards, badges, forms, category nav) in the style guide.
- [x] Implement buttons: match reference site for size, hover, transitions
- [x] Implement cards: match reference site for shadow, border, spacing
- [x] Implement badges: SOLD, etc.
- [x] Implement forms: newsletter, contact, validation

---

## 8. UX & Animations
- [x] **ANALYZE:** Examine and document all hover/active/focus transitions, expand/collapse sections, and cart feedback in the style guide.
- [x] Implement all hover/active/focus transitions as per reference site (timing, scale, color)
- [x] Implement expand/collapse sections (e.g., delivery info)
- [x] Implement cart feedback (add to cart, update count)

---

## 9. Technical
- [x] **ANALYZE:** Examine and document the reference site's responsive breakpoints, accessibility, SEO/meta, and performance optimizations in the style guide.
- [x] Implement responsive breakpoints as per reference site
- [x] Implement accessibility (alt text, keyboard nav, ARIA labels)
- [x] Implement SEO/meta (semantic HTML, meta tags, Open Graph)
- [x] Implement performance (image optimization, lazy load)

---

## 10. QA & Launch
- [ ] Desktop and mobile responsiveness
- [ ] Cross-browser testing
- [ ] Content review for style/branding consistency
- [ ] Start local dev server for review

---

# Component-by-Component Breakdown (see separate document for details)
- [x] For each component, ensure the analysis/documentation step is complete in the style guide before implementation.
- [x] Document every component (nav, card, button, badge, form, etc.) with screenshots, CSS/JS notes, and exact dimensions/animations as implemented on the reference site.

---

**Update [DATE]:**
- Logo image (traditio_logo.png) is now present in public directory and referenced on homepage.
- Image optimization setup in progress. 