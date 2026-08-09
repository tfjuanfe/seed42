# Seed42

Free Spanish-language platform where Colombian high school students (15–17)
learn AI through interactive browser exercises. Launches 20 August 2026.

All user-facing copy is Spanish; all code, comments, and commits are English.

## Stack

Next.js (App Router) · TypeScript strict · Tailwind v4 · Drizzle + Neon
Postgres (pooled) · MDX content in `/content/modules/` · Vercel.

## Development

```bash
npm install
cp .env.example .env.local   # fill in the pooled Neon DATABASE_URL
npm run dev
```

Database schema lives in `src/db/schema.ts`; push it with
`npx drizzle-kit push` (uses the direct URL if `DATABASE_URL_UNPOOLED` is set).

## Project docs

The full brief and specifications are in [docs/](docs/).
