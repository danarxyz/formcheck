# Packages are deep modules

Each folder here is a **deep module**: a lot of behaviour behind a small interface.

```
src/packages/<name>/
  index.ts      ← entry point (public). Import this from outside.
  Other.tsx     ← another entry point, if a package needs one (e.g. a client component).
  lib/          ← implementation. Private.
  tests/        ← tests + fixtures. Private; tests import entry points only.
```

**Entry-point boundary.** Code outside a package imports only its root files, never anything in a subfolder. Need something from `lib/`? Export it from an entry point — or ask whether it should be public at all.

**Intra-package freedom.** A package's own files import each other freely.

**Tests through the entry points.** Tests exercise the package exactly as callers do, so refactoring `lib/` never breaks them.

**No cycles.**

**No barrels.** Prefer several small entry points over one `index.ts` that re-exports a whole subtree.

**Framework-free.** Packages don't import app, UI, server or auth code (ESLint enforces this). The one exception: `body-map` renders React, through its own `BodyMap.tsx` entry point.

Check with `pnpm lint:boundaries` (also part of `pnpm check` and the pre-commit hook).

| Package    | What it owns                                                 |
| ---------- | ------------------------------------------------------------ |
| `library`  | Exercise content, Muscle taxonomy, content rules, search     |
| `plans`    | Plans: the rules for adding, removing, reordering; PlanDates |
| `body-map` | Turning Target Muscles into highlighted body regions         |
