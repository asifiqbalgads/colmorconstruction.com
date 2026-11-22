# Colmor Construction — Homepage Redesign

A single-page, premium redesign concept for **Colmor Construction Ltd** (Groundwork & Civil Engineering, Longbridge, Birmingham), built as a plain static site for GitHub Pages.

Live business site: <https://www.colmorconstruction.com/>
This build is a **design concept**: it uses the company's real public information (services, projects, contact details, brand colours and logo) with illustrative photography.

---

## Preview locally

No build step, no dependencies. Open `index.html`, or run a tiny static server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment (GitHub Pages)

The site is ready to serve from the repository root:

1. Repository **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main` → folder `/ (root)`
4. Save — `index.html` loads automatically.

`.nojekyll` is included so no files are processed/ignored by Jekyll. All asset paths are **relative**, so it also works from a project sub-path (`/repo-name/`).

---

## Structure

```
.
├── index.html              # the homepage (all sections)
├── css/
│   └── style.css           # design system + responsive layout
├── js/
│   └── script.js           # nav, accordion, scroll & motion behaviour
├── assets/
│   ├── fonts/              # self-hosted Barlow Condensed + Manrope (woff2)
│   ├── icons/              # icon source set (SVG sprite)
│   ├── images/             # optimised WebP photography
│   └── logo/               # logo mark + favicon (SVG)
├── .nojekyll
├── robots.txt              # demo is excluded from search engines
└── README.md
```

## Design direction

Industrial editorial — the visual language of a site setting-out drawing rather than a stock template.

- **Colour:** charcoal `#101210`, warm paper `#F6F3EC`, sand `#E6DFD1`, and the brand orange `#FFAD2D` used only as an accent.
- **Type:** Barlow Condensed (display, uppercase) with Manrope (body/UI). Self-hosted, no external requests.
- **Details:** survey grid lines, drawings-style section numbering (`01 — Who we are`), hairline rules, corner ticks and cut-square buttons — no rounded card grids, no gradients-as-decoration.
- **Logo:** the existing boxed "C" mark and two-line wordmark, redrawn as crisp SVG/CSS so it stays sharp on every screen.

## Sections

1. Fixed navigation with mobile drawer and floating call button
2. Signature hero with company stats
3. Client/partner marquee
4. Who we are
5. Six core services
6. Selected work (Commercial / Infrastructure / Residential)
7. Why Colmor
8. How we work (4-stage process)
9. Coverage + service areas
10. FAQ accordion
11. Final CTA with direct contact card
12. Footer with full contact details

## Notes

- **No backend, no form.** Contact actions use the real phone number, email address and postal addresses, so no fake "message sent" state exists.
- **Accessibility:** semantic landmarks, skip link, visible focus states, `aria-expanded` accordions, full keyboard support in the mobile menu, and reduced-motion support.
- **Performance:** self-hosted `woff2` subsets, WebP imagery, inline SVG icons, no JS libraries.
- **Photography:** AI-generated and illustrative — presented as craft imagery, not as Colmor's own project photography. The logo appears on operative clothing in the brand portraits.
- **Indexing:** `noindex, nofollow` plus `robots.txt` keep this concept out of search results so it never competes with the live website.

## Contact details used

- **Phone:** 0121 222 5313 — `tel:+441212225313`
- **Email:** Info@Colmorconstruction.co.uk
- **Trading address:** 1 Devon Way, Longbridge, Birmingham B31 2TS
- **Registered address:** 1623 Warwick Road, Knowle, Solihull B93 9LF
