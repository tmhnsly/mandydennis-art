# UI Redesign Spec

## Summary

Complete visual redesign of the Mandy Dennis Art portfolio. Construction-line aesthetic with full-bleed section dividers, section icons, scroll animations, dark/light mode via Radix UI Colors.

## Typography

- **Display/Headlines**: Space Grotesk (700, tight negative tracking)
- **Body**: IBM Plex Sans (400/500)
- **Accent**: Instrument Serif italic (artist name in hero)

## Color System

- Replace custom warm palette with **Radix UI Colors** (sand or bronze scale)
- Support `prefers-color-scheme` dark/light mode
- Warm earth tones maintained

## Layout Principles

- **Full-bleed section dividers** — border lines span entire viewport, content constrained to max-width
- **Section icons** — each section has a Lucide icon in a bordered box instead of numbers (star, palette, calendar, user, image, etc.)
- **Sticky nav** with frosted glass blur, icons + text (icons-only on mobile)
- **Separate pages** — React Router, not hash links: /, /gallery, /commissions, /events, /about
- **Consistent spacing** via CSS custom properties

## Pages

### Home (/)
- Hero: artist name (Space Grotesk + Instrument Serif italic), bio-informed tagline, CTA buttons with icons, stat bar
- Featured work grid (3-col, items marked `featured` in Sanity)
- "Browse all work" button linking to /gallery

### Gallery (/gallery)
- Masonry layout (CSS columns or well-maintained masonry library)
- No titles visible — hover reveals title + tags via gradient overlay + ↗ arrow
- ★ Featured tag (active by default) with star icon from lucide-react
- Cascading tag filters (hide zero-match tags)
- "Show more" button for pagination (not infinite scroll)
- Lightbox: use a well-maintained package (e.g. yet-another-react-lightbox), carousel/swipeable on mobile, keyboard nav

### Commissions (/commissions)
- Pricing cards with dotted row dividers, structured header/body/addons/notes
- Interactive enquiry form: toggles for size + addons giving rough estimate
- Netlify Forms submission

### Events (/events)
- Event cards with large date display (day + month), location, description
- Upcoming/past auto-sorting

### About (/about)
- Photo + real bio text (provided by Tom)
- Detail cards (Medium, Subjects, Based)
- Facebook link from settings

## Animations

- Scroll-triggered: section headers slide up + fade in, rules animate from left
- Hero: staggered entrance (label → name → tagline → CTAs → stats)
- Page transitions: subtle fade between routes

## Icons

- **lucide-react** package
- Nav: Home, Image, Palette, Calendar, User
- Sections: Star (featured), Image (gallery), Palette (commissions), Calendar (events), User (about)

## Dark/Light Mode

- **@radix-ui/colors** for the color scales
- CSS custom properties toggled by `prefers-color-scheme` media query
- Warm scale (sand or bronze) for both modes
- All components use semantic color tokens, never raw values

## Packages to Add

- `@radix-ui/colors` — color system
- `lucide-react` — icons
- `yet-another-react-lightbox` — gallery lightbox (well-maintained, accessible, swipeable)
- Remove: `react-markdown`, `remark-gfm` (bio is plain text from Sanity, not markdown)
