# Kosmos Lodge — Website

Marketing site for Kosmos Lodge. Content is managed in **Sanity CMS** and the site is
a **static Astro** build deployed on **Netlify**, redeploying automatically on every
code push *and* every content edit.

## Stack

| Layer    | Tool                                                                 |
| -------- | ------------------------------------------------------------------- |
| Frontend | [Astro 4](https://astro.build) — `output: "static"`                  |
| CMS      | [Sanity v3](https://www.sanity.io) (Studio in `studio/`)             |
| Data     | GROQ queries via `@sanity/astro` + `@sanity/client` (`useCdn: false`)|
| Hosting  | Netlify (continuous deploy from GitHub `main`)                       |
| Repo     | https://github.com/Clever-Executions/kosmos-lodge-site              |

## How it fits together

```
Editor changes content in Sanity Studio (kosmoslodge.sanity.studio)
        │  (Sanity webhook → Netlify build hook)
        ▼
Netlify runs `npm run build`  ◄── also triggered by any push to GitHub `main`
        │  Astro fetches live content from Sanity via GROQ at build time
        ▼
Static HTML in `dist/`  →  served at the *.netlify.app URL
```

Because the build pulls content fresh from Sanity (`useCdn: false`), a rebuild is all
that's needed to publish content changes — there is no separate content deploy.

## Project structure

```
kosmos-lodge-site/
├── astro.config.mjs     # Astro config; @sanity/astro integration; reads PUBLIC_SANITY_* via loadEnv
├── netlify.toml         # build = "npm run build", publish = "dist"; Sanity env vars baked in
├── package.json         # Astro + @sanity/astro + @sanity/client + groq
├── public/              # Static assets served as-is (images, logo, favicons)
│   └── assets/images/   # Room, gallery, hero imagery
├── scripts/
│   └── seed.mjs         # One-off content seeder (needs SANITY_API_WRITE_TOKEN env var)
├── src/
│   ├── components/Layout.astro
│   ├── pages/           # index, rooms, rooms/[slug], explore, explore/[slug], specials
│   └── utils/
│       ├── sanity.ts    # Sanity client setup
│       └── queries.ts   # GROQ queries
└── studio/              # Sanity Studio — SEPARATE npm package (its own node_modules)
    ├── sanity.config.ts # Schema types: room, special, activity, siteSettings, homePage
    └── sanity.cli.js    # projectId, dataset, studioHost
```

## Sanity project

- **Project ID:** `j7q2a1is`
- **Dataset:** `production` (publicly readable — no token needed for reads/builds)
- **Studio:** https://kosmoslodge.sanity.studio
- **Schema types:** `room`, `special`, `activity`, `siteSettings`, `homePage`
  (`siteSettings` and `homePage` are singletons)

## Environment variables

Both are **public, non-secret** identifiers (already set in `netlify.toml`):

```
PUBLIC_SANITY_PROJECT_ID=j7q2a1is
PUBLIC_SANITY_DATASET=production
```

For local dev, put them in a gitignored `.env` (Astro reads them via `loadEnv`).
The seed script additionally needs a write token (`SANITY_API_WRITE_TOKEN`) — generate
one at sanity.io/manage only when re-seeding; it is **not** stored in the repo.

## Local development

```bash
git clone https://github.com/Clever-Executions/kosmos-lodge-site.git
cd kosmos-lodge-site
npm install
printf 'PUBLIC_SANITY_PROJECT_ID=j7q2a1is\nPUBLIC_SANITY_DATASET=production\n' > .env
npm run dev        # local preview at http://localhost:4321
npm run build      # production build → dist/  (fetches live Sanity content)
```

Editing CMS schema/Studio:

```bash
cd studio
npm install
npx sanity dev      # local Studio
npx sanity deploy   # publish Studio to kosmoslodge.sanity.studio
```

## Deployment

- **Hosting:** Netlify, connected to the GitHub repo for continuous deployment.
- **Code changes:** every push to `main` triggers a Netlify rebuild + deploy.
- **Content changes:** a Sanity webhook calls a Netlify **build hook** so edits in the
  Studio auto-rebuild the site (see "Auto-redeploy" below).
- Build settings come from `netlify.toml` — no manual config in the Netlify UI.

### Auto-redeploy on content changes (setup)

1. **Netlify:** Site configuration → Build & deploy → Build hooks → *Add build hook*
   (branch `main`). Copy the generated URL.
2. **Sanity:** sanity.io/manage → project `j7q2a1is` → API → Webhooks → *Create webhook*,
   paste the Netlify build hook URL, dataset `production`, trigger on
   create/update/delete. Now every published content change rebuilds the site.
