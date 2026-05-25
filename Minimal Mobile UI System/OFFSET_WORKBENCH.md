# Offset Bend Workbench - Design Documentation

## Overview

The Offset Bend Workbench is the primary calculator screen for offset bends in Bend Pro. It exemplifies the app's "less UI, more useful action" philosophy through progressive disclosure and a strong visual identity.

## Design Philosophy

**Field Mode First**: The default view is optimized for experienced electricians who know what they need. Complex settings, formulas, and learning content are hidden by default but accessible when needed.

**Fast Workflow**: Open → enter offset height → get mark distance in 3 taps.

## Screen Structure

### 1. Top Bar
```
[X]  Offset Bend  [?]
```
- Left: Close/back button
- Center: Bend type name
- Right: Help icon (context-sensitive help)

### 2. Setup Chip (Collapsed Settings)
```
┌─────────────────────────────────┐
│ EMT ¾" • 30°              Edit  │
│ Tap to change bender, unit...   │
└─────────────────────────────────┘
```

**Key Decision**: All settings (conduit type, size, bender, unit, rounding) are behind the "Edit" button which opens a bottom sheet. This keeps the main screen clean and focused.

**Why not show settings?**
- Field electricians rarely change these mid-calculation
- Once set as defaults, they persist
- Beginners can access via Settings tab
- Edit button provides escape hatch when needed

### 3. Main Input: Offset Height
```
┌─────────────────────────────────┐
│ Offset Height                   │
│ ┌─────────────────────────────┐ │
│ │  4                      in  │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```
- Large touch target (64px height)
- Auto-focus on mount
- Numeric keyboard
- Unit displayed inline (not editable on screen)

### 4. Angle Selector
```
┌─────────────────────────────────┐
│ Bend Angle                      │
│ [10°] [22.5°] [30°] [45°] [60°]│
└─────────────────────────────────┘
```
- Compact button group
- Common angles only
- 30° selected by default (most common)
- Responsive to tap

### 5. Hero Component: Marking Guide

**This is the visual identity of Bend Pro.**

```
       Mark 1        Mark 2
        Start         +8"
          │            │
          │◄───8"────►│
    ──────┃═══════════┃──────
    ──────┃═══════════┃──────
    ──────┃═══════════┃──────
```

**Visual Elements**:
- Stylized conduit pipe (gradient, subtle texture lines)
- Orange vertical marks (matches safety marking paint)
- Blue distance indicator with badge
- Clear labels above marks
- Distance measurement between marks

**Why this is important**:
- Provides instant visual feedback
- Matches real-world marking process
- Reduces cognitive load (visual > numbers)
- Makes app memorable and distinctive
- Electricians can "see" what they're marking

**Implementation Details**:
- Pipe: Gradient from `surface-2` to `surface` with border
- Marks: 4px wide orange bars (`bg-mark`)
- Distance: Thin blue line with endpoint dots
- Badge: Pill-shaped with primary color
- Texture: Subtle vertical lines for depth

### 6. Primary Results

**Card 1: Mark 2 Distance**
```
┌─────────────────────────────────┐
│ Mark 2 Distance                 │
│ 8 in                            │
│ Measure from Mark 1             │
└─────────────────────────────────┘
```
- Large number (40px, orange for mark)
- Clear instruction
- This is the primary result

**Card 2: Shrink** (conditional)
```
┌─────────────────────────────────┐
│ Shrink                          │
│ 1 in                            │
│ Only if landing on target       │
└─────────────────────────────────┘
```
- Only shown when > 0
- Contextual subtitle explains when to use
- Secondary importance (muted styling)

### 7. Progressive Disclosure

**Optional First Mark** (collapsed by default)
```
[Optional First Mark            ▼]
```
When expanded:
- Input for reference point distance
- Calculates Mark 1 from reference
- For electricians who need precise starting points

**Guided Mode / Learn** (collapsed by default)
```
[Guided Mode / Learn            ▼]
```
When expanded:
- How offset bends work
- Formula explanation
- Multiplier reference
- Step-by-step guidance
- Formula: height × multiplier = distance

**Why collapsed?**
- Field electricians don't need explanations
- Students can access when learning
- Keeps main screen fast and uncluttered
- Still discoverable (clear labels)

### 8. Action Button

```
┌─────────────────────────────────┐
│      Mark Complete              │
└─────────────────────────────────┘
```
- Only shown when result is calculated
- Orange background (mark color)
- Primary action for completing the bend
- Future: Save to history, share, etc.

## Information Hierarchy

1. **Critical**: Offset height input, angle selector
2. **Primary**: Marking Guide visualization, Mark 2 distance
3. **Secondary**: Shrink amount (conditional)
4. **Tertiary**: Optional first mark (collapsed)
5. **Educational**: Guided mode (collapsed)

## What's NOT Shown by Default

❌ Formula steps  
❌ Multiplier value  
❌ Calculation breakdown  
❌ Unit selector  
❌ Rounding selector  
❌ Bender selector  
❌ Conduit type selector  
❌ Long explanations  
❌ Tips and warnings  

All of these are accessible:
- Via Edit Setup button (bottom sheet)
- Via Guided Mode toggle (on screen)
- Via Settings tab (for defaults)
- Via Guide tab (for learning)

## Calculations

### Mark 2 Distance
```typescript
distance = offsetHeight × multiplier
```

Multipliers by angle:
- 10°: 6.0
- 22.5°: 2.6
- 30°: 2.0
- 45°: 1.4
- 60°: 1.2

### Shrink
```typescript
shrink = offsetHeight × 0.25
```

Only relevant when landing on a specific target point.

## Color Usage

| Element | Color | Reasoning |
|---------|-------|-----------|
| Mark bars | Orange (`#FF7A2F`) | Matches safety marking paint |
| Distance indicator | Blue (`#35BDF8`) | Primary interaction color |
| Mark 2 result | Orange | Primary calculated mark |
| Shrink result | White | Secondary information |
| Guided mode | Blue tint | Learning content |

## Touch Targets

- Input field: 64px
- Angle buttons: 48px
- Setup chip: 72px (with padding)
- Expand/collapse: 56px
- Action button: 56px

All exceed minimum 48px for field use.

## State Management

```typescript
interface OffsetWorkbenchState {
  offsetHeight: string;
  selectedAngle: number;
  showOptionalFirst: boolean;
  showGuided: boolean;
}
```

Simple local state. Future: persist to context/storage.

## Mobile Considerations

- Auto-focus on input
- Numeric keyboard for height
- Scrollable content (small screens)
- Bottom nav always visible
- No horizontal scroll
- Single column layout

## Success Metrics

**Speed**: 3 taps to result
- Tap input
- Enter height
- View marking guide

**Clarity**: 
- Visual marking guide reduces errors
- Large numbers easy to read outdoors
- Clear labeling (Mark 1, Mark 2)

**Flexibility**:
- Collapsed sections for power users
- Guided mode for learners
- Optional first mark for complex layouts

## Future Enhancements

- [ ] Photo/camera for measuring offset height
- [ ] Save marking setup for later
- [ ] Share marking guide as image
- [ ] History of recent calculations
- [ ] Custom angle input
- [ ] Multiple pipe visualization
- [ ] AR overlay for marking (advanced)

## Component Reusability

### MarkingGuide
Can be reused for:
- 90° bends (single mark)
- 3-point saddles (three marks)
- Back-to-back bends (two marks)
- History view (show past marks)

Just adjust:
- Number of marks
- Mark positions
- Labels
- Distance indicators

### AngleSelector
Can be reused for:
- Any bend type with angle selection
- Configurable angle sets per bend type
- Custom angle ranges

### ResultCard
Can be reused for:
- Any calculated result
- Color-coded by type (mark, distance, angle)
- Consistent formatting across bend types

## Testing Scenarios

1. **Fast field use**: Enter height, get result < 5 seconds
2. **Learning mode**: Expand guided section, understand formula
3. **Optional first mark**: Calculate from reference point
4. **Angle change**: Switch angles, see results update
5. **Small offset**: Verify shrink calculation
6. **Zero input**: No results shown until height entered

## Design Validation

✅ Minimal (only essential elements visible)  
✅ Fast (3 taps to result)  
✅ Visual (marking guide shows what to do)  
✅ Progressive (complexity hidden until needed)  
✅ Field-ready (large targets, high contrast)  
✅ Learnable (guided mode available)  
✅ Flexible (optional sections for power users)  

This screen is the gold standard for all other bend type calculators in Bend Pro.
