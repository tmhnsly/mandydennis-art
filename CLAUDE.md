# Mandy Dennis Art - Portfolio Website

## Project Overview

Portfolio website for artist Mandy Dennis. Showcases artwork, takes commission enquiries, promotes events. The primary user (Mandy) is non-technical -- all content management happens via Sanity Studio on her phone.

## Tech Stack

- **Framework:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS v4 (custom warm color palette, Playfair Display + Inter fonts)
- **CMS:** Sanity (headless CMS -- content + image hosting in one service)
- **Hosting:** Netlify (free tier, auto-deploys from GitHub)
- **Forms:** Netlify Forms (commission enquiry form)
- **Repo:** github.com/tmhnsly/mandydennis-art

## Key Architecture Decisions

- **Sanity over Decap CMS:** Single service for content + images. Better mobile editing UX. No rebuild delay -- content changes appear instantly.
- **Async data loading:** All content fetched at runtime from Sanity CDN (not build-time). Pages use `useEffect` + `useState` pattern.
- **Dummy fallback data:** When `VITE_SANITY_PROJECT_ID` is empty, the site renders with placeholder content so the layout can be previewed without Sanity.
- **SiteSettings context:** Global settings (currency, tagline, etc.) fetched once via React context, not per-page.
- **Currency is configurable:** Stored as `currency_symbol` in Sanity site settings, rendered from there. Currently GBP (£).
- **No Cloudinary, no Netlify Identity, no Git Gateway:** Sanity replaces all of these.

## Project Structure

```
src/
  main.tsx                    -- Entry point, BrowserRouter + SiteSettingsProvider
  App.tsx                     -- React Router routes
  types.ts                    -- Shared TypeScript interfaces
  index.css                   -- Tailwind entry + custom theme
  lib/
    sanity.ts                 -- Sanity client, urlFor image helper
    content.ts                -- Async data fetchers (GROQ queries) + dummy fallbacks
  context/
    SiteSettings.tsx          -- React context for site-wide settings
  components/
    Layout.tsx                -- Page shell (header + nav + footer)
    Nav.tsx                   -- Responsive nav (hamburger on mobile)
    Footer.tsx                -- Copyright + optional Facebook link
    FeaturedGrid.tsx          -- Homepage featured artwork grid
    CommissionCard.tsx        -- Single commission category pricing table
    CommissionForm.tsx        -- Netlify Forms enquiry form
    EventCard.tsx             -- Single event card
    gallery/
      GalleryGrid.tsx         -- CSS columns masonry grid
      TagFilter.tsx           -- Cascading toggleable tag buttons
      Lightbox.tsx            -- Fullscreen image viewer (keyboard/swipe/buttons)
  pages/
    HomePage.tsx              -- Hero + featured work
    GalleryPage.tsx           -- Masonry grid + cascading filters + lightbox
    CommissionsPage.tsx       -- Pricing cards + enquiry form
    EventsPage.tsx            -- Upcoming/past events
    AboutPage.tsx             -- Bio + photo + Facebook link
studio/
  schemas/                    -- Sanity Studio schema definitions (reference)
    artwork.ts
    event.ts
    commissionCategory.ts
    siteSettings.ts
    about.ts
    index.ts
```

## Commands

- `yarn dev` -- Start Vite dev server
- `yarn build` -- Production build to `dist/`
- `yarn preview` -- Preview production build
- `npx tsc --noEmit` -- Type check without emitting

## Environment Variables

```
VITE_SANITY_PROJECT_ID=   # Sanity project ID (leave empty for dummy data)
VITE_SANITY_DATASET=production
```

## Conventions

- **Styling:** Tailwind utility classes only. Custom palette: `warm-50` through `warm-900`. Fonts: `font-display` (Playfair Display), `font-body` (Inter).
- **Components:** Function components, default exports. No class components.
- **Data flow:** Pages fetch their own data via `useEffect`. Settings come from `useSiteSettings()` context hook.
- **Images:** Sanity image objects passed through `thumbnailUrl()` / `fullUrl()` from `content.ts`. Falls back to placehold.co when no image.
- **Tags:** Combined medium + subject in one unified filter bar. AND logic for multi-select. Cascading (hide zero-match tags).
- **Currency:** Never hardcode £. Always use `settings.currency_symbol`.
- **Responsive:** Mobile-first. Breakpoints: sm (640px), md (768px), lg (1024px). Gallery: 1/2/3 columns.
