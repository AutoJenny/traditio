# Traditio Site Build Checklist (Modelled on https://www.modants.co.uk/)

**IMPORTANT: Coders must follow this checklist in order, without seeking further permission or instructions unless a step is ambiguous or blocked. Do not ask the project owner for next steps if the checklist is clear.**

## 0. General Instructions
- [ ] For each section/component below, **first** closely examine the equivalent on https://www.modants.co.uk/ (using browser dev tools for layout, dimensions, transitions, and JS behaviors).
- [ ] Document findings in the 'Component-by-Component Reference' section of the style guide **before** starting implementation.
- [ ] Only begin implementation after the analysis/documentation step is complete and reviewed.

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
- [ ] Implement hero section: large, minimal, headline ("FRENCH ANTIQUES & VINTAGE"), CTA
- [ ] Implement Shop Collection CTA
- [ ] Implement featured product grid (matches reference site layout and hover effects)
- [ ] Implement category navigation (All, Decorative, Garden, Lighting, Mirrors, Rugs, Seating, Storage, Tables)
- [ ] Implement newsletter signup (as in footer)

---

## 4. Shop/Showroom Page
- [ ] **ANALYZE:** Examine and document the reference site's shop/showroom grid, category filter, product card, and pagination in the style guide.
- [ ] Implement responsive product grid (masonry/flex, matches reference site)
- [ ] Implement category filter (sidebar or top, with JS animation)
- [ ] Implement product card: image, title, price, SOLD badge, hover effect (zoom/shadow)
- [ ] Implement pagination or infinite scroll

---

## 5. Product Detail Page
- [ ] **ANALYZE:** Examine and document the reference site's product detail page (gallery, info, add to cart, delivery info, social share, related products) in the style guide.
- [ ] Implement image gallery (main image + thumbnails)
- [ ] Implement product info: title, price, description, dimensions, condition, origin, SOLD badge
- [ ] Implement add to cart (disabled if sold)
- [ ] Implement delivery info (expandable/collapsible section)
- [ ] Implement social share (Facebook, Twitter, Pinterest)
- [ ] Implement related products ("See all Decorative" or similar)

---

## 6. Other Pages
- [ ] **ANALYZE:** Examine and document the reference site's About, Contact, Blog, and static content pages in the style guide.
- [ ] Implement About: brand story, philosophy, images
- [ ] Implement Contact: contact form, address, map, hours
- [ ] Implement Blog: list of posts, each with image, title, excerpt, read more
- [ ] Implement Viewings, Delivery, Returns, Privacy, Reviews: static content pages

---

## 7. Components & Styling
- [ ] **ANALYZE:** Examine and document all reusable components (buttons, cards, badges, forms, category nav) in the style guide.
- [ ] Implement buttons: match reference site for size, hover, transitions
- [ ] Implement cards: match reference site for shadow, border, spacing
- [ ] Implement badges: SOLD, etc.
- [ ] Implement forms: newsletter, contact, validation

---

## 8. UX & Animations
- [ ] **ANALYZE:** Examine and document all hover/active/focus transitions, expand/collapse sections, and cart feedback in the style guide.
- [ ] Implement all hover/active/focus transitions as per reference site (timing, scale, color)
- [ ] Implement expand/collapse sections (e.g., delivery info)
- [ ] Implement cart feedback (add to cart, update count)

---

## 9. Technical
- [ ] **ANALYZE:** Examine and document the reference site's responsive breakpoints, accessibility, SEO/meta, and performance optimizations in the style guide.
- [ ] Implement responsive breakpoints as per reference site
- [ ] Implement accessibility (alt text, keyboard nav, ARIA labels)
- [ ] Implement SEO/meta (semantic HTML, meta tags, Open Graph)
- [ ] Implement performance (image optimization, lazy load)

---

## 10. QA & Launch
- [ ] Desktop and mobile responsiveness
- [ ] Cross-browser testing
- [ ] Content review for style/branding consistency
- [ ] Start local dev server for review

---

# Component-by-Component Breakdown (see separate document for details)
- [ ] For each component, ensure the analysis/documentation step is complete in the style guide before implementation.
- [ ] Document every component (nav, card, button, badge, form, etc.) with screenshots, CSS/JS notes, and exact dimensions/animations as implemented on the reference site.

---

**Update [DATE]:**
- Logo image (traditio_logo.png) is now present in public directory and referenced on homepage.
- Image optimization setup in progress. 