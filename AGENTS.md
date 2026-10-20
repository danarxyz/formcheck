<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Formcheck

Personal app for seeing correct exercise form while training. Read `CONTEXT.md` (the domain language) before naming anything, and `docs/adr/` before changing how the Library, Muscles or data storage work. The MVP spec is `docs/specs/0001-mvp-form-library-and-plans.md`.

## Commands

- `pnpm check` — typecheck, lint, module boundaries, unit tests. Must pass before every commit (the pre-commit hook runs it).
- `pnpm test` / `pnpm test:watch` — Vitest. Plan tests run against real Postgres (PGlite) with the real migrations.
- `pnpm test:e2e` — Playwright smoke test against a throwaway Postgres (`E2E_DATABASE_URL`, default `postgres://postgres:postgres@127.0.0.1:5432/formcheck_e2e`).
- `pnpm db:generate` after editing `src/db/schema.ts`; commit the generated SQL in `drizzle/`.
- `pnpm dev` needs `.env.local` — create it with `bash scripts/setup-services.sh`.

## Where rules live (code first, prose second)

Rules are enforced in code; this file only points at them. If you break one, the tooling tells you why.

- **Exercise content rules** → the Zod schema in `src/packages/library/lib/schema.ts`. Invalid content fails tests and build.
- **Muscle taxonomy** (closed set) → `src/packages/library/muscles.ts`. Adding a Muscle forces a body-map region (compile error otherwise).
- **Plan rules** → `src/packages/plans/tests/plans.test.ts` is the specification.
- **Module boundaries** → `.dependency-cruiser.cjs`; see [src/packages/README.md](./src/packages/README.md) before adding or importing a package.
- **Env access** only via `serverEnv()` in `src/env.ts` (ESLint blocks `process.env` elsewhere).
- **Body map renderer** only behind `<BodyMap>` (ESLint, ADR-0002).
- **UI strings** in `src/copy.ts`. Cues/Faults are Indonesian; code, identifiers and Exercise/Muscle names are English.

## Working conventions

- Test-first (`tdd` skill) at the seams in the spec: Library validation, the Plans interface, one E2E smoke path. No component or snapshot tests.
- New Exercise: copy `src/packages/library/lib/exercises/conventional-deadlift.ts`, register it in `src/packages/library/index.ts`, every Cue/Fault backed by ≥2 independent Sources, `verification: "draft"`. Only the owner sets `"verified"`.
- Never put tracking (sets, reps, load, completion) into a Plan — out of scope until a new spec says otherwise.
- Pages: Library/Exercise pages are static; anything reading the session goes inside `<Suspense>` (Cache Components is on).

## Agent skills

### Issue tracker

Issues and specs live in GitHub Issues for this repo, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
