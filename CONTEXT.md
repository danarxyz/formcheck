# Gym App

A personal app for seeing correct exercise form while training: pick exercises from a library, make them the plan for a day, and open each one to see its target muscles, cues, faults and a reference video.

## Library

**Exercise**:
A named movement in the library with its own form guidance (e.g. Barbell Row). Two movements are separate Exercises when their Cues or Faults differ meaningfully; a change of load or grip alone does not make a new Exercise.
_Avoid_: Movement, lift, workout, variant

**Library**:
The full collection of Exercises available to pick from.
_Avoid_: Catalog, database, exercise list

**Muscle**:
An anatomical muscle or muscle region, named precisely (e.g. Latissimus dorsi, Rhomboids, Middle trapezius).
_Avoid_: Body part, muscle group

**Target Muscle**:
A Muscle that an Exercise trains, with a role of either primary or secondary.
_Avoid_: Worked muscle, activated muscle

**Cue**:
A short instruction describing correct form, readable in a few seconds between sets.
_Avoid_: Tip, instruction, step

**Fault**:
A common way an Exercise is performed incorrectly, together with its consequence.
_Avoid_: Mistake, error, bad form

**Reference Video**:
An external video chosen to demonstrate an Exercise's correct form, optionally starting at a timestamp.
_Avoid_: Tutorial, clip

**Source**:
A credible reference that an Exercise's Cues and Faults are drawn from.
_Avoid_: Citation, reference

**Verification Status**:
Whether an Exercise's form guidance has been checked by the owner: either draft or verified.
_Avoid_: Approval, review state

**Form Animation**:
An animated figure demonstrating an Exercise's correct form and its Faults, with Target Muscles highlighted. Not yet built.
_Avoid_: Demo, model, stickman

## Planning

**Plan**:
An ordered shortlist of Exercises intended for one calendar date, at most one Plan per date and each Exercise at most once within it. A Plan is an intention only; it records nothing about whether the Exercises were performed.
_Avoid_: Workout, session, routine, program, schedule
