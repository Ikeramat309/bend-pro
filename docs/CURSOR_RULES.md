# Cursor Rules

These rules are for Cursor agents working in this project.

## Safety Rules

Do not change calculator math unless specifically requested.

Do not edit unrelated calculator modules.

Do not create duplicate shared components when one already exists.

Do not rename measurement keys without updating `docs/NAMING_RULES.md`.

Do not touch navigation unless the task is about navigation.

Keep each task inside clearly allowed folders.

Do not move shared UI or data during feature work unless the task explicitly asks for that migration.

Do not delete working screens during cleanup passes.

## Reporting Rules

After every task, list:

- Files changed
- Why they changed
- How to test

If checks fail because of pre-existing unrelated files, say that clearly and identify the unrelated area.

## Feature Work Rules

Calculator feature modules should live in `src/features/`.

Engine code belongs in the feature `engine/` folder.

Calculator-specific screen and diagram wrappers belong in the feature `ui/` folder.

Shared UI belongs in shared component folders, not copied into each feature.

Prefer small, safe migration steps over broad refactors.
