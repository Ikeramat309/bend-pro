# Build a Run - diagram brief

## Primary view: stick timeline

- One horizontal steel EMT stick with a clearly named Start end.
- Child bends appear as grouped spans/cards above the stick.
- Physical mark wraps are numbered globally by confirmed bend order but retain child color/key.
- Arrow/Star/center/cut reference glyph appears at each mark.
- Manual marks use a distinct dashed wrap and `manual` badge.
- Remaining tail or shortage occupies the far end as green/blocked state.

## Secondary view: formed-run preview

Only show when child geometry and plane transforms are sufficient. Otherwise use a simple wire-path planning sketch explicitly labeled `sequence preview`, not a physically exact conduit rendering.

## Interaction

- Tap child card: highlight all its marks and open owning result.
- Dragging is not the default precision input; anchors use keypad/fractions. A drag may preview, then asks for exact station.
- Reorder requires confirmation because numbers/action strip change.
- Editing a child temporarily marks the overall plan `recalculating/not ready` until all child marks update.

## Collision/scale

- Closely spaced marks expand into a magnified inset rather than overlap.
- Long empty stick sections use a break cue.
- Off-stick marks are not drawn beyond the endpoint; the failing child is shown in a blocked lane.
- Do not draw a formed conduit that implies unmodeled gain/plane behavior.

## Cases

One child, five children, overlapping marks, opposite-end import, manual mark, stale child, exact fit, shortage, long labels, smallest phone, light/dark.
