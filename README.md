# Mandy Dennis Art

Portfolio website for artist Mandy Dennis -- showcasing artwork, commission pricing, and upcoming events.

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4
- **CMS:** Sanity (content + image hosting)
- **Hosting:** Vercel (live at mandydennis.art)
- **Forms:** None — commission enquiry uses a `mailto:` link

## Quick Start

```bash
yarn install
yarn dev
```

The site runs with dummy content when Sanity isn't configured -- no setup needed to preview the layout.

## Connecting to Sanity

1. Create a project at [sanity.io](https://www.sanity.io)
2. Copy `.env.example` to `.env` and fill in your project ID
3. Add `http://localhost:5173` as a CORS origin in Sanity dashboard
4. Set up Sanity Studio (see `studio/schemas/` for schema definitions)

## Environment Variables

| Variable                 | Required | Description          |
|--------------------------|----------|----------------------|
| `VITE_SANITY_PROJECT_ID` | yes*     | Sanity project ID    |
| `VITE_SANITY_DATASET`    | no       | Default: production  |

*Leave empty to use dummy fallback data.

## Project Structure

See [CLAUDE.md](./CLAUDE.md) for full project structure and conventions.

## Docs

- [CLAUDE.md](./CLAUDE.md) -- Project overview, structure, conventions
- [docs/schema.md](./docs/schema.md) -- Content schema reference
- [docs/superpowers/specs/](./docs/superpowers/specs/) -- Design spec
