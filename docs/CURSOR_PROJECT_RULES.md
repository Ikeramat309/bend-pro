# Cursor Project Rules

Short guide for Cursor agents working in Bend Pro. Read this before touching code so you do not need to re-explore the whole repo for every task.

Related docs: `docs/NAMING_RULES.md` (engine/key naming), `docs/PROJECT_MAP.md` (folder layout).

---

## 1. App identity

- **Bend Pro** is currently an **EMT bending app**.
- Focus is **conduit bending calculators**, starting with **Offset** and **Stub 90**.
- **Do not add support for other conduit types yet** (no RMC, IMC, PVC, or multi-material flows unless the task explicitly asks for it).
- Do not add new calculators unless the task explicitly asks for one.

**Active production routes:** `/`, `/offset`, `/stub90`, `/bends`, `/settings`, plus bottom-nav stubs `/bender-database` and `/guide`.

---

## 2. Architecture principles

Put code in the right layer and keep features isolated.

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Calculator math | `src/features/<feature>/engine/` | Pure logic, validation, formatting for that calculator |
| Calculator UI | `src/features/<feature>/ui/` | Screens, diagrams, feature-specific layout |
| Shared UI | `src/shared/ui/`, `src/shared/workspace/` | Reusable shells, chips, cards, workspace pieces |
| Shared diagrams | `src/shared/diagrams/` | Low-level drawing primitives |
| Core | `src/core/` (target home for shared logic) | Global types, units, formatting, validation |
| Routes | `src/app/` | Thin route files that export feature screens |
| App screens (non-feature) | `src/screens/` | Home, bends library, settings, placeholders |

**Rules:**

- Calculator math belongs in **feature engine** files — not in UI components or route files.
- UI belongs in **feature ui** files.
- Shared UI belongs in `shared/ui` or `shared/workspace`.
- Shared diagram pieces belong in `shared/diagrams`.
- Global types, units, formatting, and validation belong in **core** (migrate toward this; avoid new cross-feature type imports).
- **Features must not import types from other features.** Shared contracts live in core or a dedicated shared types module.

**Import hygiene:** Before deleting or moving a file, search the repo for imports (`rg` / ripgrep). A file with no importers may still be a route entry or asset reference.

---

## 3. Cursor workflow rules

- **Work in small chunks.** One concern per change set (types, UI, math, cleanup, etc.).
- **Check imports** before deleting or moving files.
- **Do not rewrite the whole app** for a small change. Match existing patterns in the file you are editing.
- **Do not touch working calculators** (`/offset`, `/stub90`) unless the task requires it.
- **Do not change math and UI in the same step.** Separate commits or phases so regressions are easy to spot.
- **Run checks after edits** when available: TypeScript (`tsc`), lint (`npm run lint`), and build/start smoke tests.
- **Comments:** Keep useful, beginner-friendly notes for non-obvious logic. Remove obvious, noisy, or outdated boilerplate (`FILE:`, `BEGINNER NOTE`, stale phase references).
- **Do not change calculator math** unless the task explicitly asks for it.
- After a task, briefly report: files changed, why, and how to test.

---

## 4. Current naming language

Use these terms consistently in **UI copy and new public contracts**. Engine internals may still use legacy keys during migration — prefer aligning over time, and update `docs/NAMING_RULES.md` if keys change.

### Stub 90

| Term | Meaning |
|------|---------|
| **Stub Length** | Finished vertical stub measurement (user input) |
| **Deduct** | Bender take-up / deduct value from the shoe |
| **Deduct Mark** | Where to mark the pipe: stub length minus deduct |
| **Bend Mark** | General mark-on-pipe language where appropriate |
| **Leg** | Horizontal leg length (optional input) |
| **Take-Up** | Same concept as deduct; use sparingly in UI — prefer **Deduct** unless teaching take-up |

Avoid calling the stub 90 result **First Mark** in the UI; that term belongs to offset layout.

### Offset

| Term | Meaning |
|------|---------|
| **Offset Height** | Vertical rise of the offset |
| **Bend Angle** | Angle of each bend (e.g. 30°, 45°) |
| **Distance Between Bends** | Spacing along the pipe between the two bends |
| **Shrink** | Conduit length lost due to the offset |
| **Mark 1** | First layout mark (optional) |
| **Mark 2** | Second layout mark |

Do not mix offset **Mark 1 / Mark 2** language with stub 90 **Deduct Mark**.

---

## 5. Design direction

- **Diagram-first mobile UI.** The pipe diagram is the hero, not a wall of result cards.
- **Clean pipe card.** One strong visual anchor per calculator screen.
- **Minimal screen clutter.** Few inputs visible at once; progressive disclosure for optional fields.
- **Avoid calculator-looking repeated cards.** No stacks of identical input/result tiles — prefer `FieldInput`, `PipeWorkspaceCard`, and shared workspace pieces.
- **Reusable chunks like a small game engine.** Primitives (marks, segments, dimensions, setup chips) compose into calculators; do not fork one-off drawing logic per screen.

Theme tokens for production UI live in `src/theme/` (`colors`, `spacing`, `typography`). Prefer these over legacy Expo template or workbench theme paths for new work.

---

## Quick reference: where things live today

| Calculator | Feature folder | Route |
|------------|----------------|-------|
| Offset | `src/features/bend-offset/` | `/offset` |
| Stub 90 | `src/features/bend-stub90/` | `/stub90` |

When in doubt: small change, correct folder, no cross-feature imports, EMT only, math separate from UI.
