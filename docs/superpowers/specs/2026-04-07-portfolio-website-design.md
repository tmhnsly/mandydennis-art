# Mandy Dennis Art -- Portfolio Website Design

## Overview

A portfolio website for artist Mandy Dennis to showcase her artwork, take commission enquiries, and promote upcoming events. The site must be dead-simple for a non-technical user (phone-only, no code) to manage day-to-day content.

## Key Constraints

- **User:** Mandy is non-technical (phone + Facebook only). Every content task must be as simple as posting to Facebook.
- **Budget:** Free hosting and tooling. Custom domain (`mandydennis.art`) to be added later.
- **Maintainer:** Tom handles technical issues; Mandy self-serves for content (artwork, events, pricing).
- **Scale:** Starting with ~50 artworks, growing to 200+.
- **Security:** Admin panel locked to Mandy's account only. No public registration.

## Tech Stack

| Layer       | Choice                  | Why                                                    |
|-------------|-------------------------|--------------------------------------------------------|
| Framework   | React + Vite + TypeScript | Already in place, fast builds, modern tooling         |
| Styling     | Tailwind CSS            | Rapid UI development, responsive out of the box        |
| CMS         | Decap CMS (open source) | Free, Git-based, visual admin panel, phone-friendly    |
| Hosting     | Netlify (free tier)     | Auto-deploy on content changes, free SSL, easy domains |
| Images      | Cloudinary (free tier)  | Auto-optimise/resize, 25GB storage, phone uploads      |
| Forms       | Netlify Forms (free)    | 100 submissions/month, no backend needed               |
| Auth        | Netlify Identity (free) | Invite-only login for Mandy, secures `/admin`          |

## Pages

### 1. Home
- Hero section with Mandy's name and tagline
- Featured artwork grid (pulls items marked as "featured" in CMS)
- Quick links to commissions and events
- Brief intro/welcome text

### 2. Gallery
- Masonry grid layout displaying all artwork
- **Cascading tag filters:** a row of toggleable tag buttons. When a tag is active, the grid filters and the tag bar dynamically shows only tags that exist on the remaining visible artworks. e.g. clicking "Pets" narrows the grid and surfaces related tags like "Dogs", "Cats", "Pastel". Multiple tags can be active at once to progressively narrow results. Tags with zero matches in the current filter are hidden, keeping the UI clean.
- Tags are predefined in the CMS config (Mandy picks from a list, doesn't type freeform)
- All tag types (medium + subject) shown in one unified filter bar -- no need for Mandy or visitors to think about "categories" of tags
- **Lightbox:** Click/tap any image to open in a tasteful lightbox overlay showing title, description, and tags
  - Left/right navigation via on-screen arrow buttons and keyboard arrow keys
  - Navigates through the currently filtered set (not all artwork)
  - Swipe support on mobile
  - Close via X button, Escape key, or clicking outside
- Responsive grid: 3 columns desktop, 2 tablet, 1 mobile

### 3. Commissions
- Editable pricing information (Mandy can update tiers/prices via CMS)
- Description of commission process (what to expect, turnaround times)
- Enquiry form with fields:
  - Name
  - Email
  - What they'd like commissioned (free text)
  - Preferred medium (dropdown matching the medium tags)
  - Reference image upload (optional)
- Form submissions go to Mandy's email via Netlify Forms

### 4. Events
- List of upcoming exhibitions, galleries, talks
- Each event has: title, date, location, description, optional link
- Auto-sorted by date (nearest first)
- Past events automatically move to a "Past Events" section or fade out
- Simple for Mandy to add: title, date, location, description, publish

### 5. About
- Bio text (editable via CMS)
- Photo of Mandy (uploadable via CMS)
- Optional: links to social media (Facebook)

## CMS Content Types

### Artwork
| Field       | Type              | Required | Notes                              |
|-------------|-------------------|----------|------------------------------------|
| title       | string            | yes      |                                    |
| image       | image (upload)    | yes      | From phone camera roll             |
| description | text              | no       | Optional caption                   |
| medium      | select (multiple) | yes      | Predefined list of art mediums     |
| subject     | select (multiple) | yes      | Predefined list of subjects        |
| featured    | boolean           | no       | Show on homepage                   |
| date        | date              | yes      | Auto-filled to today               |

### Event
| Field       | Type           | Required | Notes                              |
|-------------|----------------|----------|------------------------------------|
| title       | string         | yes      |                                    |
| date        | date           | yes      |                                    |
| location    | string         | yes      |                                    |
| description | text           | yes      |                                    |
| link        | string (URL)   | no       | External link for more info        |

### Commission Category (collection -- one entry per type of work)
| Field       | Type             | Required | Notes                                          |
|-------------|------------------|----------|-------------------------------------------------|
| title       | string           | yes      | e.g. "Pet portraits in pastels"                 |
| options     | list of objects   | yes      | Each: size, description, price (numeric)        |
| addons      | list of objects   | no       | Each: description, price (numeric)              |
| included    | text             | no       | What's included, e.g. "basic frame and mount"   |
| notes       | text             | no       | Caveats, e.g. "Extra for P&P if required"       |

Prices are stored as numbers. The currency symbol is rendered from Site Settings.

### About
| Field       | Type           | Required | Notes                              |
|-------------|----------------|----------|------------------------------------|
| bio         | markdown       | yes      | Rich text via CMS editor           |
| photo       | image          | no       |                                    |

### Site Settings
| Field         | Type   | Required | Notes                              |
|---------------|--------|----------|------------------------------------|
| tagline         | string | yes      | Shown in hero                      |
| contact_email   | string | yes      | Where form submissions go          |
| facebook_url    | string | no       |                                    |
| currency_symbol | string | yes      | e.g. "£" -- used for all prices    |

## Authentication & Security

- Decap CMS admin panel at `/admin` protected by Netlify Identity
- Invite-only: Tom creates Mandy's account, no public sign-up
- Netlify Identity free tier (up to 1,000 active users -- more than enough)
- Git Gateway connects Decap CMS to the repo so Mandy's edits commit automatically

## Image Handling

- Mandy uploads from phone camera roll via CMS admin panel
- Images stored via Cloudinary (free tier: 25GB storage, 25GB bandwidth/month)
- Cloudinary auto-transforms: responsive sizing, WebP format, lazy loading
- Thumbnails generated automatically for gallery grid
- Full-size served in lightbox view

## Mandy's Day-to-Day Workflows

### Adding artwork
1. Open `mandydennis.art/admin` on phone
2. Log in (saved in browser, rarely needed again)
3. Tap "Artwork" > "New Artwork"
4. Upload photo from camera roll
5. Type a title
6. Tap medium tags (watercolour, pastel, etc.)
7. Tap subject tags (people, pets, etc.)
8. Optionally mark as featured
9. Tap "Publish"
10. Site auto-rebuilds in ~1-2 minutes

### Adding an event
1. Open admin on phone
2. Tap "Events" > "New Event"
3. Fill in title, date, location, description
4. Tap "Publish"

### Updating commission prices
1. Open admin on phone
2. Tap "Commission Pricing"
3. Edit prices/descriptions
4. Tap "Publish"

## Responsive Design

- **Fully responsive across all devices** -- mobile, tablet, and desktop are all first-class experiences
- Built mobile-first in CSS but designed to look polished at every breakpoint
- Breakpoints: mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
- Gallery: 1 / 2 / 3 columns
- Navigation: hamburger menu on mobile, horizontal nav on desktop
- All touch targets min 44px for phone usability
- Lightbox: swipe on touch devices, keyboard/mouse on desktop
- Tag filter bar: horizontally scrollable on mobile, wrapping on desktop
- CMS admin panel (Decap): already responsive, works on phone and desktop
