# Bend Pro Documentation Index

The single entry point for the repo is the root [`AGENTS.md`](../AGENTS.md). Start there, then come back here for the full map.

## Recommended reading order for new AI agents

1. [`../AGENTS.md`](../AGENTS.md) — master entry point and non-negotiable rules
2. [`PRODUCT_BRIEF.md`](PRODUCT_BRIEF.md) — what Bend Pro is and is not
3. [`CURRENT_STATE.md`](CURRENT_STATE.md) — what exists today, what's incomplete, known risks
4. [`AI_AGENT_WORKFLOW.md`](AI_AGENT_WORKFLOW.md) — **required** before editing any code
5. [`GLOSSARY.md`](GLOSSARY.md) — required terminology for UI copy and code
6. Task-specific docs below as needed

## All documentation files

### Orientation

| File | Purpose |
|------|---------|
| [`../AGENTS.md`](../AGENTS.md) | Master AI agent entry point. Identity, phase, core rules, reading order. |
| [`../CLAUDE.md`](../CLAUDE.md) | Pointer to `AGENTS.md` for Claude-based tools. No content of its own. |
| [`../README.md`](../README.md) | Human-facing repo readme: dev commands, folder overview. |
| [`PRODUCT_BRIEF.md`](PRODUCT_BRIEF.md) | Who Bend Pro is for, product philosophy, scope, current and planned calculators, non-goals. |
| [`CURRENT_STATE.md`](CURRENT_STATE.md) | Honest snapshot: working, incomplete, needs cleanup, risk areas. |
| [`ROADMAP.md`](ROADMAP.md) | Phased plan from stabilization through release prep. |
| [`PHASE_4_WRAPUP.md`](PHASE_4_WRAPUP.md) | Phase 4 close-out: delivered, deferred, gaps, verification. |

### Rules for agents

| File | Purpose |
|------|---------|
| [`AI_AGENT_WORKFLOW.md`](AI_AGENT_WORKFLOW.md) | Before/during/after-edit rules, safety rules, file organization, testing, and the standard task report format. Consolidates the old Cursor rules docs. |
| [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md) | Calculator architecture pattern, math ownership, formula documentation, validation, formatting. |
| [`DIAGRAM_SYSTEM.md`](DIAGRAM_SYSTEM.md) | Diagram-first principles, primitives, separation of math and drawing. |
| [`GLOSSARY.md`](GLOSSARY.md) | Conduit bending and app terms; preferred vs. avoided wording. |
| [`NAMING_RULES.md`](NAMING_RULES.md) | Canonical UI labels and engine keys per calculator. |

### Structure and design

| File | Purpose |
|------|---------|
| [`PROJECT_MAP.md`](PROJECT_MAP.md) | Where code lives today: routes, features, shared layers, data. |
| [`APP_ARCHITECTURE.md`](APP_ARCHITECTURE.md) | Layering: thin routes, feature modules, shared UI/diagrams, data. |
| [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) | Visual direction: dark field-tool UI, pipe workspace card, theme tokens. |
| [`FEATURE_TEMPLATE.md`](FEATURE_TEMPLATE.md) | Folder structure template for future calculator modules. |

### Deprecated

| File | Status |
|------|--------|
| [`CURSOR_RULES.md`](CURSOR_RULES.md) | Deprecated — consolidated into `AI_AGENT_WORKFLOW.md`. |
| [`CURSOR_PROJECT_RULES.md`](CURSOR_PROJECT_RULES.md) | Deprecated — consolidated into `AI_AGENT_WORKFLOW.md`. |

### Feature READMEs

Each calculator has its own README inside its feature folder:

- `src/features/bend-offset/README.md`
- `src/features/bend-stub90/README.md`
- `src/features/bend-saddle3/README.md`
- `src/features/bend-saddle4/README.md`
- `src/features/bend-segment/README.md`
- `src/features/bend-rolling/README.md`

## Documentation honesty rule

All docs must clearly distinguish **existing features**, **incomplete work**, **planned future work**, and **ideas only**. Do not document planned work as if it exists, and do not invent features when updating docs.
