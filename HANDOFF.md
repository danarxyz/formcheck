# Handoff — continue Formcheck in Claude Code

Written at the end of the first session (planning + foundation, built in a cloud workspace). Delete this file once the next session has picked it up.

## Where things stand

- **Decisions** (stack, scope, content policy) were made in a grilling session. They are captured in `docs/specs/0001-mvp-form-library-and-plans.md`, `CONTEXT.md` and `docs/adr/` — read those, don't re-ask.
- **Foundation is built and green**: `pnpm check` (typecheck, lint, boundaries, 40 unit tests) and `pnpm test:e2e` (2 smoke tests) pass; `pnpm build` works without secrets.
- **Not yet done**:
  1. No GitHub repo yet. Create an empty private repo, then `git remote add origin … && git push -u origin main`.
  2. Services not connected. Run `bash scripts/setup-services.sh` (Neon, Google OAuth, `.env.local`, migrations, Vercel).
  3. Tickets are drafted but not approved or published: `docs/specs/0001-tickets-draft.md`. Publish the spec and tickets to GitHub Issues after the owner approves.
  4. The Library has one draft Exercise (Conventional Deadlift). Its Reference Video was not watched; check it.
- **Decisions taken while the owner was away — confirm with them**:
  - Test seams: Library validation, the Plans interface, one E2E smoke path.
  - Git guardrails at project scope (`.claude/settings.json`). Plain `git push` of a feature branch is allowed so PRs work; force-push, push to main, `reset --hard`, `clean -f`, `branch -D`, `checkout .` are blocked.
  - Reordering uses up/down buttons (no drag and drop).
  - Dark mode follows the OS; no toggle.

## Setup on this laptop (Windows)

1. Install Claude Code if needed, then from this folder: `pnpm install`.
2. Matt Pocock's skills are not part of the repo. Install them in Claude Code through `/plugin` (marketplace: the `mattpocock/skills` GitHub repo). If that marketplace path has changed, search for "mattpocock skills" — don't guess.
3. Hooks run `node`, so they work in Git Bash and PowerShell alike.

## Suggested skills, in order

1. `to-tickets` — finish step 4 with the owner using the draft above, then publish (needs the repo).
2. `wizard` output is already in `scripts/setup-services.sh`; just run it.
3. `research` — gather Sources for each content ticket before writing Exercises.
4. `implement` (drives `tdd`, ends with `code-review`) — one ticket per fresh session.
5. `prototype` — for the visual design ticket.
6. `pr` — PR bodies; `triage` — new issues; `improve-codebase-architecture` — after a few tickets land; `retro` — at the end of a session.
