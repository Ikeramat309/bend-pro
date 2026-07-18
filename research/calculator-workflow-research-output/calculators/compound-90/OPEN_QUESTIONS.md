# Compound 90 - open questions

## Must resolve before production correction

1. Exact user-facing names for wall-aligned and diamond orientations; validate the pictures before the wording.
2. Whether the existing `square` saved state migrates to diamond or requires re-selection to avoid silently changing math.
3. Rounding policy for source tables that round an intermediate back basis before subtracting half OD.
4. Which production bender profiles have verified 45-degree center-reference metadata.

## Can follow after beta

1. Whether support-depth adjustment deserves an Advanced input.
2. Whether users want a corner-location/finished-leg mode beyond center spacing.
3. Whether the result should offer `bend long and cut to fit` guidance for common installation cases.

## Explicitly out of scope

- Non-45 compound pairs
- Segmented 90s
- Non-EMT material
- Shoe-specific CLR collision guarantees without verified profile data
