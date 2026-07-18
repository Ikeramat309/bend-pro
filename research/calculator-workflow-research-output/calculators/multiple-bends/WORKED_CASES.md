# Build a Run - worked scenarios

These are product-state cases, not new bend math.

## Two solved children fit

- Stick = 120 in, measured from Start A.
- Child 1: Stub 90 result owns an Arrow mark at 24.5 in.
- Child 2: Offset result owns center marks at 36 in and 48 in.
- Confirmed order: Stub bend, Offset center 1, Offset center 2.

The plan lists three marks with their different references and reports remaining coordinate tail of 72 in after the last mark. It must not call this final cut tail unless all developed-length effects are supported.

## Child moves atomically

If the offset anchor moves +4 in, both of its centers move to 40/52. The internal 12-inch spacing stays owned by the offset. No old 36/48 marks remain.

## Opposite-origin conflict

Child 1 is from Start A; Child 2 arrives measured from End B. Build a Run blocks readiness until stick length and an explicit conversion produce common Start-A stations. It never sorts raw `24` and `18` as if they share an origin.

## Manual mark

A cut at 80 in may be added manually. It appears as dashed/unverified and does not acquire bend reference or gain behavior.

## Shortage

Any required trusted extent above 120 in produces `Does not fit` and identifies the first child crossing the endpoint. It is not drawn beyond the stick.

## Stale result

If a calculator engine version changes and a child cannot be deterministically migrated/recomputed, plan readiness blocks until the child is reviewed.
