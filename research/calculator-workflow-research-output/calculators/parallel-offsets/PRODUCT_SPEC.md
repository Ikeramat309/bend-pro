# Parallel Offsets - product specification

## Job

Lay out the same planar offset across an equal-size EMT rack while keeping the intended center-to-center gap through the diagonal bends.

## Core promise

`Tell me how both bend marks move on every next pipe, with Pipe 1 and the direction fixed.`

## Flow

### Quick Shift

Required: rack C-C, bend angle, pipe count, Pipe 1 side/order.

Hero: `Move both marks [shift] on each next pipe.`

The result immediately lists relative shifts for Pipe 1 through Pipe N. Do not require the user to multiply the constant mentally.

### Full Rack Layout

Adds offset rise and optional Pipe 1 Center 1 from a selected conduit end.

Returns:

- center distance between bends;
- relative shift per pipe;
- absolute Center 1 and Center 2 for every pipe when Pipe 1 Center 1 is supplied;
- total rack shift.

## Calculation

Progression per conduit:

`shift = rack C-C x tan(bend angle / 2)`

Center distance between the two offset bends:

`DBB = rise / sin(angle)`

Both corresponding marks on Pipe N move by `(N - 1) x shift` in the selected physical direction.

## Inputs and setup

- Same conduit size, same bend angle, same offset rise, and same reference method across the rack are explicit assumptions.
- Selected bender controls reference guidance/profile-specific feasibility, not the half-angle progression itself.
- Direction is chosen with an illustrated `next pipes move toward this end` control.

## Results

**Hero:** shift sentence plus full relative table.

**Secondary:** DBB in Full Layout and total shift.

Every table row includes Pipe, Shift from Pipe 1, Center 1, and Center 2 where available.

## Warnings

- Zero/non-positive spacing or angle: block.
- Mixed sizes, rolling offsets, different angles, or different rises: unsupported.
- Negative absolute marks: withhold affected absolute rows; retain safe relative shift.
- Close bend spacing may not physically fit the selected shoe even when center math is valid; profile-specific feasibility remains separate.

## Verdict

**Refine, implementation-ready.** Formula and combined workflow are sound; reference, direction, and table actionability are the remaining work.
