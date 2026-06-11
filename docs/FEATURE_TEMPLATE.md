# Feature Template

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Use this structure for future calculator modules. Build new calculators only when the [roadmap](ROADMAP.md) phase calls for them, and follow [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md).

```text
src/features/bend-example/
  engine/
    example.logic.ts
    example.types.ts
    example.validation.ts
    example.test.ts
  ui/
    ExampleProScreen.tsx
    ExampleGuidedScreen.tsx
    ExampleInputs.tsx
    ExampleDiagram.tsx
  example.copy.ts
  example.feature.ts
  README.md
```

## Engine Folder

The `engine/` folder owns pure calculator behavior.

It should contain:

- Math and field formulas
- Calculator input and result types
- Validation rules
- Tests when available

Do not put React components in `engine/`.

## UI Folder

The `ui/` folder owns feature-specific React components.

It may contain:

- Pro calculator screen
- Guided screen
- Feature-specific input grouping
- Feature-specific diagram wrapper

Use shared UI components instead of copying common cards, inputs, buttons, or diagram primitives.

## Copy File

The copy file should hold user-facing labels and helper text when the feature grows.

Example:

```ts
export const exampleCopy = {
  title: 'Example Bend',
};
```

## Feature Metadata File

The feature metadata file should describe how the calculator appears in navigation or registries.

Example:

```ts
export const exampleFeature = {
  id: 'bend-example',
  title: 'Example Bend',
};
```

## README

Each feature README should explain:

- What the calculator does
- Engine files
- UI files
- Current route
- Important measurement names
- Known limitations
