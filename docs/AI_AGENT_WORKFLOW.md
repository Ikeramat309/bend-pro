# AI Agent Workflow

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Required workflow for every AI agent editing this repository. This doc consolidates and replaces the old `CURSOR_RULES.md` and `CURSOR_PROJECT_RULES.md`.

## Before-edit checklist

Before touching any file:

1. Read [`AGENTS.md`](../AGENTS.md) and understand the current phase ([`CURRENT_STATE.md`](CURRENT_STATE.md), [`ROADMAP.md`](ROADMAP.md)).
2. Confirm the task scope. Which folders are you allowed to touch? Keep each task inside clearly allowed folders.
3. If the task involves a calculator, read [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md) and the feature's README (`src/features/bend-*/README.md`).
4. If the task involves wording or labels, read [`GLOSSARY.md`](GLOSSARY.md) and [`NAMING_RULES.md`](NAMING_RULES.md).
5. If the task involves diagrams, read [`DIAGRAM_SYSTEM.md`](DIAGRAM_SYSTEM.md).
6. Check imports before deleting or moving any file (search the repo with ripgrep). A file with no importers may still be a route entry or asset reference.
7. Check Expo docs at the pinned version (https://docs.expo.dev/versions/v56.0.0/) before writing Expo-related code.

## During-edit rules

- **Work in small chunks.** One concern per change set (types, UI, math, cleanup). Prefer small, safe migration steps over broad refactors.
- **Do not rewrite the whole app** for a small change. Match existing patterns in the file you are editing.
- **Do not edit unrelated calculator modules** or touch working calculators (`/offset`, `/stub90`) unless the task requires it.
- **Do not invent features.** Build only what the task asks for. When writing docs or comments, clearly distinguish existing features, incomplete work, planned future work, and ideas only.
- **Comments:** keep useful, beginner-friendly notes for non-obvious logic. Remove obvious, noisy, or outdated boilerplate (`FILE:`, `BEGINNER NOTE`, stale phase references) when you touch a file.

## Source code safety rules

- Do not change calculator math unless specifically requested.
- Do not touch navigation/routing unless the task is about navigation.
- Do not create duplicate shared components when one already exists.
- Do not rename measurement keys without updating [`NAMING_RULES.md`](NAMING_RULES.md).
- Do not move shared UI or data during feature work unless the task explicitly asks for that migration.
- Do not delete working screens during cleanup passes.
- Do not add new calculators or conduit types (no RMC, IMC, PVC, or multi-material flows) unless the task explicitly asks.
- Features must not import types from other features. Shared contracts live in `src/core/` or a dedicated shared module.

## Calculator math safety rules

Math is field-safety-critical — people mark real conduit from these numbers.

- Math lives only in feature `engine/` folders. Never in UI components or route files.
- **Math changes and UI changes must be in separate steps** (separate commits or phases) so regressions are easy to spot — unless the task explicitly requests both together.
- Any formula change requires: explicit task instruction, updated formula documentation in the engine file header, and worked example cases (see [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md)).
- Never silently change constants (angle multipliers, shrink-per-inch, default take-up).

## UI safety rules

- Use shared components (`src/shared/ui/`, `src/shared/workspace/`, `src/shared/diagrams/`) instead of copying them into features.
- Use theme tokens from `src/theme/` — no hard-coded colors/spacing in new work.
- Follow the diagram-first design direction in [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md): one strong pipe workspace card per calculator screen, minimal clutter.
- Use the exact UI labels from [`NAMING_RULES.md`](NAMING_RULES.md) and [`GLOSSARY.md`](GLOSSARY.md).
- Do not implement design-direction ideas from `DESIGN_SYSTEM.md` unless a task specifically asks for visual work.

## File organization rules

| What | Where |
|------|-------|
| Calculator math, validation, types | `src/features/<feature>/engine/` |
| Calculator screens and diagrams | `src/features/<feature>/ui/` |
| Calculator defaults / copy | `src/features/<feature>/*.config.ts`, `*.copy.ts` |
| Shared app shell | `src/shared/ui/` |
| Calculator workspace pieces | `src/shared/workspace/` |
| Diagram primitives | `src/shared/diagrams/` |
| Global types | `src/core/` |
| Routes (thin, export screens only) | `src/app/` |
| Non-calculator screens | `src/screens/` |
| Data (EMT sizes, benders, library) | `src/data/` |
| Theme tokens | `src/theme/` |
| Formatting/validation helpers | `src/utils/` |

New calculator modules follow [`FEATURE_TEMPLATE.md`](FEATURE_TEMPLATE.md). See [`PROJECT_MAP.md`](PROJECT_MAP.md) for the current layout.

## How to test changes

Run after edits, when available:

```bash
npx tsc --noEmit     # TypeScript check
npx expo lint        # ESLint
npx expo start       # smoke test affected screens
```

For calculator changes, manually verify the affected screen (`/offset` or `/stub90`) with at least one known example case from `CALCULATOR_RULES.md`. If checks fail because of pre-existing unrelated issues, say so clearly and identify the unrelated area — do not silently fix out-of-scope problems.

## After-edit report format (standard AI task report)

After **every** task, report in this format:

```markdown
## Task report

**Files changed:** list every created/modified/deleted file
**What changed:** short description per file or group
**Why it changed:** the task goal each change serves
**Intentionally not changed:** related things you saw but left alone, and why
**How to test:** exact commands and/or screens + example inputs
**Risks / follow-up:** known risks, deferred cleanup, or suggested next tasks
```

Keep it honest: if something is incomplete, say so. Never claim a feature works without verifying it.
