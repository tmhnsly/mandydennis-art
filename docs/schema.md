# Content Schema Reference

Canonical source: `studio/schemas/` (Sanity Studio schema definitions)

This document summarises the content model. If this doc and the schema files disagree, the schema files are the source of truth.

## Content Types

### artwork
Document type for individual pieces of art.

| Field       | Sanity Type       | Required | Notes                              |
|-------------|-------------------|----------|------------------------------------|
| title       | string            | yes      |                                    |
| slug        | slug              | yes      | Source: title                      |
| image       | image (hotspot)   | yes      |                                    |
| description | text (3 rows)     | no       |                                    |
| medium      | array of string   | yes      | Select widget, predefined list     |
| subject     | array of string   | yes      | Select widget, predefined list     |
| featured    | boolean           | no       | Default: false                     |
| date        | date              | yes      | Default: today                     |

**Medium values:** pastel, watercolour, pencil, oil, charcoal, mixed media, acrylic, ink
**Subject values:** pets, dogs, cats, horses, people, landscape, still life, wildlife, flowers, buildings

Frontend GROQ query returns: `slug` (string from slug.current), `image` (Sanity image object), all other fields as-is.

### event
Document type for exhibitions, galleries, talks.

| Field       | Sanity Type | Required |
|-------------|-------------|----------|
| title       | string      | yes      |
| slug        | slug        | yes      |
| date        | date        | yes      |
| location    | string      | yes      |
| description | text (4 rows)| yes     |
| link        | url         | no       |

### commissionCategory
Document type for a pricing category (e.g. "Pet Portraits in Pastels").

| Field    | Sanity Type      | Required |
|----------|------------------|----------|
| title    | string           | yes      |
| slug     | slug             | yes      |
| options  | array of objects | yes      |
| addons   | array of objects | no       |
| included | text (2 rows)    | no       |
| notes    | text (2 rows)    | no       |

**options** object: `{ size: string, description: string, price: number }`
**addons** object: `{ description: string, price: number }`

Prices are stored as integers (pence/cents not needed -- whole currency units). Currency symbol comes from siteSettings.

### siteSettings (singleton)
Global site configuration. Only one document of this type should exist.

| Field           | Sanity Type | Required | Default |
|-----------------|-------------|----------|---------|
| tagline         | string      | yes      |         |
| contact_email   | string      | yes      |         |
| facebook_url    | url         | no       |         |
| currency_symbol | string      | yes      | £       |

### about (singleton)
About page content. Only one document of this type should exist.

| Field | Sanity Type     | Required |
|-------|-----------------|----------|
| bio   | text (8 rows)   | yes      |
| photo | image (hotspot) | no       |

## Frontend Type Mapping

TypeScript interfaces in `src/types.ts` mirror the schema:

| Sanity Type         | TypeScript Interface   |
|---------------------|------------------------|
| artwork             | Artwork                |
| event               | ArtEvent               |
| commissionCategory  | CommissionCategory     |
| siteSettings        | SiteSettings           |
| about               | AboutPage              |

Image fields are typed as `SanityImage` (any) since they're Sanity image reference objects passed to `urlFor()`.

## Adding a New Content Type

1. Create schema in `studio/schemas/newType.ts`
2. Export from `studio/schemas/index.ts`
3. Add TypeScript interface in `src/types.ts`
4. Add GROQ query + dummy fallback in `src/lib/content.ts`
5. Create page/component to display it
6. Update this doc
