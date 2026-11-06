# The Build Log · Gargi Pathak

Portfolio for Gargi Pathak, live at **[garrgi.xyz](https://garrgi.xyz)**.

Every part of her story is a physical object: hackathons are tickets, internships print receipts, campus roles are passport stamps, research is a lab notebook and honors are cards in a hand. A live isometric figure shows how ResQ routes aid by ZIP code.

## Modes

- **Cherry blossom** (default): a branch grows in from the hero edge, blooms and throws petals; petals drift behind the page as you scroll.
- **Matcha**: a chawan being whisked, with a tea caddy and scoop; matcha powder and tea leaves rise in the background.

Toggle with the last dock button. The choice is remembered, and reduced-motion visitors get still scenes.

## Editing content

Almost all text lives in [`src/content.ts`](src/content.ts): profile and links, numbers, hackathon tickets, internships, research, campus roles and honors. Hackathon entries are data-driven, so a new win is one new object; fill `event`, `place`, `prize`, `date` and `link` when known (missing ones show `TBA`).

The resume is served from [`public/gargi-pathak-resume.pdf`](public/gargi-pathak-resume.pdf). Its phone number is removed on purpose; keep it out when replacing the file.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy

The site is deployed with the Vercel CLI (project `garrgi`), not from Git pushes:

```bash
vercel deploy --prod
```

`NEXT_PUBLIC_SITE_URL` is set to `https://garrgi.xyz` in Vercel production, and drives the canonical link, Open Graph image and sitemap. `www.garrgi.xyz` redirects to `garrgi.xyz`.

## Stack

Next.js 15 (App Router), React 19, Tailwind CSS 4, Framer Motion. The ResQ figure uses the [anatomy](https://github.com/wheresryan22/anatomy) isometric kit (MIT), copied into `src/components/iso/`.
