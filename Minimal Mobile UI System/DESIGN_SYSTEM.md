# Bend Pro Design System

A minimal mobile UI system for a conduit layout assistant built for electricians in the field.

## Design Philosophy

**Less UI, more useful action.**

Bend Pro is designed as a fast field tool, not a generic calculator or SaaS dashboard. The interface prioritizes:

- **Speed**: Open → enter → calculate → bend
- **Clarity**: Large, readable numbers for on-site use
- **Focus**: Only show what's needed right now
- **Practicality**: Futuristic but functional

## Core Workflow

```
Measure → Mark → Bend → Check
```

Everything in the UI supports this linear workflow.

## Color System

### Semantic Usage

Colors in Bend Pro have specific meanings tied to real-world actions:

| Color | Usage | Reasoning |
|-------|-------|-----------|
| **Electric Blue** (`#35BDF8`) | Main actions, calculated results, active states | Primary interaction color |
| **Mark Orange** (`#FF7A2F`) | Physical pipe marks, marking indicators | Matches safety orange marking paint |
| **Warning Yellow** (`#FFD22E`) | Beta labels, warnings, common angle hints | Standard warning color |
| **Success Green** (`#4ADE80`) | Confirmations, completed states | Universal success indicator |
| **Error Red** (`#EF4444`) | Errors, destructive actions | Universal error indicator |

### Palette

```css
/* Surfaces */
--background: #05070B    /* Deep navy/black base */
--screen: #080C13        /* Screen backgrounds */
--surface: #101722       /* Card backgrounds */
--surface-2: #151E2B     /* Elevated surfaces */
--border: #263142        /* Subtle borders */

/* Text */
--foreground: #F6F8FB    /* Primary text - high contrast */
--muted-foreground: #8F9BAD  /* Secondary text */

/* Actions */
--primary: #35BDF8       /* Electric blue */
--mark: #FF7A2F          /* Mark orange */
--warning: #FFD22E       /* Warning yellow */
--success: #4ADE80       /* Success green */
--destructive: #EF4444   /* Error red */
```

## Typography

### Scale

- **48px**: Large calculated results (e.g., mark distances)
- **24px**: Input fields, secondary results
- **16px**: Body text, labels
- **14px**: Metadata, helper text
- **12px**: Badges, micro-copy

### Principles

- Use tabular numbers for measurements
- Keep labels short (2-4 words max)
- Default to medium weight (600) for buttons and headings
- Use normal weight (400) for body text

## Components

### Button

Primary interaction element with semantic variants:

```tsx
<Button variant="primary">Calculate</Button>     // Main actions
<Button variant="mark">Mark complete</Button>    // Physical marking
<Button variant="secondary">Cancel</Button>      // Secondary actions
<Button variant="ghost">Edit setup</Button>      // Tertiary actions
<Button variant="outline">New bend</Button>      // Outlined style
```

**Sizes**: `sm`, `default`, `lg`, `icon`

### Input

Large, touch-friendly inputs with optional units:

```tsx
<Input placeholder="0" unit="in" />
<Input placeholder="0" unit="°" />
```

Default height: 64px (4rem) for easy field use.

### ResultDisplay

Purpose-built for showing calculated values:

```tsx
<ResultDisplay 
  label="Mark at" 
  value="24" 
  unit="in" 
  variant="mark" 
/>
```

### Card

Container for grouped information:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Bend Type</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

Use `bg-surface-2` for elevated/secondary cards.

### Badge

Status and metadata indicators:

```tsx
<Badge variant="warning">BETA</Badge>
<Badge variant="success">Complete</Badge>
<Badge variant="primary">Active</Badge>
```

## Layout Principles

### Field Mode (Default)

- Single column layout
- Maximum width: 448px (28rem)
- Consistent 16px horizontal padding
- 24px vertical spacing between sections
- Bottom navigation bar for mode switching

### Information Hierarchy

1. **Critical**: Calculated results, current measurement
2. **Important**: Action buttons, bend type selection
3. **Contextual**: Setup info, metadata
4. **Optional**: Settings, sharing, saved setups

### Spacing

- **24px** (1.5rem): Section spacing
- **16px** (1rem): Component spacing
- **8px** (0.5rem): Internal component spacing
- **4px** (0.25rem): Tight groupings

## Interaction Patterns

### Touch Targets

Minimum height: 48px (3rem)
Recommended: 56px (3.5rem) for primary actions

### States

- **Default**: Solid backgrounds, clear borders
- **Hover**: Slight opacity reduction (90%)
- **Active**: Scale transform (0.95)
- **Disabled**: 50% opacity, no pointer events
- **Focus**: 2px primary ring

### Feedback

- Use `toast` notifications for async operations
- Inline validation for inputs
- Immediate visual feedback on button press
- Success states for completed actions

## Icons

Uses Lucide React. Common icons:

- `Settings`: Configuration
- `Menu`: Navigation
- `Circle`: Logo/branding
- `Ruler`: Measurement tools
- `Plus`, `Minus`: Adjustments
- `Check`: Confirmation

## Responsive Behavior

Designed mobile-first for vertical orientation:

- Portrait: Default layout
- Landscape: Consider input keyboard overlap
- Tablet: Center content, maintain max-width

## Accessibility

- High contrast ratios (WCAG AAA where possible)
- Touch targets meet minimum sizes
- Focus indicators on all interactive elements
- Semantic HTML structure
- Screen reader friendly labels

## File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── ResultDisplay.tsx
│   │   └── ComponentShowcase.tsx
│   ├── utils.ts
│   └── App.tsx
└── styles/
    ├── theme.css      // Design tokens
    └── fonts.css      // Font imports
```

## Usage Guidelines

### Do's

✓ Use primary blue for calculated results and main actions  
✓ Use mark orange for physical marking indicators  
✓ Keep the interface minimal - hide complexity  
✓ Prioritize the current workflow step  
✓ Use large, readable type for measurements  

### Don'ts

✗ Don't add unnecessary cards or sections  
✗ Don't make it look like a generic SaaS app  
✗ Don't use small touch targets  
✗ Don't show settings/options in the primary view  
✗ Don't use decorative elements without purpose  

## Future Considerations

- Dark mode support (already implemented)
- Guided mode for students
- Offline support for field use
- Saved setups and templates
- Unit system switching (imperial/metric)
