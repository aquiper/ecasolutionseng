# ecasolutionseng.com — EC&A Solutions Eng LLC

Static HTML/CSS/JS. No React, no npm, no build step. GitHub Pages serves it as-is.

## Deploy

Copy every file here into the repo root, replacing what is there.
`CNAME` is included and set to `ecasolutionseng.com` — do not delete it.
Website DNS only. MX / Google Workspace mail untouched.

    git add -A && git commit -m "site update" && git push

**These are whole-file replacements.** Any file on `main` not listed below is an
orphan — it will stay live and stay indexed. Run `git status` after copying and
delete anything stale.

## File list

    index.html  about.html  contact.html  services.html
    services/integrity.html  fracture.html  materials.html  welding.html  inspection.html
    tools.html  insights.html
    notes/co2-transport.html  notes/h2-transport.html
    work/case-01.html  work/case-02.html
    404.html  robots.txt  sitemap.xml  CNAME
    css/styles.css  js/fad.js  js/site.js
    assets/aquiles.jpg   <-- YOU MUST ADD THIS FILE

## Two things needed before this is fully live

**1. `assets/aquiles.jpg`** — not supplied. The About page references it and will
show a broken image until you drop it in. Studio headshot, gray backdrop,
roughly 520x650 px. Not the office selfie.

**2. FormSubmit activation** — one-time. Submit the contact form once from the
live domain, then click the confirmation link emailed to
aquiles.perez@ecasolutionseng.com. Until you do, submissions fail and the form
falls back to opening the visitor's mail client. Nothing is silently lost.

## Deliberately not included

- No PE. No professional-engineer licence claimed anywhere on the site.
- No analytics.
- No street address, no Google Business Profile, no map pack.
- No invented outcome numbers. `work/case-01.html` and `case-02.html` are slot
  templates: [OPERATOR] [SYSTEM] [INDICATION] [CODE OF RECORD] [DECISION] [OUTCOME].
  Slots render as blue-underlined markers so nothing ships half-filled.
- Sway notes still link out. `notes/*.html` are ready for the raw text when you
  paste it.

## Hero copy is locked per brief

    Eyebrow:  Houston · Oil, gas, CCUS, ammonia, hydrogen
    Title:    Advanced engineering services.
    Lede:     Specialized engineering from an independent firm.
    Line 3:   Materials, mill qualification, corrosion, and inspection of critical components.
    Footer:   Specialized engineering from an independent firm.

## The FAD

`js/fad.js` draws the API 579-1 Level 2 Option 1 envelope:

    Kr = (1 - 0.14 Lr^2)(0.30 + 0.70 exp(-0.65 Lr^6)),  Lr 0 .. 1.25

Point set by `data-lr` / `data-kr` on the `<svg>` in `index.html`. Default
0.55 / 0.42, inside the envelope, CAD blue. A point outside turns oxide and
relabels itself. Oxide is used for nothing else on the site.

## Palette and type

    paper #E8EBEA   ink #10161B   CAD #1B54C8   oxide #A83A1E (out-of-envelope only)
    Archivo (display) / IBM Plex Serif (body) / IBM Plex Mono (citations, data, captions)

## Validate after editing

- Structured data: https://validator.schema.org
- HTML: https://validator.w3.org
