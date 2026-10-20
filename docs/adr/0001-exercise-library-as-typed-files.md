# Exercise library lives in typed files in the repo, not the database

The Library (Exercises, Target Muscles, Cues, Faults, Reference Videos, Sources) is authored as TypeScript files in the repo and validated at build time, while personal data (Plans) lives in Postgres. Library content is written mostly by AI and must be reviewed before it is trusted, so every change goes through a pull request; incomplete content fails the build instead of reaching the gym. Storing it in the database would have allowed editing from an admin UI, but that UI would have to be built and changes would lose git review.

## Consequences

- Changing the Library means a commit and a deploy, not a form submission.
- Plans reference Exercises by a stable slug, so an Exercise's slug must never be renamed without a migration of existing Plans.
