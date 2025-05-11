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

- Container Width: Max `1200px`, padded `24px` each side  
- Grid: 12-column responsive grid system  
- Whitespace: Generous `32px–64px` spacing  
- Navigation: Sticky top bar with logo left, minimal links right  

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

**General Principle:**
- All layouts, spacings, and interactions (including hover, transitions, and JS behaviors) should match https://www.modants.co.uk/ exactly, except for Traditio's own palette and fonts.

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

(For each component, document: screenshot, exact dimensions, CSS/JS notes, and any deviations from reference site)

- [ ] Navigation Bar
- [ ] Footer
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