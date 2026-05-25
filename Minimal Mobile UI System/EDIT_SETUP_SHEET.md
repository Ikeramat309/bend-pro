# Edit Setup Bottom Sheet - Design Documentation

## Overview

The Edit Setup bottom sheet provides quick access to calculation-specific settings without cluttering the main workbench screen. It opens when the user taps the setup chip in the Offset Workbench.

## Design Principles

**Progressive Disclosure**: Settings are hidden by default, revealed on demand.

**Context-Specific**: Only shows settings that affect the current calculation, not app-wide preferences.

**Clean Organization**: Grouped into logical sections with clear hierarchy.

**Quick Access**: Bottom sheet (not full screen) keeps context visible.

## Bottom Sheet Structure

### Handle & Header
```
    ═══
┌─────────────────────────────────┐
│ Setup                           │
├─────────────────────────────────┤
```
- Swipeable handle (visual affordance)
- Simple "Setup" title (no close button in header)
- Bottom sheet can be dismissed by:
  - Swiping down
  - Tapping backdrop
  - Tapping Cancel
  - Tapping Apply

### Content Sections

#### 1. Conduit
**Type Selection**
```
Conduit
Type
[EMT] [PVC] [IMC] [RMC]
```
- 4 common conduit types
- Single selection (button group)
- Horizontal layout (fits in one row)

**Size Selection**
```
Size
[1/2"] [3/4"] [1"]
[1-1/4"] [1-1/2"] [2"]
```
- 6 common sizes
- 3 per row (fits mobile width)
- Inch symbol displayed
- Sizes that fit hand benders

**Why these options?**
- EMT (Electrical Metallic Tubing) - most common
- PVC (Polyvinyl Chloride) - outdoor/underground
- IMC (Intermediate Metal Conduit) - indoor commercial
- RMC (Rigid Metal Conduit) - heavy-duty industrial

Sizes ½" to 2" cover 95% of hand bending scenarios.

#### 2. Bender
```
Bender
┌─────────────────────────────────┐
│ Current                         │
│ Generic Hand Bender             │
│                                 │
│ [Change bender          →]      │
│                                 │
│ Bender-specific guidance can    │
│ affect markings and             │
│ instructions when available.    │
└─────────────────────────────────┘
```
- Shows current bender selection
- "Change bender" opens separate modal/screen
- Explanatory note about why bender matters
- Lighter background distinguishes from selectors

**Why a separate screen?**
- Bender database is extensive
- Needs search functionality
- Requires more vertical space
- Better handled in dedicated view

**Note importance**:
Different benders have different:
- Deduction values
- Gain factors
- Multiplier adjustments
- Shoe markings

#### 3. Unit
```
Unit
[Imperial] [Metric]
```
- Toggle between unit systems
- Imperial: inches, feet
- Metric: millimeters, centimeters
- Changes available rounding options

#### 4. Rounding
```
Rounding
[1/16"] [1/8"] [1/4"]
```
For Imperial (default):
- 1/16" - Precise work, tight fits
- 1/8" - Standard field work
- 1/4" - Rough work, large conduit

For Metric (when selected):
```
Rounding
[1 mm] [5 mm] [10 mm]
```
- 1 mm - Precise
- 5 mm - Standard
- 10 mm - Rough

Rounding options change based on selected unit.

#### 5. Save as Default Toggle
```
┌─────────────────────────────────┐
│ Use this setup as default    ○  │
└─────────────────────────────────┘
```
When enabled:
```
┌─────────────────────────────────┐
│ Use this setup as default    ●  │
└─────────────────────────────────┘
```
- Toggle switch (familiar mobile pattern)
- Off by default
- When on: saves these settings for future calculations
- Visual feedback (blue when active)

### Bottom Buttons
```
├─────────────────────────────────┤
│ [Cancel]        [Apply]         │
└─────────────────────────────────┘
```
- Fixed at bottom (always visible)
- Two equal-width buttons
- Cancel: outline style, dismisses without changes
- Apply: primary blue, saves and closes
- Separated by border from content

## Layout Specifications

### Spacing
- Section gap: 24px (1.5rem)
- Subsection gap: 12px (0.75rem)
- Button gap: 8px (0.5rem)
- Padding: 16px (1rem) horizontal, 24px (1.5rem) vertical

### Max Height
- 70vh (viewport height)
- Scrollable if content exceeds
- Bottom buttons remain fixed

### Width
- Max-width: 448px (28rem)
- Centered on larger screens
- Full-width on mobile

## Interaction States

### Buttons
- **Default**: Secondary background, border visible
- **Selected**: Primary blue, no border needed
- **Hover** (desktop): Slight opacity change
- **Active** (tap): Scale down slightly

### Toggle Switch
- **Off**: Gray background, knob on left
- **On**: Blue background, knob on right
- **Transition**: Smooth 200ms animation

### Backdrop
- Semi-transparent black (80% opacity)
- Blur effect for depth
- Tappable to dismiss

## State Management

```typescript
interface SetupConfig {
  conduitType: string;      // "EMT" | "PVC" | "IMC" | "RMC"
  conduitSize: string;      // "1/2" | "3/4" | "1" | etc.
  bender: string;           // "Generic Hand Bender" | specific model
  unit: "imperial" | "metric";
  rounding: string;         // "1/16" | "1/8" | "1/4" or "1 mm" | etc.
  saveAsDefault: boolean;
}
```

### Default Values
```typescript
{
  conduitType: "EMT",
  conduitSize: "3/4",
  bender: "Generic Hand Bender",
  unit: "imperial",
  rounding: "1/16",
  saveAsDefault: false
}
```

### Apply Behavior
1. User taps Apply
2. If `saveAsDefault` is true:
   - Save to app settings
   - Use for all future calculations
3. If `saveAsDefault` is false:
   - Use only for current calculation
   - Don't affect other bend types
4. Close bottom sheet
5. Update setup chip display
6. Recalculate results with new settings

### Cancel Behavior
1. User taps Cancel (or swipes/taps backdrop)
2. Discard all changes
3. Revert to previous values
4. Close bottom sheet
5. No recalculation needed

## Visual Hierarchy

1. **Section titles** (muted, small, uppercase in design)
2. **Subsection labels** (muted, extra small)
3. **Current values** (primary text, larger)
4. **Buttons** (primary or secondary styling)
5. **Helper text** (muted, small, explanatory)

## Accessibility

- Minimum touch targets: 48px
- Clear contrast ratios
- Logical tab order
- Screen reader labels
- Semantic HTML structure

## Mobile Considerations

### iOS
- Respects safe areas (notch, home indicator)
- Swipe-down gesture to dismiss
- Haptic feedback on selection (optional)

### Android
- Back button dismisses (same as Cancel)
- Material-like bottom sheet behavior
- Respects navigation bar height

### Landscape
- Sheet height adjusts to fit
- Content remains scrollable
- Max-width prevents excessive width

## Integration Points

### From Offset Workbench
```typescript
<SetupChip onClick={onOpenSetup} />
```
- User taps "Edit" on setup chip
- Bottom sheet slides up
- Main screen dimmed behind

### To Benders Screen
```typescript
<Button onClick={navigateToBenders}>
  Change bender
</Button>
```
- Opens full Benders tab
- User selects from database
- Returns to setup sheet with selection

### To Settings
- If user enables "Save as default"
- Settings are persisted app-wide
- Applied to future calculations
- Can be changed later in Settings tab

## Future Enhancements

- [ ] Recently used conduit sizes (quick access)
- [ ] Favorite benders (starred in list)
- [ ] Custom conduit types
- [ ] Advanced rounding (decimal places)
- [ ] Unit conversion preview
- [ ] Bender recommendations based on conduit
- [ ] Setup presets (residential, commercial, industrial)
- [ ] Share setup configuration

## Testing Scenarios

1. **Quick change**: Change conduit size, tap Apply
2. **Unit switch**: Imperial → Metric, verify rounding updates
3. **Save default**: Enable toggle, verify persistence
4. **Cancel mid-edit**: Change multiple values, tap Cancel, verify rollback
5. **Backdrop dismiss**: Tap outside, verify Cancel behavior
6. **Scroll content**: Small screen, verify buttons stay fixed
7. **Bender navigation**: Tap "Change bender", verify navigation
8. **Rounding edge case**: 1/16" → Metric → back to Imperial, verify 1/16" still selected

## Design Validation

✅ **Clean**: Only essential settings visible  
✅ **Organized**: Logical sections with clear labels  
✅ **Quick**: 2-3 taps to change setting  
✅ **Contextual**: Only affects current calculation (unless default)  
✅ **Dismissible**: Multiple ways to cancel  
✅ **Mobile-native**: Bottom sheet pattern, touch-friendly  
✅ **Visual feedback**: Selected states clear  
✅ **Helpful**: Explanatory note for bender  

This bottom sheet keeps the main workbench screen clean while providing fast access to all calculation-affecting settings.
