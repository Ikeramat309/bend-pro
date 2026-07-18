# Compound 90 - diagram brief

## Required views

### Geometry selector thumbnails

Three non-technical silhouettes:

- circle seated at corner;
- rectangle with sides parallel to walls;
- square rotated 45 degrees with a point toward the bend.

Each thumbnail shows only the dimensions the next form will request.

### Hero diagram

- Steel EMT making two 45-degree bends around the selected silhouette.
- Two narrow mark wraps labeled `1 Center` and `2 Center`.
- C-C vector attached directly to both marks.
- Clearance halo/vector in a separate color only when non-zero.
- Small `45 deg` arcs anchored to each bend.
- Center-reference badge connected to a mark, not floating.
- Same-plane rail under the conduit.

## Visual truth

- The obstruction orientation must never be normalized into one generic square icon.
- Pipe may scale for legibility, but the relative obstruction orientation must remain truthful.
- If the drawing is not to scale at extreme inputs, say so without changing the numeric result.
- Back-of-conduit helper geometry appears only in Guide.

## Collision policy

- C-C label may move outside the bend but keeps leader lines to both center marks.
- Obstruction dimensions occupy the inside of the corner; bend angle labels sit outside the pipe.
- At narrow spacing, use a keyed result strip below the diagram rather than stacking labels over the pipe.

## Responsive tests

Test all three orientations with zero clearance, large clearance, smallest valid obstruction, 24-inch dimensions, optional absolute marks, light/dark, and the smallest supported phone width.
