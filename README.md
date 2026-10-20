# Formcheck

See correct form before you lift. Pick Exercises from a curated Library into today's Plan, then open each one for its target muscles, form cues, common faults and a reference video.

Private, single-user. Next.js 16 · TypeScript · Drizzle + Neon Postgres · Better Auth (Google) · Tailwind + shadcn/ui · Vercel.

## Start

```bash
pnpm install
bash scripts/setup-services.sh   # Neon, Google sign-in, .env.local, migrations, Vercel
pnpm dev
```

## Read first

- `CONTEXT.md` — the domain language
- `docs/specs/` — what we're building
- `docs/adr/` — decisions that look surprising without context
- `AGENTS.md` — commands and conventions (also loaded by Claude Code via `CLAUDE.md`)
