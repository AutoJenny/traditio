# Traditio Interiors – Web Style Guide

## 🎨 Colour Palette

| Name            | Hex       | Use                            |
|-----------------|-----------|---------------------------------|
| **Ivory**       | `#F8F5F0` | Background, sections           |
| **Deep Espresso** | `#3A2E2B` | Text, logo, accents             |
| **Muted Sand**  | `#D6CFC6` | Section dividers, cards        |
| **Antique Brass** | `#BFA07A` | Highlights, buttons hover       |
| **Soft Clay**   | `#A28E7D` | Subtle accents, icons          |

## 🖋 Typography

- **Primary Font (Headings)**: `Playfair Display`  
  *Elegant, serifed, great for large text and titles*

- **Secondary Font (Body)**: `Inter`  
  *Clean, legible, contemporary sans-serif*

## 🧱 Layout & Structure

- **Container Width:** Max `1200px`, padded `24px` each side (desktop), ~16px (mobile)
- **Grid:** 12-column responsive grid system, 3–4 columns desktop, 2 tablet, 1 mobile
- **Breakpoints:**
  - Desktop: ≥1200px
  - Tablet: ~768–1199px
  - Mobile: <768px
- **Whitespace:** Generous `32px–64px` vertical spacing between sections, `24px` horizontal padding
- **Navigation:** Sticky top bar, logo left, minimal links right, height ~64px
- **Footer:** Full width, max content width matches container, top: newsletter/contact, bottom: legal links
- **Section Spacing:** ~64px desktop, ~32px mobile
- **Card min-width:** ~280-320px
- **Hero height:** ~60vh
- **Button padding:** ~12px 24px
- **Font sizes:** Headings ~2-3rem, body ~1-1.2rem

## 🖼 Imagery Style

- Natural textures (linen, wood grain, stone)  
- Lifestyle photos in soft light, warm shadows  
- Objects isolated or in refined interior scenes  

## 🧩 Components

### Buttons

- Default: Espresso text on Sand background  
- Hover: Inverted (Espresso background, Ivory text)  
- Style: Rounded corners `4px`, Padding `12px 24px`, Font: Inter bold  

### Cards

- Light shadow: `box-shadow: 0 2px 4px rgba(0,0,0,0.05)`  
- Background: Sand with `6px` border radius  

### Forms

- Minimal borders: `1px solid #D6CFC6`  
- Labels in small caps, Playfair Display, muted tone  

## 🌐 UX Interactions

- Subtle fade-ins and scroll animations (Framer Motion / CSS `@keyframes`)  
- Smooth transitions (`scroll-behavior: smooth`)  
- Mobile: Hamburger menu with soft expand animation

## Reference Site Layout & Component Mapping (modants.co.uk)

**Global Layout & Structure Analysis:**
- **Container & Grid:**
  - Max width: ~1200px (centered, auto margins)
  - Side padding: ~24px desktop, ~16px mobile
  - Grid: 3–4 columns desktop, 2 tablet, 1 mobile
  - Gutter: ~32px desktop, ~16px mobile
- **Breakpoints:**
  - Desktop: ≥1200px
  - Tablet: ~768–1199px
  - Mobile: <768px
- **Header/Nav:**
  - Height: ~64px
  - Sticky on scroll
  - Logo left, nav links center/right, account/cart right
  - Mobile: Hamburger menu, slide-down nav
- **Footer:**
  - Full width, max content width matches container
  - Top: newsletter signup, contact info
  - Bottom: legal links, copyright
- **Spacing:**
  - Section vertical spacing: ~64px desktop, ~32px mobile
  - Card vertical margin: ~32px
  - Button padding: 12px 24px
- **Typography:**
  - Headings: 2.5–3rem (hero), 1.5–2rem (section)
  - Body: 1–1.2rem
- **Transitions:**
  - All interactive elements (nav links, buttons, cards) use 200–300ms ease-in-out transitions
- **Other:**
  - Images: Responsive, object-fit: cover, lazy loaded
  - Accessibility: Alt text on all images, focus states on links/buttons
  - All images must use Next.js <Image /> for optimization and lazy loading. Do not use <img> tags.

### Layout
- **Container max-width:** ~1200px
- **Grid gap:** ~24-32px
- **Card min-width:** ~280-320px
- **Hero height:** ~60vh
- **Button padding:** ~12px 24px
- **Font sizes:** Headings ~2-3rem, body ~1-1.2rem
- **Navigation height:** ~64px
- **Footer padding:** ~32px top/bottom

### Navigation
- Logo left, links (Home, About, Showroom, Blog, Viewings, Delivery, Contact), account (Sign In/My Account), cart (icon with count)
- Hover: underline or color change, 200-300ms ease-in-out

### Footer
- Contact details, address, phone, email, hours
- Newsletter signup: input + button, privacy note
- Legal links

### Homepage
- Hero: Large headline, minimal, centered, CTA button
- Featured grid: Product cards, 3-4 per row, image hover zoom/raise
- Category nav: Horizontal, all-caps, active state

### Product Grid (Shop/Showroom)
- Responsive, masonry/flex
- Card: Image, title, price, SOLD badge, hover effect (scale/shadow)
- Category filter: Sidebar/top, animated
- Pagination/infinite scroll

### Product Detail
- Gallery: Main image + thumbnails
- Info: Title, price, description, dimensions, condition, origin, SOLD badge
- Add to cart: prominent, disabled if sold
- Delivery info: expandable/collapsible
- Social share: Facebook, Twitter, Pinterest
- Related products

### Other Pages
- About: Story, philosophy, images
- Contact: Form, address, map, hours
- Blog: List, image, title, excerpt
- Static: Viewings, Delivery, Returns, Privacy, Reviews

### Components
- **Buttons:**
  - Default: Espresso text on Sand background (Traditio colors)
  - Hover: Inverted, scale up 1.05, 200ms
  - Rounded corners 4px, padding 12px 24px, Inter bold
- **Cards:**
  - Shadow: 0 2px 4px rgba(0,0,0,0.05)
  - Background: Sand, border radius 6px
- **Badges:**
  - SOLD: Red or muted, all-caps, bold
- **Forms:**
  - Minimal borders, Playfair Display labels, muted tone
- **Category Nav:**
  - All-caps, active underline, 200ms

### Interactions
- All hover/active/focus transitions: 200-300ms, ease-in-out
- Expand/collapse: smooth height, 200ms
- Cart: Add feedback, update count
- Newsletter: AJAX, success/fail message
- Filter: JS, animated

### Accessibility & SEO
- Alt text, keyboard nav, ARIA labels
- Semantic HTML, meta tags, Open Graph

## Component-by-Component Reference

### Global Layout & Structure Analysis (modants.co.uk)

- [x] Navigation Bar
  - **Layout:** Full-width, max content width ~1200px, centered. Height: ~64px desktop, ~56px mobile. Logo left (links to home). Navigation links (Home, About, Showroom, Blog, Viewings, Delivery, Contact) center/right. Spacing between links: ~32px desktop, ~20px mobile. Sticky on scroll.
  - **Mobile:** Hamburger menu replaces links. Slide-down menu on open, covers full width. Logo left, cart/account right.
  - **Typography:** All-caps, letter-spacing ~0.05em. Font size: ~1.1rem desktop, ~1rem mobile. Font: Sans-serif (use Inter for Traditio).
  - **Colors:** Background: Ivory (#F8F5F0). Text: Espresso (#3A2E2B). Active link: Underline or color change (Antique Brass on hover).
  - **Transitions:** Link hover: 200ms color/underline transition, ease-in-out. Hamburger menu: 300ms slide-down.
  - **Accessibility:** All links/buttons have visible focus states.

- [x] Footer
  - **Layout:** Full-width, max content width ~1200px, centered. Top: Newsletter signup (input + button), contact info (address, phone, email, hours). Bottom: Legal links (Delivery, Contact, Returns, Privacy, Reviews), copyright. Vertical spacing: ~32px between sections.
  - **Typography:** Body: ~1rem, muted sand color for legal links. Headings: Small caps, bold.
  - **Colors:** Background: Ivory (#F8F5F0). Text: Espresso (#3A2E2B), legal links in Muted Sand (#D6CFC6).
  - **Spacing:** Padding: ~32px top/bottom. Input/button: 12px 24px.
  - **Transitions:** Button hover: 200ms color invert, ease-in-out. Link hover: 200ms underline or color change.
  - **Mobile:** Stacks vertically, full width, same padding.
  - **Accessibility:** All links/buttons have visible focus states. Inputs have labels and aria attributes.

- [ ] Hero Section
- [ ] Product Card
- [ ] Product Grid
- [ ] Product Detail Gallery
- [ ] Add to Cart Button
- [ ] SOLD Badge
- [ ] Category Navigation
- [ ] Newsletter Signup
- [ ] Contact Form
- [ ] Blog List Item
- [ ] Static Content Page
// ... add more as discovered ...

### Hero Section (Homepage)
- **Layout:** Large, minimal, centered headline. Height: ~60vh. Max width: 800px. Centered both vertically and horizontally in container.
- **Typography:** Headline: Playfair Display, 2.5–3rem, bold, uppercase. Subheadline: Inter, 1.2rem, muted sand color. CTA button: prominent, espresso on sand, bold, rounded, ~12px 24px padding.
- **Background:** Ivory or subtle sand gradient. No image or a faint texture.
- **CTA:** "Shop Collection" or similar, below headline, large and inviting.
- **Spacing:** Generous vertical padding (~64px desktop, ~32px mobile).
- **Transitions:** Button hover: invert colors, 200ms ease-in-out. Headline fade-in on load.
- **Mobile:** Headline font ~2rem, padding reduced, CTA full width.
- **Accessibility:** Headline is <h1>, button is <button> or <a> with role.

### Featured Product Grid
- **Layout:** 3–4 product cards per row (desktop), 2 (tablet), 1 (mobile). Max width: 1200px, centered. Gap: 32px desktop, 16px mobile.
- **Card:** Sand background, rounded corners, subtle shadow, image top, title, price, SOLD badge if needed. Hover: image zoom/raise, shadow intensifies.
- **Image:** Next.js <Image />, object-fit: cover, lazy loaded, alt text.
- **Spacing:** 32px vertical between grid and other sections.
- **Transitions:** Card/image hover: scale 1.03, shadow, 200ms.
- **Accessibility:** Alt text, focus state on card.

### Category Navigation
- **Layout:** Horizontal bar above grid. All-caps, Inter, spaced links. Active category underlined or brass color. Gap: 24px desktop, 12px mobile.
- **Categories:** All, Decorative, Garden, Lighting, Mirrors, Rugs, Seating, Storage, Tables.
- **Transitions:** Link hover: underline or color change, 200ms.
- **Mobile:** Scrollable horizontally, touch-friendly.
- **Accessibility:** <nav> with aria-label, focus states.

### Newsletter Signup (Homepage/Footer)
- **Layout:** Input + button, inline on desktop, stacked on mobile. Max width: 400px. Centered or left-aligned.
- **Input:** Rounded, border sand, padding 12px. Placeholder: "Your email".
- **Button:** Espresso on sand, bold, rounded, hover invert, 200ms.
- **Privacy Note:** Small, muted sand text below input.
- **Accessibility:** Input has label, button is <button> with aria-label, form has role.