# Bend Pro

EMT bending calculator app for the field. Built with Expo, React Native, and TypeScript.

## Active calculators

- **Offset** (`/offset`) — two-bend offset layout
- **Stub 90** (`/stub90`) — 90° stub deduct mark
- **3-Point Saddle** (`/saddle3`) — route over an obstruction
- **4-Point Saddle** (`/saddle4`) — wide obstruction with flat top
- **Segment Bend** (`/segment`) — large-radius bend from equal shots
- **Rolling Offset** (`/rolling`) — offset in height and roll

Phase 4 is wrapped. See [`docs/PHASE_4_WRAPUP.md`](docs/PHASE_4_WRAPUP.md) for what shipped and what is still deferred.

## Architecture

```
src/
  app/              Expo Router routes (thin — export screens only)
  features/         Calculator modules (engine + UI per bend type)
  screens/          Hub screens (home, bends library, settings, guide)
  shared/
    ui/             App shell (header, screen, nav, sheet, field input)
    workspace/      Calculator workspace (setup, pipe card, chips)
    diagrams/       Reusable SVG diagram primitives
  core/             Shared types (UnitSystem, TradeSize, BendAngle, …)
  data/             EMT sizes, conduit types, bender profiles, bend library
  theme/            Colors, spacing, typography
  utils/            Rounding, units, validation helpers
```

Each calculator follows the same pattern: `*.config.ts`, `*.copy.ts`, `engine/`, and `ui/` under `src/features/bend-*/`.

## Dev commands

```bash
npm install          # install dependencies
npx expo start       # start dev server
npm run android      # open on Android
npm run ios          # open on iOS
npm run web          # open in browser
npx expo lint        # ESLint
npx tsc --noEmit     # TypeScript check
npm test             # Jest (engines, formatting, settings)
```

## Docs

- **AI agents:** start at [`AGENTS.md`](AGENTS.md), then follow the reading order in [`docs/README.md`](docs/README.md).
- **Humans:** [`docs/README.md`](docs/README.md) is the full documentation index. `docs/PROJECT_MAP.md` and `docs/APP_ARCHITECTURE.md` cover folder conventions and feature layout.
