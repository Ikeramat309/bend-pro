# Cross-calculator field contract

These rules apply to every calculator in this package.

## 1. Start from the finished condition

Inputs are named for physical measurements: `rise`, `roll`, `distance between backs`, `rack center-to-center`, `obstacle width`, `kick amount`. Do not lead with `opposite`, `adjacent`, `hypotenuse`, `multiplier`, or `factor`.

Every field has a compact measurement illustration or a one-line `Measure this` explanation.

## 2. The hero is the next field action

A hero must contain a verb or an unambiguous mark pair:

- `Mark 24 1/2 in from the back of Bend 1 - use Star`
- `Mark centers 7 3/4 in apart - bend both 45 deg`
- `Move both marks 9/16 in on each next pipe`

Supporting math is not the hero.

## 3. Every mark has a coordinate system

Each mark identifies:

- origin: start end, free end, back of a formed 90, Pipe 1 Mark 1, or prior bend center;
- physical target: conduit centerline, back/outside, or edge;
- bender reference: Arrow, Star, mapped center notch, calibrated center, or front of shoe;
- direction along the stick.

If any item is unknown, the app withholds the dependent instruction or labels the result as center geometry only.

## 4. The setup context stays visible

Show bender, conduit type, EMT trade size, units, and rounding. State whether the selected bender changes the math or only changes field-reference guidance.

Never imply bender-specific precision from a multiplier-only calculation.

## 5. Multi-bend diagrams encode procedure

When a result contains two or more bends, the diagram shows:

- bend-order numbers;
- hook orientation when relevant;
- rotate/flip/plane cue;
- reference pipe for rack work;
- preserved dimension and any dimension that necessarily changes.

The diagram is not a decorative result illustration.

## 6. Rack workflows output the rack

A progressive constant may be shown as the hero, but Full Layout must list every pipe. Pipe 1 remains fixed and visible. Every row shows both marks where two bends are involved. Direction changes require an explicit user action.

## 7. Exact versus executable

If the engine returns a value the selected hand bender cannot reproduce from known marks, say so beside the result. Offer a calibrated method, angle tool, or common-angle comparison. Do not silently snap.

## 8. Invalid-state withholding

- Empty/incomplete inputs show a teaching placeholder, not zero-like results.
- Non-finite, negative, impossible, overlapping, or off-stick marks are not rendered as plausible layouts.
- Safe independent results may remain visible when only an optional dependent result is invalid.
- Extreme valid values are clamped visually, never numerically; dimension labels state when the drawing is not to scale.

## 9. Pro and Guide are two layers of one tool

**Pro:** minimum inputs, hero, action strip, diagram, warnings.

**Guide:** how to measure, why the formula works, reference calibration, alternate methods, worked case, source, and limitations.

The Guide must not be required to discover a critical mark origin or bend direction.

## 10. Shared result order

1. Finished-condition sentence
2. Hero mark/action
3. Hero diagram
4. Ordered action strip
5. At most two secondary values
6. Warnings/feasibility
7. Guide and source details

## 11. Build a Run ownership

Stick-level planning imports solved bend cards. The owning calculator remains the source of math, references, and warnings. A composer may order and combine marks; it may not reinterpret them silently.
