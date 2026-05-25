# Guided Mode - Design Documentation

## Overview

Guided Mode is an educational overlay for Bend Pro that helps apprentices, students, and instructors understand how bends work. It provides formulas, visual explanations, step-by-step instructions, and common mistakes without cluttering the main Field Mode calculator.

## Design Philosophy

**Separate from Field Mode**: Experienced electricians don't need explanations—they just need results. Guided Mode is an opt-in learning layer.

**Teaching Support, Not Hand-Holding**: Provides clear explanations and references without being patronizing.

**Clean and Organized**: Educational content should be easy to scan and reference during learning.

## When to Use

### Primary Audience
- **Apprentices**: Learning conduit bending fundamentals
- **Students**: In technical schools or training programs
- **Instructors**: Teaching bending techniques
- **Self-learners**: Electricians expanding their skills

### Access Points
1. From Offset Workbench: Tap "Open Guided Mode" button
2. From Guide tab: Tap "Offset Bend" topic
3. From help icon: Context-sensitive help

## Screen Structure

### Header
```
┌─────────────────────────────────┐
│ 📖 Guided Mode: Offset Bend [X] │
└─────────────────────────────────┘
```
- Book icon indicates learning mode
- Bend type clearly stated
- Close button returns to calculator

### Content Sections

#### 1. Short Explanation
```
┌─────────────────────────────────┐
│ An offset bend moves conduit    │
│ around an obstruction while     │
│ keeping it parallel to its      │
│ original path. Two bends at the │
│ same angle create the offset.   │
└─────────────────────────────────┘
```
- 2-3 sentences maximum
- High-level concept
- No technical jargon
- Blue tinted card for learning content

#### 2. Formula Cards

**Spacing Formula**
```
┌─────────────────────────────────┐
│ Spacing Between Marks           │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Spacing = Offset Height     │ │
│ │           × Multiplier      │ │
│ └─────────────────────────────┘ │
│                                 │
│ Example                         │
│ 4" × 2 = 8"                     │
└─────────────────────────────────┘
```

**Shrink Formula**
```
┌─────────────────────────────────┐
│ Shrink Amount                   │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Shrink = Offset Height × 1/4│ │
│ └─────────────────────────────┘ │
│                                 │
│ Example                         │
│ 4" × 0.25 = 1"                  │
└─────────────────────────────────┘
```

**Design Notes**:
- Formula displayed in monospace font
- Gray background box for formula
- Real example using current values
- Blue accent color for results

#### 3. Visual Explanation
```
     ┌─────────────┐        ┌─────────────┐
     │   Mark 1    │        │   Mark 2    │
     │ First bend  │        │ Second bend │
     └─────────────┘        └─────────────┘
          │                      │
          │◄─── Spacing: 8" ────►│
    ──────┃═══════════════════════┃──────
    ──────┃═══════════════════════┃──────
    
          Shrink: 1"
```

Enhanced marking guide with:
- Labeled marks (Mark 1, Mark 2)
- Role descriptions (First bend, Second bend)
- Spacing measurement
- Shrink annotation below
- Same visual style as calculator marking guide

#### 4. Multipliers Reference Table
```
┌─────────────────────────────────┐
│ Multipliers by Angle            │
├─────────────────────────────────┤
│ 10°                        6.0  │
│ 22.5°                      2.6  │
│ 30°                        2.0  │ ← Active
│ 45°                        1.4  │
│ 60°                        1.2  │
└─────────────────────────────────┘
```
- Quick reference for all common angles
- Current angle highlighted in primary color
- Simple two-column layout

#### 5. Bending Steps
```
┌─────────────────────────────────┐
│ Bending Steps                   │
├─────────────────────────────────┤
│ ① Mark the first bend location  │
│    on the conduit.              │
│                                 │
│ ② Measure the spacing distance  │
│    to mark the second bend.     │
│                                 │
│ ③ Bend both marks at the        │
│    selected angle using your    │
│    bender.                      │
│                                 │
│ ④ Keep bends opposite and       │
│    parallel to each other.      │
│                                 │
│ ⑤ Check the finished offset     │
│    height matches your target.  │
└─────────────────────────────────┘
```

**Design Elements**:
- Numbered circles (primary blue)
- Clear, actionable steps
- One action per step
- Progressive order (mark → measure → bend → check)

#### 6. Common Mistakes
```
┌─────────────────────────────────┐
│ Common Mistakes to Avoid        │
├─────────────────────────────────┤
│ ⚠ Forgetting shrink when        │
│   landing on a target           │
│                                 │
│ ⚠ Bending marks in the wrong    │
│   direction (not opposite)      │
│                                 │
│ ⚠ Using the wrong bender mark   │
│   or degree indicator           │
│                                 │
│ ⚠ Not checking that bends are   │
│   parallel after completion     │
└─────────────────────────────────┘
```

**Design Elements**:
- Warning triangle icon (yellow)
- Yellow-tinted card
- Practical mistakes from field experience
- Preventive guidance

#### 7. Back to Calculator Button
```
┌─────────────────────────────────┐
│      Back to Calculator         │
└─────────────────────────────────┘
```
- Primary blue button
- Returns to Offset Workbench
- Closes Guided Mode

## Component Architecture

### Reusable Components

**FormulaCard**
```typescript
interface FormulaCardProps {
  title: string;
  formula: string;
  example: {
    calculation: string;
    result: string;
  };
}
```

**StepList**
```typescript
interface StepListProps {
  steps: string[];
}
```

**MistakesList**
```typescript
interface MistakesListProps {
  mistakes: string[];
}
```

**AnnotatedMarkingGuide**
```typescript
interface AnnotatedMarkingGuideProps {
  spacing: string;
  shrink: string;
  unit?: string;
}
```

## Content Strategy

### What to Include
✅ Conceptual explanations (what and why)  
✅ Formulas with real examples  
✅ Visual representations  
✅ Step-by-step procedures  
✅ Common mistakes (preventive)  
✅ Quick reference tables  

### What to Exclude
❌ Historical background  
❌ Code references (unless critical)  
❌ Multiple approaches (keep it simple)  
❌ Excessive warnings  
❌ Theoretical calculations  
❌ Advanced edge cases  

## Progressive Disclosure

### On Workbench Screen
- Collapsed by default
- Single button: "Open Guided Mode"
- Blue/primary styling (indicates learning)
- Chevron points right (indicates navigation)

### In Guided Mode
- Full-screen experience
- All educational content visible
- Scrollable for reference
- Easy return to calculator

## Visual Hierarchy

1. **Explanation** (concept)
2. **Formulas** (math)
3. **Visual** (spatial understanding)
4. **Multipliers** (reference)
5. **Steps** (procedure)
6. **Mistakes** (prevention)

## Color Usage

| Element | Color | Purpose |
|---------|-------|---------|
| Formula cards | Blue tint | Learning content |
| Formula result | Primary blue | Emphasize answer |
| Step numbers | Primary blue | Progress indicator |
| Mistake warnings | Yellow | Caution |
| Back button | Primary blue | Main action |

## Typography

- **Title**: 16px (text-base)
- **Body text**: 16px (text-base) - readable for all ages
- **Formulas**: Monospace font, 14px
- **Step numbers**: 14px in circle
- **Annotations**: 14px (text-sm)

## Spacing

- Section gap: 24px (1.5rem)
- Card padding: 20px (1.25rem)
- Step gap: 12px (0.75rem)
- Mistake gap: 12px (0.75rem)

## Mobile Considerations

### Scrolling
- Full vertical scroll
- Maintain bottom spacing (80px for nav)
- Smooth scroll to sections

### Touch Targets
- Back button: 56px height
- All interactive elements: min 48px

### Performance
- Lightweight content
- No heavy animations
- Fast render

## Integration Points

### From Offset Workbench
```typescript
<Button onClick={onOpenGuided}>
  Open Guided Mode
</Button>
```

### From Guide Tab
- Topic card: "Offset Bend"
- Opens same Guided Mode screen
- Contextual to bend type

### From Help Icon
- Context-sensitive help
- Quick tips vs. full guide
- Link to full Guided Mode

## Future Enhancements

- [ ] Video demonstrations
- [ ] Interactive 3D pipe visualization
- [ ] Quiz mode (test understanding)
- [ ] Printable reference cards
- [ ] Augmented reality overlay
- [ ] Multi-language support
- [ ] Audio narration
- [ ] Instructor notes mode
- [ ] Progress tracking for students
- [ ] Certification integration

## Content Maintenance

### When to Update
- New bending techniques discovered
- Feedback from instructors
- Common new mistakes identified
- Code changes (NEC updates)
- Bender manufacturer updates

### Version Control
- Track content changes
- Date educational updates
- Maintain accuracy
- Review with experts

## Accessibility

- Clear, simple language
- High contrast text
- Logical reading order
- Screen reader compatible
- No flashing animations
- Descriptive labels

## Testing Scenarios

1. **First-time learner**: Clear enough to understand without instructor?
2. **Quick reference**: Can find formula in 5 seconds?
3. **Visual learner**: Annotated guide makes sense?
4. **Step follower**: Steps actionable in sequence?
5. **Mistake avoider**: Warnings prevent common errors?
6. **Return to work**: Easy to get back to calculator?

## Design Validation

✅ **Separate from Field Mode** (not cluttering calculator)  
✅ **Comprehensive** (covers all aspects of offset bends)  
✅ **Organized** (clear sections, logical flow)  
✅ **Visual** (diagrams and examples)  
✅ **Practical** (real-world steps and mistakes)  
✅ **Accessible** (easy to open and close)  
✅ **Reusable** (components work for other bend types)  

## Comparison: Field Mode vs. Guided Mode

| Aspect | Field Mode | Guided Mode |
|--------|-----------|-------------|
| Purpose | Calculate fast | Learn deeply |
| Content | Inputs & results | Explanations & steps |
| Formulas | Hidden | Displayed |
| Steps | Implicit | Explicit |
| Mistakes | None shown | Highlighted |
| Target | Experienced | Learning |
| Speed | 3 taps | Reference |

Both modes serve their purpose without compromising the other.

## Instructor Use Cases

### In Classroom
- Project screen for demonstration
- Students follow on their devices
- Reference during hands-on practice
- Quiz students on formulas

### On Job Site
- Apprentice self-reference
- Quick formula lookup
- Mistake prevention checklist
- Confidence building

### Certification Prep
- Study material
- Formula memorization
- Procedure review
- Error recognition

This design makes Bend Pro valuable for learning without sacrificing its speed for experienced users.
