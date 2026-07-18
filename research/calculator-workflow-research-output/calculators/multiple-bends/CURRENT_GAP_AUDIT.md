# Build a Run - current gap audit

## Useful existing primitives

- Stick length and canonical mark positions.
- Sorting, tail calculation, overflow checks, persistence, and a mark editor.
- A diagram capable of displaying many marks.

## Product mismatch

The current workflow asks the user to supply the very marks a `Multiple Bends` calculator appears to promise it will solve. Angle, direction, and flip metadata do not turn raw positions into a bend layout. This explains why the feature feels generic compared with Rolling Offset.

## Required reframe

- Hub and screen name become `Build a Run` or `Run Layout`.
- Primary add action is `Add solved bend`, not `Add mark`.
- Child calculators own math and references.
- Manual marks remain possible but visibly unverified.
- Fit state distinguishes simple coordinate bounds from bender-specific developed-length confidence.
- Bend order is confirmed, not fabricated.

## User evidence

QuickBend reviews explicitly praise Multiple Bends, and other discussions ask for bend order. The right conclusion is staged investment, not deletion.
