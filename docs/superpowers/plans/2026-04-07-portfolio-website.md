# Mandy Dennis Art Portfolio -- Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully responsive artist portfolio website with a phone-friendly CMS admin panel for Mandy Dennis to manage her artwork, events, and commission pricing independently.

**Architecture:** React SPA with Tailwind CSS, content stored as markdown files in the repo. Decap CMS provides a visual admin panel that commits content changes to Git. Netlify auto-rebuilds on each commit. Cloudinary handles image storage/optimization. Content is loaded at build time via Vite's `import.meta.glob` and `gray-matter`.

**Tech Stack:** React 19, Vite, TypeScript, Tailwind CSS v4, React Router v7, Decap CMS, Netlify (hosting + forms + identity), Cloudinary (images), gray-matter (frontmatter parsing), react-markdown (rendering)

---

## File Structure

```
public/
  admin/
    index.html              -- Decap CMS admin panel entry point
    config.yml              -- Decap CMS collections/fields config
content/
  artwork/
    pet-portrait-sample.md  -- Sample artwork (frontmatter + optional body)
  events/
    sample-event.md         -- Sample event
  commissions/
    pet-portraits-pastels.md -- Pet portraits pricing
  pages/
    about.md                -- About page content
  settings.json             -- Site-wide settings (tagline, currency, etc.)
src/
  main.tsx                  -- Entry point, mounts App
  App.tsx                   -- React Router setup
  types.ts                  -- Shared TypeScript types
  lib/
    content.ts              -- Load + parse markdown content at build time
    cloudinary.ts           -- Cloudinary URL helpers (resize, format)
  components/
    Layout.tsx              -- Page wrapper: header + nav + footer
    Nav.tsx                 -- Responsive navigation
    Footer.tsx              -- Site footer
    gallery/
      GalleryGrid.tsx       -- Masonry grid of artwork cards
      TagFilter.tsx         -- Cascading toggleable tag buttons
      Lightbox.tsx          -- Fullscreen image viewer with nav
    CommissionCard.tsx      -- Renders one commission category
    CommissionForm.tsx      -- Netlify Forms enquiry form
    EventCard.tsx           -- Single event display
    FeaturedGrid.tsx        -- Homepage featured artwork subset
  pages/
    HomePage.tsx
    GalleryPage.tsx
    CommissionsPage.tsx
    EventsPage.tsx
    AboutPage.tsx
index.html                  -- Updated with site title, Netlify Identity widget
tailwind.config.ts          -- Tailwind config (if needed beyond v4 defaults)
postcss.config.js           -- PostCSS for Tailwind
netlify.toml                -- Netlify build config + redirects for SPA
```

---

## Task 1: Clean Slate + Dependencies

**Files:**
- Modify: `package.json`
- Modify: `index.html`
- Modify: `vite.config.ts`
- Delete: `src/App.tsx`, `src/app.module.scss`, `src/globals.scss`, `src/components/Gallery.tsx`, `src/components/TagFilter.tsx`, `src/main.tsx`
- Create: `postcss.config.js`
- Create: `src/main.tsx` (fresh)
- Create: `src/App.tsx` (fresh)
- Create: `src/index.css` (Tailwind entry)

- [ ] **Step 1: Remove old source files**

```bash
rm -rf src/components src/app.module.scss src/globals.scss src/App.tsx src/main.tsx src/assets
```

- [ ] **Step 2: Install dependencies**

```bash
yarn add react-router-dom gray-matter react-markdown remark-gfm
yarn add -D tailwindcss @tailwindcss/postcss postcss autoprefixer @types/react-router-dom
```

Note: Remove `sass`, `react-image-lightbox`, `react-masonry-css`, `clsx` from package.json as we'll handle these differently:
- Tailwind replaces sass
- We'll build a custom lightweight lightbox (react-image-lightbox is unmaintained and has React 19 issues)
- We'll use CSS columns for masonry (native, no library needed)
- Tailwind's `clsx` equivalent is built-in via conditional classes

```bash
yarn remove sass react-image-lightbox react-masonry-css clsx
```

- [ ] **Step 3: Create PostCSS config**

Create `postcss.config.js`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 4: Create Tailwind CSS entry file**

Create `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-warm-50: #fdf8f6;
  --color-warm-100: #f2e8e5;
  --color-warm-200: #eaddd7;
  --color-warm-300: #e0cec7;
  --color-warm-400: #d2bab0;
  --color-warm-500: #bfa094;
  --color-warm-600: #a18072;
  --color-warm-700: #977669;
  --color-warm-800: #846358;
  --color-warm-900: #43302b;

  --font-display: "Playfair Display", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;
}
```

- [ ] **Step 5: Update index.html**

Replace contents of `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mandy Dennis Art</title>
    <meta name="description" content="Artist portfolio and commissions by Mandy Dennis" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  </head>
  <body class="bg-warm-50 text-warm-900 font-body">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
    <script>
      if (window.netlifyIdentity) {
        window.netlifyIdentity.on("init", user => {
          if (!user) {
            window.netlifyIdentity.on("login", () => {
              document.location.href = "/admin/";
            });
          }
        });
      }
    </script>
  </body>
</html>
```

- [ ] **Step 6: Create fresh main.tsx**

Create `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

- [ ] **Step 7: Create placeholder App.tsx**

Create `src/App.tsx`:

```tsx
import { Routes, Route } from "react-router-dom";

function Placeholder({ name }: { name: string }) {
  return <div className="p-8 font-display text-2xl">{name}</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder name="Home" />} />
      <Route path="/gallery" element={<Placeholder name="Gallery" />} />
      <Route path="/commissions" element={<Placeholder name="Commissions" />} />
      <Route path="/events" element={<Placeholder name="Events" />} />
      <Route path="/about" element={<Placeholder name="About" />} />
    </Routes>
  );
}
```

- [ ] **Step 8: Verify dev server starts**

```bash
yarn dev
```

Expected: Vite dev server starts, navigating to `http://localhost:5173` shows "Home" in Playfair Display font on warm background.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: clean slate with React, Tailwind v4, React Router"
```

---

## Task 2: Content Structure + Sample Data

**Files:**
- Create: `content/settings.json`
- Create: `content/artwork/pet-portrait-bella.md`
- Create: `content/artwork/landscape-sunset-hills.md`
- Create: `content/events/spring-art-fair-2026.md`
- Create: `content/commissions/pet-portraits-pastels.md`
- Create: `content/pages/about.md`

- [ ] **Step 1: Create site settings**

Create `content/settings.json`:

```json
{
  "tagline": "Original artwork & commissions",
  "contact_email": "mandy@example.com",
  "facebook_url": "",
  "currency_symbol": "£"
}
```

- [ ] **Step 2: Create sample artwork files**

Create `content/artwork/pet-portrait-bella.md`:

```markdown
---
title: "Bella - Pastel Portrait"
image: "/sample/bella.jpg"
description: "A soft pastel portrait of Bella the spaniel"
medium:
  - pastel
subject:
  - pets
  - dogs
featured: true
date: 2026-03-15
---
```

Create `content/artwork/landscape-sunset-hills.md`:

```markdown
---
title: "Sunset Over the Hills"
image: "/sample/sunset-hills.jpg"
description: "Watercolour landscape capturing golden hour"
medium:
  - watercolour
subject:
  - landscape
featured: false
date: 2026-02-20
---
```

- [ ] **Step 3: Create sample event**

Create `content/events/spring-art-fair-2026.md`:

```markdown
---
title: "Spring Art Fair 2026"
date: 2026-05-10
location: "Village Hall, Oakham"
link: ""
---

Join me at the Spring Art Fair where I'll be exhibiting a selection of pet portraits and landscapes. Come say hello!
```

- [ ] **Step 4: Create sample commission category**

Create `content/commissions/pet-portraits-pastels.md`:

```markdown
---
title: "Pet Portraits in Pastels"
options:
  - size: "A5"
    description: "Head portrait"
    price: 80
  - size: "A4"
    description: "Head and shoulder"
    price: 100
  - size: "A4"
    description: "Full body"
    price: 120
  - size: "A3 or 12x12"
    description: ""
    price: 150
  - size: "Larger than A3"
    description: "Starting from"
    price: 300
addons:
  - description: "Each extra pet (A3)"
    price: 50
  - description: "Specific background"
    price: 50
included: "A5-A3 includes a basic frame and mount. Add extra for specific frame requirements."
notes: "Extra for P&P if required."
---
```

- [ ] **Step 5: Create about page content**

Create `content/pages/about.md`:

```markdown
---
bio: "Welcome to my art page! I'm Mandy Dennis, an artist based in the UK specialising in pastel pet portraits and watercolour landscapes. I've been creating art for over 30 years and love bringing your beloved pets to life on paper."
photo: ""
---
```

- [ ] **Step 6: Commit**

```bash
git add content/
git commit -m "content: add content structure with sample data"
```

---

## Task 3: Content Loading Library

**Files:**
- Create: `src/types.ts`
- Create: `src/lib/content.ts`
- Create: `src/lib/cloudinary.ts`

- [ ] **Step 1: Define TypeScript types**

Create `src/types.ts`:

```tsx
export interface Artwork {
  slug: string;
  title: string;
  image: string;
  description: string;
  medium: string[];
  subject: string[];
  featured: boolean;
  date: string;
}

export interface ArtEvent {
  slug: string;
  title: string;
  date: string;
  location: string;
  description: string;
  link: string;
}

export interface CommissionOption {
  size: string;
  description: string;
  price: number;
}

export interface CommissionAddon {
  description: string;
  price: number;
}

export interface CommissionCategory {
  slug: string;
  title: string;
  options: CommissionOption[];
  addons: CommissionAddon[];
  included: string;
  notes: string;
}

export interface SiteSettings {
  tagline: string;
  contact_email: string;
  facebook_url: string;
  currency_symbol: string;
}

export interface AboutPage {
  bio: string;
  photo: string;
}
```

- [ ] **Step 2: Create content loading module**

Create `src/lib/content.ts`:

```tsx
import matter from "gray-matter";
import type {
  Artwork,
  ArtEvent,
  CommissionCategory,
  SiteSettings,
  AboutPage,
} from "../types";

// Vite glob imports -- these resolve at build time
const artworkFiles = import.meta.glob("/content/artwork/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const eventFiles = import.meta.glob("/content/events/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const commissionFiles = import.meta.glob("/content/commissions/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const aboutFile = import.meta.glob("/content/pages/about.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const settingsFile = import.meta.glob("/content/settings.json", {
  eager: true,
  import: "default",
}) as Record<string, SiteSettings>;

function slugFromPath(path: string): string {
  return path.split("/").pop()!.replace(/\.md$/, "");
}

export function getArtwork(): Artwork[] {
  return Object.entries(artworkFiles)
    .map(([path, raw]) => {
      const { data } = matter(raw);
      return {
        slug: slugFromPath(path),
        title: data.title ?? "",
        image: data.image ?? "",
        description: data.description ?? "",
        medium: data.medium ?? [],
        subject: data.subject ?? [],
        featured: data.featured ?? false,
        date: data.date ?? "",
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getEvents(): ArtEvent[] {
  return Object.entries(eventFiles)
    .map(([path, raw]) => {
      const { data, content } = matter(raw);
      return {
        slug: slugFromPath(path),
        title: data.title ?? "",
        date: data.date ?? "",
        location: data.location ?? "",
        description: content.trim(),
        link: data.link ?? "",
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getCommissions(): CommissionCategory[] {
  return Object.entries(commissionFiles).map(([path, raw]) => {
    const { data } = matter(raw);
    return {
      slug: slugFromPath(path),
      title: data.title ?? "",
      options: data.options ?? [],
      addons: data.addons ?? [],
      included: data.included ?? "",
      notes: data.notes ?? "",
    };
  });
}

export function getSettings(): SiteSettings {
  const entries = Object.values(settingsFile);
  return entries[0] ?? {
    tagline: "",
    contact_email: "",
    facebook_url: "",
    currency_symbol: "£",
  };
}

export function getAbout(): AboutPage {
  const entries = Object.entries(aboutFile);
  if (entries.length === 0) return { bio: "", photo: "" };
  const { data } = matter(entries[0][1]);
  return {
    bio: data.bio ?? "",
    photo: data.photo ?? "",
  };
}
```

- [ ] **Step 3: Create Cloudinary URL helper**

Create `src/lib/cloudinary.ts`:

```tsx
/**
 * Transform a Cloudinary URL to request a specific size/format.
 * If the URL is not a Cloudinary URL, return it unchanged.
 * This allows local/sample images to work during development.
 */
export function cloudinaryUrl(
  url: string,
  options: { width?: number; height?: number; quality?: number } = {}
): string {
  if (!url.includes("res.cloudinary.com")) return url;

  const { width, height, quality = 80 } = options;
  const transforms: string[] = [`q_${quality}`, "f_auto"];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push("c_limit");

  // Insert transforms into Cloudinary URL: .../upload/TRANSFORMS/...
  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
}

export function thumbnailUrl(url: string): string {
  return cloudinaryUrl(url, { width: 600 });
}

export function fullUrl(url: string): string {
  return cloudinaryUrl(url, { width: 1600 });
}
```

- [ ] **Step 4: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No type errors (or only the placeholder App.tsx which we'll update next).

- [ ] **Step 5: Commit**

```bash
git add src/types.ts src/lib/
git commit -m "feat: add content loading library and TypeScript types"
```

---

## Task 4: Layout + Navigation

**Files:**
- Create: `src/components/Layout.tsx`
- Create: `src/components/Nav.tsx`
- Create: `src/components/Footer.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Nav component**

Create `src/components/Nav.tsx`:

```tsx
import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/commissions", label: "Commissions" },
  { to: "/events", label: "Events" },
  { to: "/about", label: "About" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative">
      {/* Desktop nav */}
      <ul className="hidden md:flex gap-8">
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `font-body text-sm tracking-wide uppercase transition-colors hover:text-warm-700 ${
                  isActive ? "text-warm-800 font-semibold" : "text-warm-500"
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span
          className={`block w-6 h-0.5 bg-warm-800 transition-transform ${
            open ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-warm-800 transition-opacity ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-warm-800 transition-transform ${
            open ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Mobile dropdown */}
      {open && (
        <ul className="md:hidden absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg py-2 min-w-48 z-50">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-3 text-sm tracking-wide uppercase transition-colors hover:bg-warm-100 ${
                    isActive ? "text-warm-800 font-semibold" : "text-warm-500"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Create Footer component**

Create `src/components/Footer.tsx`:

```tsx
import { getSettings } from "../lib/content";

export default function Footer() {
  const settings = getSettings();

  return (
    <footer className="border-t border-warm-200 mt-16 py-8 px-6 text-center text-warm-500 text-sm">
      <p>&copy; {new Date().getFullYear()} Mandy Dennis Art</p>
      {settings.facebook_url && (
        <a
          href={settings.facebook_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 hover:text-warm-700 transition-colors"
        >
          Facebook
        </a>
      )}
    </footer>
  );
}
```

- [ ] **Step 3: Create Layout component**

Create `src/components/Layout.tsx`:

```tsx
import { Link } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 md:px-12 md:py-6 border-b border-warm-200">
        <Link to="/" className="font-display text-xl md:text-2xl text-warm-900 hover:text-warm-700 transition-colors">
          Mandy Dennis Art
        </Link>
        <Nav />
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Update App.tsx to use Layout**

Replace `src/App.tsx`:

```tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

function Placeholder({ name }: { name: string }) {
  return (
    <div className="px-6 py-12 md:px-12">
      <h1 className="font-display text-3xl text-warm-800">{name}</h1>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Placeholder name="Home" />} />
        <Route path="/gallery" element={<Placeholder name="Gallery" />} />
        <Route path="/commissions" element={<Placeholder name="Commissions" />} />
        <Route path="/events" element={<Placeholder name="Events" />} />
        <Route path="/about" element={<Placeholder name="About" />} />
      </Routes>
    </Layout>
  );
}
```

- [ ] **Step 5: Verify layout renders**

```bash
yarn dev
```

Expected: Site shows header with "Mandy Dennis Art" logo and navigation links. Mobile view shows hamburger. All 5 routes show placeholder text. Footer shows copyright.

- [ ] **Step 6: Commit**

```bash
git add src/components/Layout.tsx src/components/Nav.tsx src/components/Footer.tsx src/App.tsx
git commit -m "feat: add responsive layout with header, nav, and footer"
```

---

## Task 5: Gallery Page -- Masonry Grid + Cascading Tags

**Files:**
- Create: `src/components/gallery/GalleryGrid.tsx`
- Create: `src/components/gallery/TagFilter.tsx`
- Create: `src/pages/GalleryPage.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create TagFilter component**

Create `src/components/gallery/TagFilter.tsx`:

```tsx
interface Props {
  availableTags: string[];
  activeTags: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
}

export default function TagFilter({ availableTags, activeTags, onToggle, onClear }: Props) {
  if (availableTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {activeTags.length > 0 && (
        <button
          onClick={onClear}
          className="px-4 py-2 rounded-full text-sm font-medium bg-warm-800 text-white hover:bg-warm-700 transition-colors"
        >
          Clear all
        </button>
      )}
      {availableTags.map((tag) => {
        const isActive = activeTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              isActive
                ? "bg-warm-700 text-white"
                : "bg-warm-200 text-warm-700 hover:bg-warm-300"
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create GalleryGrid component**

Create `src/components/gallery/GalleryGrid.tsx`:

```tsx
import type { Artwork } from "../../types";
import { thumbnailUrl } from "../../lib/cloudinary";

interface Props {
  items: Artwork[];
  onSelect: (index: number) => void;
}

export default function GalleryGrid({ items, onSelect }: Props) {
  if (items.length === 0) {
    return (
      <p className="text-warm-500 text-center py-12">
        No artwork matches the selected filters.
      </p>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {items.map((item, i) => (
        <button
          key={item.slug}
          onClick={() => onSelect(i)}
          className="block w-full break-inside-avoid rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer bg-white"
        >
          <img
            src={thumbnailUrl(item.image)}
            alt={item.title}
            className="w-full h-auto block group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
          <div className="p-3">
            <h3 className="font-display text-sm text-warm-800">{item.title}</h3>
          </div>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create GalleryPage with cascading filter logic**

Create `src/pages/GalleryPage.tsx`:

```tsx
import { useState, useMemo } from "react";
import { getArtwork } from "../lib/content";
import TagFilter from "../components/gallery/TagFilter";
import GalleryGrid from "../components/gallery/GalleryGrid";
import type { Artwork } from "../types";

const allArtwork = getArtwork();

// Collect every unique tag (medium + subject combined)
function getAllTags(items: Artwork[]): string[] {
  const tags = new Set<string>();
  for (const item of items) {
    item.medium.forEach((t) => tags.add(t));
    item.subject.forEach((t) => tags.add(t));
  }
  return Array.from(tags).sort();
}

function artworkTags(item: Artwork): string[] {
  return [...item.medium, ...item.subject];
}

export default function GalleryPage() {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter artwork by active tags (AND logic -- must match all active tags)
  const filtered = useMemo(() => {
    if (activeTags.length === 0) return allArtwork;
    return allArtwork.filter((item) => {
      const tags = artworkTags(item);
      return activeTags.every((t) => tags.includes(t));
    });
  }, [activeTags]);

  // Cascading: only show tags that exist on the currently filtered items
  const availableTags = useMemo(() => {
    const tags = getAllTags(filtered);
    // Don't show tags that are already active (they're already filtering)
    // But DO show them so user can deselect -- actually, show all tags present in filtered set
    return tags;
  }, [filtered]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-7xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl text-warm-800 mb-8">
        Gallery
      </h1>

      <div className="mb-8">
        <TagFilter
          availableTags={availableTags}
          activeTags={activeTags}
          onToggle={toggleTag}
          onClear={() => setActiveTags([])}
        />
      </div>

      <GalleryGrid
        items={filtered}
        onSelect={(i) => setLightboxIndex(i)}
      />

      {/* Lightbox is added in Task 6 */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <p className="text-white">Lightbox placeholder -- Task 6</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Wire GalleryPage into App.tsx**

In `src/App.tsx`, replace the gallery placeholder route:

```tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import GalleryPage from "./pages/GalleryPage";

function Placeholder({ name }: { name: string }) {
  return (
    <div className="px-6 py-12 md:px-12">
      <h1 className="font-display text-3xl text-warm-800">{name}</h1>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Placeholder name="Home" />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/commissions" element={<Placeholder name="Commissions" />} />
        <Route path="/events" element={<Placeholder name="Events" />} />
        <Route path="/about" element={<Placeholder name="About" />} />
      </Routes>
    </Layout>
  );
}
```

- [ ] **Step 5: Verify gallery renders**

```bash
yarn dev
```

Expected: `/gallery` shows tag filter buttons (pastel, watercolour, pets, dogs, landscape) and two sample artwork cards in a masonry grid. Clicking "pets" filters to just the pet portrait. Clicking "pets" again deselects. "Clear all" resets.

- [ ] **Step 6: Commit**

```bash
git add src/components/gallery/ src/pages/GalleryPage.tsx src/App.tsx
git commit -m "feat: gallery page with masonry grid and cascading tag filters"
```

---

## Task 6: Lightbox

**Files:**
- Create: `src/components/gallery/Lightbox.tsx`
- Modify: `src/pages/GalleryPage.tsx`

- [ ] **Step 1: Create Lightbox component**

Create `src/components/gallery/Lightbox.tsx`:

```tsx
import { useEffect, useCallback, useRef, useState } from "react";
import { fullUrl } from "../../lib/cloudinary";
import type { Artwork } from "../../types";

interface Props {
  items: Artwork[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}

export default function Lightbox({ items, index, onClose, onChange }: Props) {
  const touchStart = useRef<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const item = items[index];

  const goPrev = useCallback(() => {
    setImageLoaded(false);
    onChange(index === 0 ? items.length - 1 : index - 1);
  }, [index, items.length, onChange]);

  const goNext = useCallback(() => {
    setImageLoaded(false);
    onChange(index === items.length - 1 ? 0 : index + 1);
  }, [index, items.length, onChange]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goPrev() : goNext();
    }
    touchStart.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl z-10 w-11 h-11 flex items-center justify-center"
        aria-label="Close"
      >
        &times;
      </button>

      {/* Prev button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl z-10 w-11 h-11 flex items-center justify-center"
        aria-label="Previous"
      >
        &#8249;
      </button>

      {/* Image + caption */}
      <div
        className="max-w-5xl max-h-[90vh] flex flex-col items-center px-12"
        onClick={(e) => e.stopPropagation()}
      >
        {!imageLoaded && (
          <div className="text-white/50 text-sm">Loading...</div>
        )}
        <img
          src={fullUrl(item.image)}
          alt={item.title}
          className={`max-h-[75vh] max-w-full object-contain rounded transition-opacity ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="mt-4 text-center">
          <h2 className="text-white font-display text-lg">{item.title}</h2>
          {item.description && (
            <p className="text-white/70 text-sm mt-1">{item.description}</p>
          )}
          <div className="flex gap-2 justify-center mt-2">
            {[...item.medium, ...item.subject].map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60 capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl z-10 w-11 h-11 flex items-center justify-center"
        aria-label="Next"
      >
        &#8250;
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Wire Lightbox into GalleryPage**

In `src/pages/GalleryPage.tsx`, replace the lightbox placeholder block at the bottom of the return:

Replace the block:
```tsx
{/* Lightbox is added in Task 6 */}
{lightboxIndex !== null && (
  <div
    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
    onClick={() => setLightboxIndex(null)}
  >
    <p className="text-white">Lightbox placeholder -- Task 6</p>
  </div>
)}
```

With:
```tsx
{lightboxIndex !== null && (
  <Lightbox
    items={filtered}
    index={lightboxIndex}
    onClose={() => setLightboxIndex(null)}
    onChange={setLightboxIndex}
  />
)}
```

Add the import at the top:
```tsx
import Lightbox from "../components/gallery/Lightbox";
```

- [ ] **Step 3: Verify lightbox works**

```bash
yarn dev
```

Expected: Clicking an artwork card opens the lightbox. Arrow keys and on-screen buttons navigate between images. Escape closes. Swiping on mobile navigates. Tags and caption shown below image.

- [ ] **Step 4: Commit**

```bash
git add src/components/gallery/Lightbox.tsx src/pages/GalleryPage.tsx
git commit -m "feat: lightbox with keyboard, swipe, and button navigation"
```

---

## Task 7: Home Page

**Files:**
- Create: `src/components/FeaturedGrid.tsx`
- Create: `src/pages/HomePage.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create FeaturedGrid component**

Create `src/components/FeaturedGrid.tsx`:

```tsx
import { Link } from "react-router-dom";
import type { Artwork } from "../types";
import { thumbnailUrl } from "../lib/cloudinary";

interface Props {
  items: Artwork[];
}

export default function FeaturedGrid({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Link
          key={item.slug}
          to="/gallery"
          className="block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group bg-white"
        >
          <img
            src={thumbnailUrl(item.image)}
            alt={item.title}
            className="w-full h-64 object-cover group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
          <div className="p-3">
            <h3 className="font-display text-sm text-warm-800">{item.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create HomePage**

Create `src/pages/HomePage.tsx`:

```tsx
import { Link } from "react-router-dom";
import { getArtwork, getSettings } from "../lib/content";
import FeaturedGrid from "../components/FeaturedGrid";

const artwork = getArtwork();
const settings = getSettings();
const featured = artwork.filter((a) => a.featured);

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="px-6 py-16 md:px-12 md:py-24 text-center">
        <h1 className="font-display text-4xl md:text-6xl text-warm-800 mb-4">
          Mandy Dennis
        </h1>
        <p className="text-warm-500 text-lg md:text-xl max-w-xl mx-auto">
          {settings.tagline}
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            to="/gallery"
            className="px-6 py-3 bg-warm-800 text-white rounded-lg font-medium hover:bg-warm-700 transition-colors"
          >
            View Gallery
          </Link>
          <Link
            to="/commissions"
            className="px-6 py-3 border border-warm-300 text-warm-700 rounded-lg font-medium hover:bg-warm-100 transition-colors"
          >
            Commissions
          </Link>
        </div>
      </section>

      {/* Featured work */}
      {featured.length > 0 && (
        <section className="px-6 pb-16 md:px-12 max-w-7xl mx-auto">
          <h2 className="font-display text-2xl text-warm-800 mb-6">
            Featured Work
          </h2>
          <FeaturedGrid items={featured} />
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Wire HomePage into App.tsx**

Update `src/App.tsx`:

```tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";

function Placeholder({ name }: { name: string }) {
  return (
    <div className="px-6 py-12 md:px-12">
      <h1 className="font-display text-3xl text-warm-800">{name}</h1>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/commissions" element={<Placeholder name="Commissions" />} />
        <Route path="/events" element={<Placeholder name="Events" />} />
        <Route path="/about" element={<Placeholder name="About" />} />
      </Routes>
    </Layout>
  );
}
```

- [ ] **Step 4: Verify homepage renders**

```bash
yarn dev
```

Expected: Homepage shows hero with "Mandy Dennis", tagline from settings, two CTA buttons, and featured artwork grid below.

- [ ] **Step 5: Commit**

```bash
git add src/components/FeaturedGrid.tsx src/pages/HomePage.tsx src/App.tsx
git commit -m "feat: homepage with hero and featured artwork grid"
```

---

## Task 8: Commissions Page

**Files:**
- Create: `src/components/CommissionCard.tsx`
- Create: `src/components/CommissionForm.tsx`
- Create: `src/pages/CommissionsPage.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create CommissionCard component**

Create `src/components/CommissionCard.tsx`:

```tsx
import type { CommissionCategory } from "../types";

interface Props {
  category: CommissionCategory;
  currency: string;
}

export default function CommissionCard({ category, currency }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-display text-xl text-warm-800 mb-4">
        {category.title}
      </h3>

      {/* Pricing table */}
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="border-b border-warm-200 text-warm-500">
            <th className="text-left py-2 font-medium">Size</th>
            <th className="text-left py-2 font-medium">Description</th>
            <th className="text-right py-2 font-medium">Price</th>
          </tr>
        </thead>
        <tbody>
          {category.options.map((opt, i) => (
            <tr key={i} className="border-b border-warm-100">
              <td className="py-2 text-warm-800">{opt.size}</td>
              <td className="py-2 text-warm-600">{opt.description}</td>
              <td className="py-2 text-right text-warm-800 font-medium">
                {opt.description === "Starting from" ? "from " : ""}
                {currency}{opt.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add-ons */}
      {category.addons.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-warm-600 mb-2">Add-ons</h4>
          <ul className="text-sm space-y-1">
            {category.addons.map((addon, i) => (
              <li key={i} className="flex justify-between text-warm-700">
                <span>{addon.description}</span>
                <span className="font-medium">{currency}{addon.price}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Included */}
      {category.included && (
        <p className="text-sm text-warm-600 mb-2">
          <span className="font-medium">Included:</span> {category.included}
        </p>
      )}

      {/* Notes */}
      {category.notes && (
        <p className="text-sm text-warm-500 italic">{category.notes}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create CommissionForm component**

Create `src/components/CommissionForm.tsx`:

```tsx
export default function CommissionForm() {
  return (
    <form
      name="commission-enquiry"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="bg-white rounded-lg shadow-sm p-6 space-y-4"
    >
      <input type="hidden" name="form-name" value="commission-enquiry" />
      <p className="hidden">
        <label>
          Don't fill this out: <input name="bot-field" />
        </label>
      </p>

      <h3 className="font-display text-xl text-warm-800">
        Commission Enquiry
      </h3>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-warm-700 mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-2 border border-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-warm-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-2 border border-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400"
        />
      </div>

      <div>
        <label htmlFor="medium" className="block text-sm font-medium text-warm-700 mb-1">
          Preferred Medium
        </label>
        <select
          id="medium"
          name="medium"
          className="w-full px-4 py-2 border border-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 bg-white"
        >
          <option value="">No preference</option>
          <option value="pastel">Pastel</option>
          <option value="watercolour">Watercolour</option>
          <option value="pencil">Pencil</option>
          <option value="oil">Oil</option>
          <option value="mixed media">Mixed Media</option>
        </select>
      </div>

      <div>
        <label htmlFor="details" className="block text-sm font-medium text-warm-700 mb-1">
          What would you like commissioned?
        </label>
        <textarea
          id="details"
          name="details"
          rows={4}
          required
          className="w-full px-4 py-2 border border-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 resize-y"
          placeholder="e.g. A pastel portrait of my dog, A4 size..."
        />
      </div>

      <div>
        <label htmlFor="reference" className="block text-sm font-medium text-warm-700 mb-1">
          Reference image (optional)
        </label>
        <input
          type="file"
          id="reference"
          name="reference"
          accept="image/*"
          className="w-full text-sm text-warm-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-warm-200 file:text-warm-700 file:font-medium hover:file:bg-warm-300"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-warm-800 text-white rounded-lg font-medium hover:bg-warm-700 transition-colors"
      >
        Send Enquiry
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Create CommissionsPage**

Create `src/pages/CommissionsPage.tsx`:

```tsx
import { getCommissions, getSettings } from "../lib/content";
import CommissionCard from "../components/CommissionCard";
import CommissionForm from "../components/CommissionForm";

const commissions = getCommissions();
const settings = getSettings();

export default function CommissionsPage() {
  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl text-warm-800 mb-8">
        Commissions
      </h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Pricing cards */}
        <div className="space-y-6">
          {commissions.map((cat) => (
            <CommissionCard
              key={cat.slug}
              category={cat}
              currency={settings.currency_symbol}
            />
          ))}
        </div>

        {/* Enquiry form */}
        <div>
          <CommissionForm />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Wire CommissionsPage into App.tsx**

Update the commissions route in `src/App.tsx`:

Add import:
```tsx
import CommissionsPage from "./pages/CommissionsPage";
```

Replace route:
```tsx
<Route path="/commissions" element={<CommissionsPage />} />
```

- [ ] **Step 5: Verify commissions page**

```bash
yarn dev
```

Expected: `/commissions` shows the pet portraits pricing table with correct GBP prices (£80, £100, etc.), add-ons, included info, notes, and the enquiry form.

- [ ] **Step 6: Commit**

```bash
git add src/components/CommissionCard.tsx src/components/CommissionForm.tsx src/pages/CommissionsPage.tsx src/App.tsx
git commit -m "feat: commissions page with pricing cards and enquiry form"
```

---

## Task 9: Events Page

**Files:**
- Create: `src/components/EventCard.tsx`
- Create: `src/pages/EventsPage.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create EventCard component**

Create `src/components/EventCard.tsx`:

```tsx
import type { ArtEvent } from "../types";

interface Props {
  event: ArtEvent;
  isPast: boolean;
}

export default function EventCard({ event, isPast }: Props) {
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 ${
        isPast ? "opacity-60" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <h3 className="font-display text-lg text-warm-800">{event.title}</h3>
        {isPast && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-warm-200 text-warm-500 self-start">
            Past
          </span>
        )}
      </div>
      <p className="text-sm text-warm-600 mb-1">{formattedDate}</p>
      <p className="text-sm text-warm-500 mb-3">{event.location}</p>
      {event.description && (
        <p className="text-sm text-warm-700">{event.description}</p>
      )}
      {event.link && (
        <a
          href={event.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-sm text-warm-600 underline hover:text-warm-800 transition-colors"
        >
          More info
        </a>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create EventsPage**

Create `src/pages/EventsPage.tsx`:

```tsx
import { getEvents } from "../lib/content";
import EventCard from "../components/EventCard";

const allEvents = getEvents();

export default function EventsPage() {
  const now = new Date();
  const upcoming = allEvents.filter((e) => new Date(e.date) >= now);
  const past = allEvents
    .filter((e) => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl text-warm-800 mb-8">
        Events
      </h1>

      {upcoming.length > 0 ? (
        <section className="space-y-4 mb-12">
          <h2 className="font-display text-xl text-warm-700">Upcoming</h2>
          {upcoming.map((event) => (
            <EventCard key={event.slug} event={event} isPast={false} />
          ))}
        </section>
      ) : (
        <p className="text-warm-500 mb-12">
          No upcoming events at the moment. Check back soon!
        </p>
      )}

      {past.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl text-warm-400">Past Events</h2>
          {past.map((event) => (
            <EventCard key={event.slug} event={event} isPast={true} />
          ))}
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Wire EventsPage into App.tsx**

Add import:
```tsx
import EventsPage from "./pages/EventsPage";
```

Replace route:
```tsx
<Route path="/events" element={<EventsPage />} />
```

- [ ] **Step 4: Verify events page**

```bash
yarn dev
```

Expected: `/events` shows the sample Spring Art Fair event as upcoming (date is 2026-05-10). Events before today show in "Past Events" with reduced opacity.

- [ ] **Step 5: Commit**

```bash
git add src/components/EventCard.tsx src/pages/EventsPage.tsx src/App.tsx
git commit -m "feat: events page with upcoming/past sections"
```

---

## Task 10: About Page

**Files:**
- Create: `src/pages/AboutPage.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create AboutPage**

Create `src/pages/AboutPage.tsx`:

```tsx
import ReactMarkdown from "react-markdown";
import { getAbout, getSettings } from "../lib/content";
import { cloudinaryUrl } from "../lib/cloudinary";

const about = getAbout();
const settings = getSettings();

export default function AboutPage() {
  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl text-warm-800 mb-8">
        About
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {about.photo && (
          <div className="md:w-1/3 flex-shrink-0">
            <img
              src={cloudinaryUrl(about.photo, { width: 400 })}
              alt="Mandy Dennis"
              className="rounded-lg w-full object-cover"
            />
          </div>
        )}
        <div className="prose prose-warm max-w-none">
          <ReactMarkdown>{about.bio}</ReactMarkdown>
        </div>
      </div>

      {settings.facebook_url && (
        <div className="mt-8">
          <a
            href={settings.facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-warm-200 text-warm-700 rounded-lg font-medium hover:bg-warm-300 transition-colors"
          >
            Find me on Facebook
          </a>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Wire AboutPage into App.tsx**

Add import:
```tsx
import AboutPage from "./pages/AboutPage";
```

Replace route:
```tsx
<Route path="/about" element={<AboutPage />} />
```

- [ ] **Step 3: Verify about page**

```bash
yarn dev
```

Expected: `/about` shows bio text from the sample content. No photo yet (empty in sample data). Facebook link hidden since URL is empty.

- [ ] **Step 4: Commit**

```bash
git add src/pages/AboutPage.tsx src/App.tsx
git commit -m "feat: about page with bio and optional photo"
```

---

## Task 11: Decap CMS Admin Panel

**Files:**
- Create: `public/admin/index.html`
- Create: `public/admin/config.yml`

- [ ] **Step 1: Create admin panel HTML**

Create `public/admin/index.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mandy Dennis Art - Admin</title>
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
    <script>
      CMS.init({
        config: {
          load_config_file: true,
        },
      });
    </script>
  </body>
</html>
```

- [ ] **Step 2: Create CMS config**

Create `public/admin/config.yml`:

```yaml
backend:
  name: git-gateway
  branch: main

media_library:
  name: cloudinary
  config:
    cloud_name: "" # Tom: fill in after creating Cloudinary account
    api_key: ""    # Tom: fill in after creating Cloudinary account

collections:
  - name: artwork
    label: Artwork
    folder: content/artwork
    create: true
    slug: "{{slug}}"
    fields:
      - { label: Title, name: title, widget: string }
      - { label: Image, name: image, widget: image }
      - { label: Description, name: description, widget: text, required: false }
      - label: Medium
        name: medium
        widget: select
        multiple: true
        options:
          - pastel
          - watercolour
          - pencil
          - oil
          - charcoal
          - mixed media
          - acrylic
          - ink
      - label: Subject
        name: subject
        widget: select
        multiple: true
        options:
          - pets
          - dogs
          - cats
          - horses
          - people
          - landscape
          - still life
          - wildlife
          - flowers
          - buildings
      - { label: Featured, name: featured, widget: boolean, default: false }
      - { label: Date, name: date, widget: datetime, date_format: "YYYY-MM-DD", time_format: false, format: "YYYY-MM-DD" }

  - name: events
    label: Events
    folder: content/events
    create: true
    slug: "{{slug}}"
    fields:
      - { label: Title, name: title, widget: string }
      - { label: Date, name: date, widget: datetime, date_format: "YYYY-MM-DD", time_format: false, format: "YYYY-MM-DD" }
      - { label: Location, name: location, widget: string }
      - { label: Description, name: body, widget: markdown }
      - { label: Link, name: link, widget: string, required: false }

  - name: commissions
    label: Commission Pricing
    folder: content/commissions
    create: true
    slug: "{{slug}}"
    fields:
      - { label: Title, name: title, widget: string }
      - label: Price Options
        name: options
        widget: list
        fields:
          - { label: Size, name: size, widget: string }
          - { label: Description, name: description, widget: string, required: false }
          - { label: Price, name: price, widget: number, value_type: int }
      - label: Add-ons
        name: addons
        widget: list
        required: false
        fields:
          - { label: Description, name: description, widget: string }
          - { label: Price, name: price, widget: number, value_type: int }
      - { label: "What's Included", name: included, widget: text, required: false }
      - { label: Notes, name: notes, widget: text, required: false }

  - name: pages
    label: Pages
    files:
      - name: about
        label: About
        file: content/pages/about.md
        fields:
          - { label: Bio, name: bio, widget: markdown }
          - { label: Photo, name: photo, widget: image, required: false }

  - name: settings
    label: Site Settings
    files:
      - name: settings
        label: Settings
        file: content/settings.json
        fields:
          - { label: Tagline, name: tagline, widget: string }
          - { label: Contact Email, name: contact_email, widget: string }
          - { label: Facebook URL, name: facebook_url, widget: string, required: false }
          - { label: Currency Symbol, name: currency_symbol, widget: string, default: "£" }
```

- [ ] **Step 3: Verify admin panel loads locally**

```bash
yarn dev
```

Navigate to `http://localhost:5173/admin/`. Expected: Decap CMS login screen appears (won't fully work locally without Netlify Identity, but the UI should load).

- [ ] **Step 4: Commit**

```bash
git add public/admin/
git commit -m "feat: Decap CMS admin panel with all content types"
```

---

## Task 12: Netlify Deployment Config

**Files:**
- Create: `netlify.toml`

- [ ] **Step 1: Create Netlify config**

Create `netlify.toml`:

```toml
[build]
  command = "yarn build"
  publish = "dist"

# SPA fallback -- serve index.html for all routes except /admin
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  conditions = {Role = ["admin"]}

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- [ ] **Step 2: Update vite.config.ts for build**

Replace `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.md"],
});
```

The `assetsInclude` ensures Vite handles .md files in the content directory.

- [ ] **Step 3: Verify production build**

```bash
yarn build
```

Expected: Build completes successfully, `dist/` folder created with the built site.

- [ ] **Step 4: Commit**

```bash
git add netlify.toml vite.config.ts
git commit -m "chore: add Netlify deployment config and Vite build settings"
```

---

## Task 13: Final Wiring + Cleanup

**Files:**
- Modify: `src/App.tsx` (final version with all pages)
- Remove any leftover files from old setup

- [ ] **Step 1: Verify final App.tsx has all routes**

`src/App.tsx` should now have:

```tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import CommissionsPage from "./pages/CommissionsPage";
import EventsPage from "./pages/EventsPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/commissions" element={<CommissionsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Layout>
  );
}
```

- [ ] **Step 2: Clean up leftover files**

Remove any old files that weren't already cleaned up:
```bash
rm -f src/App.css
```

- [ ] **Step 3: Full build and verify**

```bash
yarn build && yarn preview
```

Expected: Production build succeeds. Preview server at `http://localhost:4173` shows the full site. All pages render, navigation works, gallery filters work, lightbox opens.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and wiring"
```

---

## Post-Build: Tom's Setup Checklist

These steps happen outside the codebase and must be done by Tom:

1. **Push to GitHub** -- create a repo and push this code
2. **Connect to Netlify** -- link the GitHub repo, Netlify auto-detects `netlify.toml`
3. **Create Cloudinary account** -- get `cloud_name` and `api_key`, update `public/admin/config.yml`
4. **Enable Netlify Identity** -- Site Settings > Identity > Enable, set to **Invite only**
5. **Enable Git Gateway** -- Site Settings > Identity > Services > Git Gateway > Enable
6. **Invite Mandy** -- Identity tab > Invite users > enter her email
7. **Test the admin panel** -- visit `yoursite.netlify.app/admin`, log in, try adding an artwork
8. **Add custom domain** -- when ready, buy `mandydennis.art` and add in Netlify domain settings
