# Mandy Dennis Art -- Portfolio Website Design

## Overview

A portfolio website for artist Mandy Dennis to showcase her artwork, take commission enquiries, and promote upcoming events. The site must be dead-simple for a non-technical user (phone-only, no code) to manage day-to-day content.

## Key Constraints

- **User:** Mandy is non-technical (phone + Facebook only). Every content task must be as simple as posting to Facebook.
- **Budget:** Free hosting and tooling. Custom domain (`mandydennis.art`) to be added later.
- **Maintainer:** Tom handles technical issues; Mandy self-serves for content (artwork, events, pricing).
- **Scale:** Starting with ~50 artworks, growing to 200+.
- **Security:** Sanity Studio access restricted to invited members only.

## Tech Stack

| Layer       | Choice                    | Why                                                      |
|-------------|---------------------------|----------------------------------------------------------|
| Framework   | React 19 + Vite + TypeScript | Fast builds, modern tooling                            |
| Styling     | Tailwind CSS v4           | Rapid UI development, responsive out of the box          |
| CMS         | Sanity (free tier)        | Single service for content + images, great mobile UX     |
| Hosting     | Netlify (free tier)       | Auto-deploy, free SSL, easy custom domain                |
| Forms       | Netlify Forms (free)      | 100 submissions/month, no backend needed                 |

### Why Sanity (not Decap CMS + Cloudinary)

- **One service:** Content management + image hosting + image transforms in one place
- **No rebuild delay:** Content changes appear instantly (fetched at runtime, not build-time)
- **Better mobile UX:** Sanity Studio is polished and phone-friendly
- **Simpler setup:** No Netlify Identity, no Git Gateway, no Cloudinary account needed
- **Free tier:** 3 users, 5GB assets, 500GB bandwidth -- more than enough

## Pages

### 1. Home
- Hero section with Mandy's name and tagline (from Sanity settings)
- Featured artwork grid (pulls items marked as "featured")
- CTA buttons: "View Gallery" and "Commissions"

### 2. Gallery
- Masonry grid layout (CSS columns: 1/2/3 at mobile/tablet/desktop)
- **Cascading tag filters:** Unified row of toggleable tag buttons combining medium + subject. When a tag is active, the grid filters and the tag bar hides tags with zero matches in the current selection. Multiple tags use AND logic to progressively narrow results.
- Tags are predefined in the Sanity schema (Mandy picks from a list, doesn't type freeform)
- **Lightbox:** Click/tap any image to open fullscreen overlay with:
  - Title, description, and tags below the image
  - Left/right navigation via on-screen arrows, keyboard arrows, and mobile swipe
  - Navigates through the currently filtered set (not all artwork)
  - Close via X button, Escape key, or clicking outside

### 3. Commissions
- Commission categories with structured pricing tables
- Currency symbol rendered from site settings (currently £, easily changeable)
- Add-ons, included items, and notes per category
- Enquiry form (Netlify Forms) with: name, email, preferred medium, details, optional reference image

### 4. Events
- Upcoming events sorted by date (nearest first)
- Past events auto-move to "Past Events" section with reduced opacity
- Each event: title, date (formatted en-GB), location, description, optional link

### 5. About
- Bio text rendered as Markdown
- Optional photo (from Sanity with image transforms)
- Optional Facebook link (from site settings)

## Sanity Content Types (Schemas)

### Artwork
| Field       | Type              | Required | Notes                              |
|-------------|-------------------|----------|------------------------------------|
| title       | string            | yes      |                                    |
| slug        | slug (from title) | yes      | Auto-generated                     |
| image       | image (hotspot)   | yes      | Uploaded via Sanity Studio         |
| description | text              | no       | Optional caption                   |
| medium      | array of string   | yes      | Predefined list (select widget)    |
| subject     | array of string   | yes      | Predefined list (select widget)    |
| featured    | boolean           | no       | Show on homepage (default: false)  |
| date        | date              | yes      | Auto-filled to today               |

**Medium options:** pastel, watercolour, pencil, oil, charcoal, mixed media, acrylic, ink
**Subject options:** pets, dogs, cats, horses, people, landscape, still life, wildlife, flowers, buildings

### Event
| Field       | Type           | Required | Notes                              |
|-------------|----------------|----------|------------------------------------|
| title       | string         | yes      |                                    |
| slug        | slug           | yes      |                                    |
| date        | date           | yes      |                                    |
| location    | string         | yes      |                                    |
| description | text           | yes      |                                    |
| link        | url            | no       | External link for more info        |

### Commission Category (collection -- one entry per type of work)
| Field       | Type             | Required | Notes                                          |
|-------------|------------------|----------|-------------------------------------------------|
| title       | string           | yes      | e.g. "Pet portraits in pastels"                 |
| slug        | slug             | yes      |                                                 |
| options     | array of objects | yes      | Each: size (string), description (string), price (number) |
| addons      | array of objects | no       | Each: description (string), price (number)      |
| included    | text             | no       | What's included, e.g. "basic frame and mount"   |
| notes       | text             | no       | Caveats, e.g. "Extra for P&P if required"       |

Prices are stored as numbers. The currency symbol is rendered from Site Settings.

### Site Settings (singleton)
| Field           | Type   | Required | Notes                              |
|-----------------|--------|----------|------------------------------------|
| tagline         | string | yes      | Shown in hero                      |
| contact_email   | email  | yes      | Where form submissions go          |
| facebook_url    | url    | no       |                                    |
| currency_symbol | string | yes      | e.g. "£" -- used for all prices   |

### About (singleton)
| Field       | Type           | Required | Notes                              |
|-------------|----------------|----------|------------------------------------|
| bio         | text           | yes      | Rendered as Markdown               |
| photo       | image (hotspot)| no       |                                    |

## Mandy's Day-to-Day Workflows

### Adding artwork
1. Open Sanity Studio on phone (mandydennis-art.sanity.studio)
2. Log in (saved in browser)
3. Tap "Artwork" > "+" (new)
4. Upload photo from camera roll
5. Type a title (slug auto-generates)
6. Tap medium tags from dropdown
7. Tap subject tags from dropdown
8. Optionally toggle "Featured on Homepage"
9. Tap "Publish"
10. Changes appear on site immediately (no rebuild)

### Adding an event
1. Open Studio > Events > New
2. Fill in title, date, location, description
3. Publish

### Updating commission prices
1. Open Studio > Commission Pricing > select category
2. Edit prices/options
3. Publish

## Responsive Design

- **Fully responsive across all devices** -- mobile, tablet, and desktop are all first-class
- Built mobile-first in CSS, polished at every breakpoint
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Gallery: 1 / 2 / 3 columns
- Navigation: hamburger menu on mobile, horizontal nav on desktop
- All touch targets min 44px for phone usability
- Lightbox: swipe on touch devices, keyboard/mouse on desktop
- Tag filter bar: wraps naturally, scrollable on very small screens
