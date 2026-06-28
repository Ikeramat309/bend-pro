# Bend Pro Documentation Index

**New agents: read [`HANDOFF.md`](HANDOFF.md) first** — it is the single source of truth for current state, locked decisions, the UI design system, and the remaining plan. The other docs are reference, read on demand.

## Recommended reading order for new AI agents

1. [`HANDOFF.md`](HANDOFF.md) — **current work, plan, locked decisions, design system**
2. [`../AGENTS.md`](../AGENTS.md) — non-negotiable rules
3. [`PRODUCT_BRIEF.md`](PRODUCT_BRIEF.md) — what Bend Pro is and is not
4. [`AI_AGENT_WORKFLOW.md`](AI_AGENT_WORKFLOW.md) — required before editing any code
5. Task-specific reference docs below, as needed

## Primary docs (keep current)

| File | Purpose |
|------|---------|
| [`HANDOFF.md`](HANDOFF.md) | **Start here** — current state, plan, locked decisions, design system |
| [`../AGENTS.md`](../AGENTS.md) | Master AI agent entry point |
| [`../README.md`](../README.md) | Human-facing repo readme: run, test, layout |
| [`PRODUCT_BRIEF.md`](PRODUCT_BRIEF.md) | Product scope, audience, non-goals |
| [`CURRENT_STATE.md`](CURRENT_STATE.md) | Honest snapshot of what works today |
| [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md) | Practical limitations and deferred scope |
| [`APP_ARCHITECTURE.md`](APP_ARCHITECTURE.md) | Layering and folder responsibilities |
| [`ARCHITECTURE_GUARDRAILS.md`](ARCHITECTURE_GUARDRAILS.md) | Import rules, metadata ownership, automated checks |
| [`PROJECT_MAP.md`](PROJECT_MAP.md) | Where code lives |
| [`AI_AGENT_WORKFLOW.md`](AI_AGENT_WORKFLOW.md) | Edit rules, safety, task report format |
| [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md) | Engine/UI separation, math safety |
| [`TRUST_MODEL.md`](TRUST_MODEL.md) | Per-calculator input effects; bender profile scope |
| [`TESTING.md`](TESTING.md) | Where tests live and how to add them |
| [`FIELD_VALIDATION.md`](FIELD_VALIDATION.md) | Beta field-validation matrix, “field validated” definition, persistence QA |
| [`FIELD_VALIDATION_TEST_SHEET.md`](FIELD_VALIDATION_TEST_SHEET.md) | Printable electrician test cases |
| [`GLOSSARY.md`](GLOSSARY.md) | Trade terminology |
| [`NAMING_RULES.md`](NAMING_RULES.md) | Canonical UI labels |
| [`DIAGRAM_SYSTEM.md`](DIAGRAM_SYSTEM.md) | Diagram contract and principles (locked visual direction in [`HANDOFF.md`](HANDOFF.md) §4) |
| [`FEATURE_TEMPLATE.md`](FEATURE_TEMPLATE.md) | Template for future calculators |

## Feature READMEs

Each calculator has its own README in `src/features/bend-*/README.md`.

## Documentation honesty rule

All docs must clearly distinguish **existing features**, **incomplete work**, **planned future work**, and **ideas only**. Do not document planned work as if it exists.
