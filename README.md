# Fare Moana – Angular

Angular 21 rebuild of the Fare Moana dive-centre website (standalone components, signals, zoneless, lazy-loaded routes).

## Scripts

```bash
npm start          # dev server on http://localhost:4200
npm run build      # production build → dist/faremoana
npm test           # unit tests (Vitest)
```

Requires Node ≥ 20.19 / 22.12 / 24.

## Structure

```
src/app/
├── core/
│   ├── models/content.models.ts   # typed content model
│   ├── content/                   # ALL site content lives here
│   │   ├── site.ts                # contact details, socials, logo/badge paths
│   │   ├── catalog.ts             # every category & course page (drives routes + menu)
│   │   ├── events.ts              # trips and club outings
│   │   └── home.ts                # homepage slides, services, reasons, videos
│   └── services/content.service.ts
├── layout/                        # header (mega menu + mobile off-canvas), footer
├── shared/components/             # icon, media, logo, page-hero, cards, section heading
└── pages/
    ├── home/                      # homepage + hero slider
    ├── catalog/                   # generic page: category | course | page
    ├── events/                    # events list + event detail
    ├── contact/
    └── not-found/
```

## Styling

All colours, fonts, gradients, shadows and radii are global CSS variables in
`src/styles/_tokens.scss` (values from the original Elementor kit: Poppins / Inter / Montserrat,
turquoise `#29D9D5`, navy `#102A62`). Components never hard-code colours — change a token and it
applies everywhere. Breakpoints: 1024px (tablet) and 767px (mobile).

## Editing content

- **Add a course**: add an entry under the right category in `catalog.ts`. The route, the menu link and
  the “Plus de cours” suggestions are generated automatically. URLs match the WordPress site.
- **Course details**: fill `intro`, `included`, `requirements`, `prices`, `videoId` (YouTube id), `image`.
- **Events**: edit `events.ts`; the homepage promo shows the first `voyage`.
- **Page blocks** (any page in `catalog.ts`): `sections` (text + check-lists), `cards` (card grid —
  `'children'` or `'voyages'`), `priceBox`, `priceTable`, `partners`, `showElearning`.
- **Videos**: add YouTube ids to `VIDEOS` in `home.ts` (the section is hidden while empty).

The copy currently in these files is placeholder text — replace it with the final content.

## Images

Images are imported from the WordPress media library with:

```bash
python3 scripts/import-uploads.py ~/Downloads/uploads --live
```

It copies each file from the local `uploads` export into its slot (resized, converted); with
`--live`, files missing from the export are fetched from `faremoana.ch/wp-content/uploads/`
(cached in `.cache/`, git-ignored). Edit the `MAP` in the script to change which file fills a slot.

Put images in `public/images/` at the paths referenced in the content files, e.g.

| Path | Used for |
| --- | --- |
| `images/brand/logo.png` | header & footer logo (text wordmark shown until present) |
| `images/brand/padi-5-star-idc.jpg` | PADI 5 Star badge (header right, footer) |
| `images/home/slide-*.jpg` | hero slider |
| `images/home/welcome-{1,2,3}.jpg` | welcome collage |
| `images/home/service-*.jpg` | service cards |
| `images/events/*.jpg` | event cards / detail pages |
| `images/heroes/*.jpg` | inner-page banners (`default.jpg`, `voyages.jpg`, `services.jpg`, `club.jpg`, `gonflage.jpg`, `location.jpg`, `partenaires.jpg`, `elearning.jpg`, `formations-loisirs.jpg`, `evenements.jpg`, `contact.jpg`) |
| `images/services/*.jpg` | service cards (`club`, `gonflage`, `location`, `partenaires`) |
| `images/partners/*.png` | partner logos (name shown as text until present) |

Any missing image falls back to an ocean-gradient placeholder, so the layout never breaks.

## SEO

- Every route is **prerendered** to static HTML at build time (`outputMode: "static"`), so crawlers get full content.
- `core/seo/seo.service.ts` sets per page: title, meta description, canonical URL (trailing slash, like the
  old WordPress URLs), robots, Open Graph and Twitter tags, and JSON-LD (dive centre as `LocalBusiness`,
  `BreadcrumbList`, `Course` with CHF offers, `Event` with ISO dates).
- `npm run build` also writes `sitemap.xml` and `404.html` (`scripts/postbuild.mjs`); `public/robots.txt`
  points to the sitemap.
- Favicons: `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192/512.png`, `site.webmanifest`.

## Deployment

Upload `dist/faremoana/browser/` to any static host (Netlify, Vercel, Cloudflare Pages, nginx…).
Enable gzip/brotli compression (most hosts do it by default) and configure the host to serve `404.html`
for unknown paths. Images are WebP with 800px variants for full-width banners.
