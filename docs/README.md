# Bend Pro Documentation Index

The single entry point for the repo is the root [`AGENTS.md`](../AGENTS.md). Start there, then come back here for the full map.

## Recommended reading order for new AI agents

1. [`../AGENTS.md`](../AGENTS.md) — master entry point and non-negotiable rules
2. [`PRODUCT_BRIEF.md`](PRODUCT_BRIEF.md) — what Bend Pro is and is not
3. [`CURRENT_STATE.md`](CURRENT_STATE.md) — what exists today, what's incomplete, known risks
4. [`AI_AGENT_WORKFLOW.md`](AI_AGENT_WORKFLOW.md) — **required** before editing any code
5. [`GLOSSARY.md`](GLOSSARY.md) — required terminology for UI copy and code
6. Task-specific docs below as needed

## Primary docs (keep current)

| File | Purpose |
|------|---------|
| [`../AGENTS.md`](../AGENTS.md) | Master AI agent entry point |
| [`../README.md`](../README.md) | Human-facing repo readme: run, test, layout |
| [`PRODUCT_BRIEF.md`](PRODUCT_BRIEF.md) | Product scope, audience, non-goals |
| [`CURRENT_STATE.md`](CURRENT_STATE.md) | Honest snapshot of what works today |
| [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md) | Practical limitations and deferred scope |
| [`ROADMAP.md`](ROADMAP.md) | Completed phases and Phase 6 (not started) |
| [`CLEANUP_REPORT.md`](CLEANUP_REPORT.md) | Latest stability/cleanup checkpoint |
| [`APP_ARCHITECTURE.md`](APP_ARCHITECTURE.md) | Layering and folder responsibilities |
| [`ARCHITECTURE_GUARDRAILS.md`](ARCHITECTURE_GUARDRAILS.md) | Import rules, metadata ownership, automated checks |
| [`UI_WORKSPACE_LAYOUT.md`](UI_WORKSPACE_LAYOUT.md) | Calculator shell, input sheet, dock, results |
| [`PROJECT_MAP.md`](PROJECT_MAP.md) | Where code lives |
| [`AI_AGENT_WORKFLOW.md`](AI_AGENT_WORKFLOW.md) | Edit rules, safety, task report format |
| [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md) | Engine/UI separation, math safety |
| [`TESTING.md`](TESTING.md) | Where tests live and how to add them |
| [`GLOSSARY.md`](GLOSSARY.md) | Trade terminology |
| [`NAMING_RULES.md`](NAMING_RULES.md) | Canonical UI labels |
| [`DIAGRAM_SYSTEM.md`](DIAGRAM_SYSTEM.md) | Diagram-first principles |
| [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) | Visual direction and tokens |
| [`FEATURE_TEMPLATE.md`](FEATURE_TEMPLATE.md) | Template for future calculators |

## Archive

Historical phase close-outs and deprecated Cursor rules: [`archive/README.md`](archive/README.md).

## Feature READMEs

Each calculator has its own README in `src/features/bend-*/README.md`.

## Documentation honesty rule

All docs must clearly distinguish **existing features**, **incomplete work**, **planned future work**, and **ideas only**. Do not document planned work as if it exists.
