# Bend Pro — AI Agent Entry Point

This is the master onboarding document for every AI coding agent working in this repository. Read it before touching anything.

> **Current work, plan, locked decisions, and the UI design system live in [`docs/HANDOFF.md`](docs/HANDOFF.md). Read that first.** This file holds the permanent rules.

## What Bend Pro is

Bend Pro is a **mobile-first EMT conduit bending app** for electricians, apprentices, and field workers. It is built with **Expo, React Native, and TypeScript**.

It is **not** a generic calculator app. It is a field tool. People will mark and bend real conduit based on what this app tells them. That means:

- **Calculator math is safety-critical.** A wrong formula wastes material and time on a job site. Never change math casually.
- **Terminology is part of the product.** Electricians use specific trade terms (deduct, take-up, shrink, stub, mark). Using the wrong word in the UI confuses real users. See `docs/GLOSSARY.md`.
- **Diagrams are the primary output.** Bend Pro is diagram-first: the pipe diagram with marks and dimensions is the hero of every calculator screen, not a wall of numbers.

## Current phase

Six EMT calculators ship; math is desk-validated; the app is in a **UI redesign** (continuous-surface, light/dark, steel-tube horizontal diagrams) heading toward field beta. **No new calculators** until the [Definition of Done](docs/HANDOFF.md) is met.

See [`docs/HANDOFF.md`](docs/HANDOFF.md) (plan + design system), [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md), and [`docs/KNOWN_ISSUES.md`](docs/KNOWN_ISSUES.md).

## Read these docs first

In this order:

1. `docs/README.md` — documentation index and reading order
2. `docs/PRODUCT_BRIEF.md` — what Bend Pro is, who it's for, scope, non-goals
3. `docs/CURRENT_STATE.md` — what exists, what works, what's incomplete
4. `docs/AI_AGENT_WORKFLOW.md` — **required rules for editing code** (before-edit checklist, safety rules, report format)
5. `docs/GLOSSARY.md` — required terminology
6. Then, as the task demands: `docs/KNOWN_ISSUES.md`, `docs/TRUST_MODEL.md`, `docs/ARCHITECTURE_GUARDRAILS.md`, `docs/CALCULATOR_RULES.md`, `docs/DIAGRAM_SYSTEM.md`, `docs/PROJECT_MAP.md`, `docs/APP_ARCHITECTURE.md`, `docs/NAMING_RULES.md` (UI design direction: `docs/HANDOFF.md` §4)

## Core rules (non-negotiable)

- **Do not make broad changes without instruction.** Do the task you were given, in the smallest safe change set. No drive-by refactors, no rewriting the app for a small fix.
- **Do not change calculator math unless the task explicitly asks for it.** Math lives in feature `engine/` folders and is isolated from UI on purpose.
- **Do not invent features.** Documentation and reports must clearly distinguish: existing features, incomplete work, planned future work, and ideas only. Never describe planned work as if it exists.
- **Do not add new calculators or conduit types** (no RMC, IMC, PVC) unless explicitly asked. EMT only for now. **Register every new calculator in `src/core/calculators/` first** — then add routes, guides, and feature folders from that entry.
- **Use the standard task report format** in `docs/AI_AGENT_WORKFLOW.md` after every task.
- **Follow import and layer rules** in `docs/ARCHITECTURE_GUARDRAILS.md` — especially registry-first metadata and engine purity.
- **Run `npm run check`** after substantive edits (typecheck + lint + import-cycle scan + tests).

## Expo version

Expo APIs have changed across versions. Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing Expo-related code.
