# Parallel Kick 90s - current gap audit

## Production status

No dedicated Bend Pro workflow exists. Reusing the Parallel Offset screen would be misleading because a kicked 90 introduces:

- a formed 90 with a back and center;
- a separate kick center;
- half-OD center conversion;
- bender center or shoe-factor calibration;
- cabinet landing spacing;
- multiple physical orientation families.

## Risks if built generically

- A `kick height + angle + spacing` form can calculate a valid number for the wrong picture.
- A single shift value does not tell the user where the 90 mark stays or which kick mark changes.
- An Arrow instruction would conflict with center-based source math.
- Text labels `parallel` and `forward` will not resolve the trade's inconsistent terminology.
- A visually attractive rack can conceal that the landing spacing differs from the incoming rack.

## Reusable Bend Pro foundations

- Steel-tube rendering and dimensional color links from Rolling Offset.
- Rack table/persistence patterns from Parallel Offsets.
- Kick geometry and 90 representation from Kick 90.
- Bender selection and EMT OD data.

These are visual/architectural foundations only; math and state must belong to a new registered calculator.
