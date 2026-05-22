# Delower Hossen Tuhin — Personal Research Portfolio

A cinematic, research-focused personal website built with Next.js 14, TypeScript, Tailwind, Framer Motion, and MongoDB.

The site has two halves that share one codebase:

- A **public site** with nine pages — home, about, skills, research, resume, blog, gallery, cinematic journal, contact.
- A **private admin dashboard** at `/admin` for managing every dynamic surface of the site without redeploying.

It's designed to look like a serious researcher's portfolio (Apple/Vercel/Linear cues), not a generic developer template. Dark-first palette, light blue → deep blue gradients, restrained motion.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in your own values
cp .env.example .env.local

# 3. (Optional but recommended) Seed the admin user in MongoDB
npm run seed:admin

# 4. Start the dev server
npm run dev
```

The site is now at <http://localhost:3000>. The admin dashboard lives at <http://localhost:3000/admin/login>.

> **Preview without a database.** If you don't set `MONGODB_URI`, every public page still renders from the seed data in `src/data/site.ts`, and you can sign into the admin using the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you put in `.env.local`. Admin writes are disabled in this mode — a banner explains why.

---

## Architecture in one paragraph

Content is **hybrid static + dynamic**. The single source of truth for seed content is `src/data/site.ts` — it ships with the CV, all 7 publications, 3 blog posts, 12 cinema entries, and 5 gallery items already encoded. Public pages always render that data first, then layer database content on top when `MONGODB_URI` is configured. This means the site looks finished the moment you clone it, before any database setup. The admin dashboard adds, edits, or removes records via REST API routes (`/api/blogs`, `/api/research`, …) protected by NextAuth credentials. Email delivery is Resend-first with a Nodemailer SMTP fallback. Auth uses JWT sessions with bcrypt-hashed credentials and an in-memory dev-mode fallback for previewing the admin without Mongo.

---

## Project structure

```
portfolio/
├── public/
│   ├── cv/Delower_Hossen_Tuhin_CV.pdf      # Public CV (replace to update)
│   └── images/{profile,gallery}/…           # All static images
├── scripts/
│   └── seed-admin.ts                        # Creates the admin user
├── src/
│   ├── app/
│   │   ├── (public pages)                   # /, /about, /skills, /research, /resume,
│   │   │                                    # /blog, /gallery, /cinematic-journal, /contact
│   │   ├── admin/                           # Login + dashboard (route group)
│   │   │   ├── login/                       # /admin/login (outside protected layout)
│   │   │   └── (dashboard)/                 # everything else (requires session)
│   │   ├── api/                             # Route handlers for all CRUD + auth + contact + newsletter
│   │   ├── layout.tsx                       # Root layout (fonts, OG, theme)
│   │   ├── globals.css                      # Custom CSS variables, prose styles
│   │   ├── robots.ts / sitemap.ts           # SEO
│   │   └── page.tsx                         # Home page
│   ├── components/                          # All UI components, grouped by section
│   ├── data/site.ts                         # Seed content — edit this for static facts
│   ├── lib/                                 # auth, mongodb, email, utils, requireAdmin
│   └── models/                              # Mongoose schemas
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Environment variables

Copy `.env.example` → `.env.local` and fill in:

| Variable                 | Required        | Purpose                                                                 |
| ------------------------ | --------------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`   | Production only | Used in metadata, sitemap, robots.                                      |
| `MONGODB_URI`            | For persistence | MongoDB Atlas connection string. Leave blank to run on seed data only.  |
| `NEXTAUTH_SECRET`        | Always          | Sign JWT sessions. Generate with `openssl rand -base64 32`.             |
| `NEXTAUTH_URL`           | Production      | Canonical URL of the site (e.g. `https://tuhin.dev`).                   |
| `ADMIN_EMAIL`            | Always          | Login email for the admin dashboard.                                    |
| `ADMIN_PASSWORD`         | Always          | Login password. The seed script hashes it with bcrypt before storing.   |
| `ADMIN_NAME`             | No              | Display name in the admin sidebar.                                      |
| `RESEND_API_KEY`         | Recommended     | Used for contact-form email delivery.                                   |
| `CONTACT_FROM_EMAIL`     | With Resend     | Verified sender domain in your Resend account.                          |
| `CONTACT_TO_EMAIL`       | No              | Inbox that receives messages. Defaults to the profile email.            |
| `SMTP_HOST` / `SMTP_*`   | Fallback        | Used when `RESEND_API_KEY` is empty.                                    |

---

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel — the default Next.js build settings work as-is.
3. Add every variable from your `.env.local` to the Vercel project's **Environment Variables** panel.
4. (One time) From a terminal with `MONGODB_URI` pointed at your Atlas cluster, run `npm run seed:admin` to create the admin user.
5. Trigger a deploy. The first cold start may take ~3 seconds while it warms the Mongoose connection.

A free MongoDB Atlas cluster (M0) is enough for personal traffic. Whitelist `0.0.0.0/0` in Atlas's network rules so Vercel functions can reach it.

---

## Using the admin dashboard

Sign in at `/admin/login` with your `ADMIN_EMAIL` / `ADMIN_PASSWORD`. The sidebar gives you:

- **Overview** — counts and recent messages at a glance.
- **Blog** — Markdown editor with category, tags, cover color, featured/published toggles. GitHub-flavored markdown is supported on the public side.
- **Research** — full publication form with authors, keywords, venue/publisher, status, DOI.
- **Gallery** — add new images by uploading them to `/public/images/gallery/` and referencing the path. Aspect-ratio span (normal/tall/wide) drives the masonry layout.
- **Cinema** — log films and TV with star ratings, review, quote, watch date, poster colour. Pose colour drives the gradient placeholder; copyright-friendly.
- **Messages** — every contact-form submission, with mark-read and reply-by-email actions.
- **Subscribers** — newsletter signups with CSV export.
- **Resume** — instructions for updating the CV PDF (commit a new file to `/public/cv/` and redeploy).

Seed records (the ones that ship in `src/data/site.ts`) are read-only in the admin — they show a "Seed" badge. Editing them means editing the data file. Records you add through the dashboard live in MongoDB and can be edited or deleted freely.

---

## Customising the static content

For anything that ships out of the box (publications, skills, achievements, education timeline, the philosophy block on the home page, the bio paragraphs on About), edit `src/data/site.ts`. It's strongly typed — TypeScript will catch missing fields the moment you save.

- **Replace the CV** — drop a new PDF at `public/cv/Delower_Hossen_Tuhin_CV.pdf` (or change the path in `src/data/site.ts`).
- **Replace the photos** — drop new images into `public/images/profile/` and `public/images/gallery/` using the same filenames, or update `src/data/site.ts` to point at new ones.
- **Tune the palette** — `tailwind.config.ts` defines the `ink`, `azure`, and `sky` colour scales. Change a single hex value and the whole site shifts.
- **Add a new page** — drop a `page.tsx` under `src/app/your-route/` and add a link in `src/components/layout/Navbar.tsx`.

---

## Tech notes

- **Framework** — Next.js 14 App Router, React 18, all server components by default, client islands only where interaction is needed.
- **Styling** — Tailwind CSS + custom CSS variables. Fonts are loaded via `next/font` (Fraunces / Inter / JetBrains Mono).
- **Animation** — Framer Motion for page-level reveals (always behind `prefers-reduced-motion`).
- **Auth** — NextAuth credentials provider, JWT sessions, bcrypt password hashing.
- **Database** — MongoDB via Mongoose. Schemas are in `src/models/`. The global connection cache lives in `src/lib/mongodb.ts`.
- **Email** — Resend SDK first, Nodemailer SMTP fallback. The handler in `src/lib/email.ts` is the only place that talks to a transport.
- **SEO** — `app/robots.ts` and `app/sitemap.ts` generate the standard pair from `NEXT_PUBLIC_SITE_URL` + blog slugs.

---

## Known limitations / extension ideas

- **File uploads** — the gallery currently expects images to be committed to `/public/`. To upload from the admin, plug in S3, Cloudinary, or Vercel Blob; the route handler in `src/app/api/gallery/route.ts` is where to wire it.
- **Comments / reactions** — not included to keep the surface area small.
- **Search** — the blog has client-side filter only. For a larger archive, add Algolia or pg_search.
- **Spam protection** — Turnstile env vars are scaffolded in `.env.example` but not wired into the contact form yet. Add the script and the verification call when traffic warrants.
- **Email confirmation for subscribers** — single-opt-in for now. Double opt-in needs a token table and a confirmation email.

---

## License

Personal portfolio — code is yours to fork and adapt. The content (CV, photos, publications, writing) is © Delower Hossen Tuhin.

---

*Built with care. Apple-influenced, research-first, and intentionally quiet.*
