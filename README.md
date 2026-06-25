# Bend Pro

EMT conduit bending calculator for the field. Built with **Expo**, **React Native**, and **TypeScript**.

## What it does

Six working calculators on a shared diagram-first workspace: Offset, Stub 90, 3-Point Saddle, 4-Point Saddle, Segment Bend, and Rolling Offset. Imperial lengths use a bottom-sheet editor with fraction keypad and tape-measure step controls. Guide walkthroughs and a bender profile database are included.

**Status (Phase 5.8):** Phases 1–5 complete; usability passes 5.6–5.7 done; project checks passing. Phase 6 calculators are not started.

## Quick start

```bash
npm install
npm start          # Expo dev server
npm run check      # typecheck + lint + tests (220 tests)
```

Platform targets: `npm run android`, `npm run ios`, `npm run web`.

## Active routes

| Route | Screen |
|-------|--------|
| `/` | Home hub |
| `/bends` | Bend library |
| `/offset`, `/stub90`, `/saddle3`, `/saddle4`, `/segment`, `/rolling` | Calculators |
| `/settings`, `/bender-database`, `/guide` | Setup, benders, guide |

## Project layout

```text
src/
  app/              Expo Router routes (thin — export screens only)
  features/         Calculator modules (engine + UI per bend type)
  screens/          Hub screens (home, bends, settings, guide, benders)
  shared/
    ui/             App shell, FieldInput, LengthInputSheet, FractionKeypad
    workspace/      BendCalculatorLayout and calculator chrome
    diagrams/       Reusable SVG diagram primitives
  core/             Shared types and persisted setup
  data/             EMT sizes, benders, bend library, guide content
  theme/            Design tokens
  utils/            Formatting, parsing, fraction keypad, length adjustment
```

## Documentation

- **AI agents:** start at [`AGENTS.md`](AGENTS.md), then [`docs/README.md`](docs/README.md).
- **Current state:** [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md)
- **Architecture:** [`docs/APP_ARCHITECTURE.md`](docs/APP_ARCHITECTURE.md)
- **Calculator layout rules:** [`docs/UI_WORKSPACE_LAYOUT.md`](docs/UI_WORKSPACE_LAYOUT.md)

Historical phase notes live in [`docs/archive/`](docs/archive/).
