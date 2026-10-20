# Spec: MVP — Exercise form Library and daily Plans

> To be published as a GitHub issue with the `ready-for-agent` label once the repo exists. Vocabulary follows `CONTEXT.md`; decisions respect ADR-0001 and ADR-0002.

## Problem Statement

When I train, I don't have a clear picture of correct form for each Exercise: which muscles should be doing the work, what correct execution looks like, and what the common ways of doing it wrong are. Searching YouTube mid-session is slow, results vary wildly in quality, and the useful part of a video is buried. I also want a light way to note which Exercises I intend to do on a given day, without the app policing whether I actually did them.

## Solution

A personal web app with a curated Library of Exercises. Each Exercise shows its Target Muscles (primary and secondary, named precisely and highlighted on a body map), a handful of short Cues for correct form, its common Faults and their consequences, and a Reference Video that starts at the relevant moment. I can pick Exercises from the Library to build the Plan for any date, reorder them, and open any Exercise in the Plan to see its form guidance while training.

The first Library contains the 13 Exercises of my pull day. A Form Animation is the long-term replacement for the Reference Video but is not part of this MVP; the Exercise model reserves room for it.

## User Stories

### Browsing the Library

1. As the owner, I want to see every Exercise in the Library, so that I know what I can pick from.
2. As the owner, I want to see each Exercise's primary Target Muscles in the Library list, so that I can pick Exercises by what they train without opening each one.
3. As the owner, I want to filter the Library by Target Muscle, so that I can quickly find Exercises for the muscles I want to train today.
4. As the owner, I want to search the Library by Exercise name, so that I can find a known Exercise fast.
5. As the owner, I want to see which Exercises are still draft, so that I know which guidance has not been verified yet.

### Seeing correct form

6. As the owner, I want to open an Exercise and see its form guidance on one screen, so that I can read it between sets without navigating.
7. As the owner, I want to see the primary and secondary Target Muscles listed by their precise names, so that I know exactly which muscles should be working.
8. As the owner, I want the Target Muscles highlighted on a body map, with primary and secondary visually distinct, so that I can locate them at a glance.
9. As the owner, I want 3–4 short Cues for correct form, so that I can remind myself of the essentials in a few seconds.
10. As the owner, I want 2–3 common Faults, each with its consequence, so that I know what to avoid and why it matters.
11. As the owner, I want an embedded Reference Video that starts at the part explaining form, so that I don't have to scrub through intros.
12. As the owner, I want Reference Videos hosted on platforms that can't be embedded reliably (TikTok, Instagram) to open as an external link, so that the page never shows a broken embed.
13. As the owner, I want to see the Sources an Exercise's guidance was drawn from, so that I can judge how much to trust it.
14. As the owner, I want a clear draft label on Exercises whose guidance is not yet verified, so that I treat that guidance with caution.
15. As the owner, I want Cues, Faults and descriptions written in Indonesian, so that I can read them quickly while out of breath.
16. As the owner, I want Exercise and Muscle names kept in their standard English form, so that they match the videos and gym vocabulary I already know.
17. As the owner, I want the form guidance page to be readable on my phone in a gym, so that I can use it mid-session.

### Planning a day

18. As the owner, I want to see today's Plan when I open the app, so that I can start training immediately.
19. As the owner, I want to add Exercises from the Library to the Plan for a date, so that I can decide what I intend to do that day.
20. As the owner, I want to build a Plan for a future date, so that I can prepare tomorrow's session the night before.
21. As the owner, I want to view the Plan for a past date, so that I can see what I intended to do then.
22. As the owner, I want to move between dates easily, so that I can browse or prepare Plans around today.
23. As the owner, I want to reorder the Exercises in a Plan, so that the list matches the order I intend to do them in.
24. As the owner, I want to remove an Exercise from a Plan, so that I can change my mind.
25. As the owner, I want adding an Exercise that is already in the Plan to be prevented, so that the Plan never contains duplicates.
26. As the owner, I want to open any Exercise in the Plan straight into its form guidance, so that the Plan doubles as my session checklist.
27. As the owner, I want a date with no Plan to show an empty state that invites me to add Exercises, so that I'm never stuck on a blank screen.
28. As the owner, I want the app to never ask whether I completed an Exercise, so that the Plan stays a lightweight intention, not an obligation.

### Access

29. As the owner, I want to sign in with my Google account, so that I don't manage another password.
30. As the owner, I want only my email to be allowed to sign in, so that nobody else can see or change my Plans.
31. As the owner, I want my Plans to be the same on my phone and my laptop, so that I can prepare on one and train with the other.
32. As a visitor who is not the owner, I want a clear message that access is restricted, so that I understand why I can't get in.

### Content authoring (owner as maintainer)

33. As the maintainer, I want the build to fail when an Exercise has fewer than 3 Cues, fewer than 2 Faults, no primary Target Muscle, fewer than 2 Sources, or an invalid Reference Video, so that incomplete guidance never reaches the gym.
34. As the maintainer, I want the build to fail when a Muscle has no body-map mapping, so that every Target Muscle can be displayed.
35. As the maintainer, I want each Exercise authored as its own reviewable file, so that AI-written guidance goes through a pull request before I trust it.
36. As the maintainer, I want to mark an Exercise verified only after I've checked it against its Sources and tried the movement, so that the verified label means something.
37. As the maintainer, I want an Exercise's slug to be stable, so that existing Plans keep pointing at the right Exercise.

## Implementation Decisions

- **Platform**: Online-only web app built with Next.js (App Router), TypeScript in strict mode, deployed on Vercel. No offline support and no PWA install in the MVP.
- **Data split (ADR-0001)**: The Library is authored as typed TypeScript content and validated at build time with Zod; it is static and never stored in the database. Personal data (Plans) lives in Neon Postgres (Singapore region), accessed through Drizzle ORM.
- **Muscle taxonomy (ADR-0002)**: Muscles are a closed, project-owned set of precise identifiers. A separate display mapping assigns each Muscle to a body-map region. The first renderer is `react-body-highlighter` behind a project-owned Muscle Map component interface, so the renderer can later be replaced by a custom SVG figure without touching Exercise content.
- **Exercise shape**: slug (stable id), name, Target Muscles (each with role primary or secondary), Cues, Faults (each with description and consequence), Reference Video (platform, URL, optional start time), Sources (title, URL, kind), Verification Status, and an optional Form Animation slot that is always empty in the MVP.
- **Reference Video handling**: YouTube is embedded through the privacy-enhanced embed with a start time. Any other platform renders as an external link.
- **Plan module**: A deep module exposing a small interface — get the Plan for a date, add an Exercise, remove an Exercise, and reorder the Plan. It enforces the domain rules itself: at most one Plan per date per owner, each Exercise at most once in a Plan, and only Exercises that exist in the Library. Plans reference Exercises by slug.
- **Plan schema**: a plans table (owner, date, unique on owner + date) and a plan entries table (plan, exercise slug, position, unique on plan + slug). Entries carry no performance data.
- **Dates**: A Plan's date is a calendar date with no time component, interpreted in the owner's local time zone (Asia/Makassar) so that "today" is correct near midnight.
- **Auth**: Better Auth with Google as the only provider and a server-side allowlist containing the owner's email. Every Plan read and write is scoped to the signed-in owner.
- **UI**: Tailwind CSS with shadcn/ui components. Design tokens (colour, type, radius, and the primary/secondary muscle highlight colours) are defined once up front and reused everywhere.
- **Language**: Code, identifiers, commits and issues in English. Exercise and Muscle names in English. Cues, Faults and descriptive text in Indonesian. UI strings collected in one place without an i18n framework.
- **Rendering and caching**: Library pages are statically rendered. Plan pages are always dynamic, never cached.
- **Initial content**: The 13 pull-day Exercises — conventional deadlift, trap bar deadlift, pull-up, lat pulldown, barbell row, chest-supported row, single-arm cable row, face pull, rear delt fly, dumbbell shrug, incline dumbbell curl, hammer curl, reverse curl — plus farmer's carry and hanging leg raise if within budget. Each starts as draft and is promoted to verified by the owner.

## Testing Decisions

- A good test exercises a module only through its public interface and asserts on observable behaviour, never on internals, so refactors don't break tests.
- **Seam 1 — Library validation**: one test suite runs the Library through its validation entry point and asserts every Exercise satisfies the content rules, plus focused cases proving each rule rejects bad content. This doubles as the build-time gate.
- **Seam 2 — Plan module**: tested through its public interface against a real Postgres engine running in-process (PGlite), with the real Drizzle schema and migrations, so SQL constraints and ordering behave exactly as in production. Covers creating a Plan implicitly on first add, duplicate prevention, unknown-slug rejection, removal, reordering, and owner isolation.
- **Seam 3 — Smoke E2E**: one Playwright test walks the core path — open today, add an Exercise from the Library, open it from the Plan, see its Cues. Auth is bypassed by a test-only session, never by weakening the production allowlist.
- Unit tests are written test-first (TDD skill). No component-level or snapshot tests.
- Prior art: none yet; the first tests written for each seam become the pattern.

## Out of Scope

- Form Animation (the muscled figure showing correct form and Faults).
- Any tracking: sets, reps, load, completion marks, history, progress, personal records, streaks.
- Templates, recurring splits, copying or saving a Plan for reuse.
- More than one Plan per date, or multiple sessions per day.
- Supersets or grouping Exercises within a Plan.
- Offline use, PWA install, native apps.
- An admin UI for editing the Library.
- Multiple users or sharing.
- Exercises outside the pull day.

## Further Notes

- **Seams were chosen while the owner was away** and should be confirmed: Library validation, the Plan module interface, and a single smoke E2E.
- Content accuracy is the main product risk. Every Cue or Fault must be supported by at least two independent Sources; claims found in only one Source stay out until checked. Preferred Sources are credentialed physiotherapists, certified coaches and exercise scientists over general fitness influencers.
- The Form Animation slot and the Muscle Map interface are deliberate preparation for the next milestone; the Plan entries table is the natural place where tracking data will attach later.
