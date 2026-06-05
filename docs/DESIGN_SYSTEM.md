# Design System Direction

This document describes the intended design direction. It is not a redesign task list.

Do not implement these ideas unless a task specifically asks for visual work.

## Overall Direction

Bend Pro should feel like a dark premium field-tool interface.

The app should be readable outdoors, fast to scan, and friendly for electricians using it on a phone.

## Pipe Workspace Card

Calculator result screens should use a pipe workspace card as the main visual area.

The workspace card should usually include:

- Primary result
- 2D conduit diagram
- Key measurement vectors
- Small status or setup details only when helpful

Avoid crowding the workspace card with repeated support values.

## Measurement Chips

Measurement chips should be used for compact supporting values.

Use chips when they help scanning. Do not duplicate values already shown clearly in the diagram or primary result.

## Spec Strip

A future spec strip may show setup information such as conduit type, trade size, bender, unit system, and rounding.

For now, setup is handled by the existing setup card.

## Guided Mode Button

Guided Mode should stay separate from the main calculator result.

It can be shown as a secondary card or button below the main pipe workspace.

Do not put long teaching text inside the main pipe card.

## Shared Diagram Primitives

Future shared diagram primitives should support:

- Conduit paths
- Bend radius zones
- Marks
- Dimension vectors
- Arrowheads
- Labels
- Result callouts
- Empty preview states

Primitives should live under `src/shared/diagrams/primitives/` when the diagram system is ready to move.

## Colors

Use the theme files in `src/theme/`.

Preferred direction:

- Dark surfaces for app background and cards
- Blue/cyan for primary app accent and conduit
- Orange for user marks
- A restrained contrasting color for deduct/radius zones
- Neutral white/grey for labels and dimension lines

Avoid making every measurement a different bright color.

## Typography And Spacing

Use shared theme spacing and typography.

Calculator screens should favor:

- Large primary result
- Clear labels
- Minimal helper text
- More space for diagrams and field-critical measurements
