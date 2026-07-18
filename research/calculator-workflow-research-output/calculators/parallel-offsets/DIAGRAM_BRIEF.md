# Parallel Offsets - diagram brief

## Hero diagram

- Three representative steel EMT offsets; for larger counts show Pipe 1, Pipe 2, and Pipe N.
- Pipe 1 has a persistent `REFERENCE` tag.
- Two mark wraps appear on every representative pipe.
- A single shift vector connects corresponding Mark 1 centers from Pipe 1 to Pipe 2; a caption says `apply to both marks`.
- Rack C-C vector is perpendicular to the straight pipe run.
- Equal-gap check is shown through the diagonal section.
- A large direction arrow points to the named conduit end.

## Interaction

Selecting a table row highlights its pipe and both marks. `Reverse order` and `Move toward other end` are explicit actions with preview; neither occurs as a side effect of editing count.

## Scale and collision

- Preserve pipe ordering at all values.
- Compress long DBB with break cues rather than shrinking marks/OD.
- Put C-C and shift dimensions on separate lanes.
- Table carries all numeric marks; diagram labels only Pipe 1, next pipe, and last pipe when crowded.
- At negative/off-stick absolute marks, remove the invalid wrap and show the table row warning; never draw it outside the conduit.

## Required cases

2/10 pipes, both directions, common angles, shallow long offset, large spacing, absent/present absolute Mark 1, invalid negative row, light/dark, smallest phone.
