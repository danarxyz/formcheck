# Tickets draft for spec 0001 — awaiting owner approval

> Output of the `to-tickets` skill, step 4 ("quiz the user"). Not yet published: once the GitHub repo exists and the breakdown is approved, publish one issue per ticket in this order, using the native blocking links.

**Already built in the foundation commit** (no ticket needed): Library schema + validation + search, Muscle taxonomy, body map, Plans module (add/remove/reorder, owner-scoped, PGlite-tested), Plan/Library/Exercise/Sign-in pages, Google auth with allowlist, E2E smoke test, CI, pre-commit, module boundaries. One draft Exercise: Conventional Deadlift.

## Proposed tickets

1. **Connect services and deploy** — `ready-for-human`
   Blocked by: none.
   Delivers: the owner can sign in with Google on localhost and on the Vercel URL, and today's Plan persists in Neon. Done by running `scripts/setup-services.sh`.

2. **Add sign-out** — `ready-for-agent`
   Blocked by: none.
   Delivers: a signed-in owner can sign out from the header; afterwards every page redirects to sign-in. Extends the E2E smoke test.

3. **Library content: deadlift and rows** — `ready-for-agent`
   Blocked by: none.
   Delivers: Trap Bar Deadlift, Barbell Row, Chest-Supported Row and Single-Arm Cable Row appear in the Library as drafts, each Cue/Fault backed by ≥2 independent Sources found with the `research` skill, each Reference Video starting at the form explanation.

4. **Library content: vertical pulls** — `ready-for-agent`
   Blocked by: none.
   Delivers: Pull-Up and Lat Pulldown as drafts, same bar as ticket 3.

5. **Library content: upper back, arms, carry, core** — `ready-for-agent`
   Blocked by: none.
   Delivers: Face Pull, Rear Delt Fly, Dumbbell Shrug, Incline Dumbbell Curl, Hammer Curl, Reverse Curl, Farmer's Carry, Hanging Leg Raise as drafts, same bar as ticket 3.

6. **Owner verification pass** — `ready-for-human`
   Blocked by: 3, 4, 5.
   Delivers: each Exercise the owner has checked against its Sources and tried at light load is flipped to `verified`; corrections land as PRs.

7. **Visual design pass** — `ready-for-human` (taste call), using the `prototype` skill
   Blocked by: none.
   Delivers: two or three variants of the Exercise page optimised for reading between sets on a phone; the owner picks one and its tokens replace the shadcn defaults.

8. **Friendly error and not-found pages** — `ready-for-agent`
   Blocked by: none.
   Delivers: an unknown Exercise, an invalid date in the URL, or a server error shows an Indonesian message with a way back to today's Plan.

## Questions for the owner

- Granularity: are the three content tickets the right size, or one ticket per Exercise?
- Is sign-out (2) needed for the MVP, given only you use the app?
- Should the design pass (7) come before the content tickets, so content is reviewed in its final layout?
