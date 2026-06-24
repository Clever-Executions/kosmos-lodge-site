# Kosmos Lodge — Website

Marketing site for Kosmos Lodge. Content is managed in **Sanity CMS** and the site is an
**Astro** build (hybrid output) deployed as a **Cloudflare Worker**, redeploying
automatically on every code push *and* every content edit.

## Stack

| Layer    | Tool                                                                 |
| -------- | ------------------------------------------------------------------- |
| Frontend | [Astro 4](https://astro.build) — `output: "hybrid"`, `@astrojs/cloudflare` adapter |
| CMS      | [Sanity v3](https://www.sanity.io) (Studio in `studio/`)             |
| Data     | GROQ queries via `@sanity/astro` + `@sanity/client` (`useCdn: false`)|
| Hosting  | [Cloudflare Workers](https://workers.cloudflare.com) (continuous deploy from GitHub `main`) |
| Repo     | https://github.com/Clever-Executions/kosmos-lodge-site              |

## How it fits together

```
Editor changes content in Sanity Studio (kosmoslodge.sanity.studio)
        │  (Sanity webhook → Cloudflare deploy hook)
        ▼
Cloudflare runs `npm run build`  ◄── also triggered by any push to GitHub `main`
        │  Astro fetches live content from Sanity via GROQ at build time
        ▼
dist/ (worker + static assets)  →  wrangler deploy  →  served by the Worker
```

Because the build pulls content fresh from Sanity (`useCdn: false`), a rebuild is all
that's needed to publish content changes — there is no separate content deploy.

## Project structure

```
kosmos-lodge-site/
├── astro.config.mjs     # Astro config; @sanity/astro + @astrojs/cloudflare; reads PUBLIC_SANITY_* via loadEnv
├── wrangler.jsonc       # Cloudflare Worker config (name, compatibility, assets binding, main entry)
├── .node-version        # Pins Node for the Cloudflare build (Wrangler requires Node ≥ 22)
├── package.json         # Astro + @sanity/astro + @sanity/client + groq + wrangler
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

Both are **public, non-secret** identifiers (baked into the `build` script in `package.json`):

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
npm run preview    # build + run the Worker locally via `wrangler dev`
```

Editing CMS schema/Studio:

```bash
cd studio
npm install
npx sanity dev      # local Studio
npx sanity deploy   # publish Studio to kosmoslodge.sanity.studio
```

## Deployment

Hosted on **Cloudflare Workers**. The build runs `npm run build` (Astro) and deploys with
`npx wrangler deploy`.

- **Code changes:** every push to `main` triggers a rebuild + deploy on Cloudflare.
- **Content changes:** a Sanity webhook calls a Cloudflare deploy hook so edits in the
  Studio auto-rebuild the site (see "Auto-redeploy" below).
- **Env vars are baked into the `build` script in `package.json`** (`PUBLIC_SANITY_PROJECT_ID`,
  `PUBLIC_SANITY_DATASET`) rather than left to dashboard configuration. Both values are
  public, non-secret identifiers, so this is safe — it makes the build deterministic and
  avoids per-environment dashboard env var scoping footguns.
- **Node version:** Wrangler requires Node ≥ 22. The Cloudflare build environment defaults
  to an older Node (v20.x), so the version is pinned via `.node-version` (a *fully
  qualified* version — Cloudflare ignores a bare major like `22`). If a build still reports
  the wrong Node version, also set a `NODE_VERSION` build variable in the dashboard
  (Workers & Pages → the project → Settings → Build → Variables and Secrets), which always
  wins.

### Cloudflare setup

1. Cloudflare dashboard → **Workers & Pages** → connect the GitHub repo
   `Clever-Executions/kosmos-lodge-site` (Workers Builds).
2. Build command: `npm run build`. Deploy command: `npx wrangler deploy`. Root directory: `/`.
3. No environment variables need to be set in the dashboard for the build — they're baked
   into the build script (see above). Set `NODE_VERSION=22.16.0` only if `.node-version`
   isn't being honored.
4. After the first successful deploy, create a **Deploy hook** for `main` and add it as a
   Sanity webhook (see below) so content edits trigger rebuilds.
5. Point `kosmoslodge.co.za` DNS at the Cloudflare custom domain.

### Auto-redeploy on content changes (setup)

1. **Cloudflare:** create a deploy hook for branch `main`. Copy the generated URL.
2. **Sanity:** sanity.io/manage → project `j7q2a1is` → API → Webhooks → *Create webhook*
   for the deploy hook URL above, dataset `production`, trigger on create/update/delete.
   Now every published content change rebuilds and redeploys the site.
