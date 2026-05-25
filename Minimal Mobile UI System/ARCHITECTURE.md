# Bend Pro - App Architecture

## Technical Stack

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Styling**: Tailwind CSS (NativeWind)

## Navigation Structure

### Bottom Tabs (Primary Navigation)

```
app/(tabs)/
├── layout.tsx          // Default tab - Continue or start layouts
├── benders.tsx         // Manage benders and database
├── guide.tsx           // Learning content and help
└── settings.tsx        // App defaults and preferences
```

### Modal Screens

```
app/
├── workbench.tsx       // Main calculator screen (modal)
└── edit-setup.tsx      // Bottom sheet for quick settings
```

## Screen Hierarchy

### 1. Layout Tab (Default)

**Purpose**: Clean starting point for field work

**Components**:
- AppTopBar (minimal)
- Main question: "What are you laying out?"
- ContinueLayoutCard (if recent layout exists)
- StartNewLayoutRow (secondary action)
- BendFamilyTile grid (4 compact tiles)

**User Flow**:
1. Open app → Layout tab
2. Tap "Continue" → Workbench (resume)
3. Tap family tile → Workbench (new bend type)
4. Tap "Start new" → Clear and go to Workbench

### 2. Benders Tab

**Purpose**: Manage current bender and database

**Components**:
- CurrentBenderCard (shows active bender)
- BenderList (searchable database)
- BenderSelectionRow

**Content**:
- Current default: Generic Hand Bender
- Change bender button
- Compact bender database/search
- Later: custom bender creation

### 3. Guide Tab

**Purpose**: Learning and reference

**Components**:
- TopicCard
- FormulaDisplay
- CommonMistakeCard

**Content**:
- Guided Mode lessons
- Bend type explanations
- Formula reference
- Common mistakes
- Tips and tricks

### 4. Settings Tab

**Purpose**: Default preferences only

**Content**:
- Default unit (imperial/metric)
- Default rounding (1/16", 1/8", etc.)
- Default conduit type (EMT, PVC, etc.)
- Default conduit size (¾", 1", etc.)
- Default bender
- Appearance (dark/light)
- Default mode (field/guided)

### 5. Workbench (Modal)

**Purpose**: Main calculator screen

**Components**:
- WorkbenchTopBar (shows bend type, back button)
- SetupChip (tap to open Edit Setup bottom sheet)
- InputSection (measurement inputs)
- ResultDisplay (calculated marks)
- ActionButtons (Mark complete, Share, etc.)

**Key Principle**: 
Keep this screen clean. All settings accessible via Edit Setup bottom sheet, not always visible.

### 6. Edit Setup (Bottom Sheet)

**Purpose**: Quick access to frequently changed settings

**Content**:
- Conduit type selector
- Conduit size selector
- Bender selector
- Unit selector
- Rounding selector

## Component Library

### Navigation Components

**AppTopBar**
- Props: title, subtitle?, badge?, actions?
- Used on all main screens
- Minimal design: logo/title + optional menu

**BottomNavigation**
- 4 tabs: Layout, Benders, Guide, Settings
- Icons + labels
- Active state with primary color

### Layout Components

**ContinueLayoutCard**
- Shows last active layout
- Bend type + description
- Most useful recent result
- Primary button: "Open Workbench"

**StartNewLayoutRow**
- Single clean row/button
- Secondary styling
- Not a huge prominent section

**BendFamilyTile**
- Small, compact tile
- Icon + label
- Grid layout (2x2)
- Families: Offset, 90s, Saddles, Large/Advanced

### Calculator Components

**SetupChip**
- Compact, tappable chip
- Shows current setup: "¾" EMT • Shoe 1"
- Opens Edit Setup bottom sheet

**InputSection**
- Large input with unit
- Clear label
- Touch-friendly

**ResultDisplay**
- Large calculated value
- Unit label
- Color-coded (mark orange, primary blue)

### Utility Components

**BottomSheet**
- Swipeable bottom sheet
- Backdrop
- Multiple snap points
- Used for Edit Setup, selection modals

**Card**
- Flexible container
- Border, rounded corners
- Different variants

**Button**
- Multiple variants (primary, mark, secondary, ghost, outline)
- Multiple sizes
- Touch-friendly (min 48px height)

**Badge**
- Small status indicator
- Color variants

## Data Flow

### State Management

```typescript
// App-level context
- currentLayout: Layout | null
- recentLayouts: Layout[]
- currentBender: Bender
- userDefaults: Settings
- savedBenders: Bender[]

// Layout state
interface Layout {
  id: string
  bendType: BendFamily
  bendVariant: string
  description: string
  inputs: Record<string, number>
  results: BendResult[]
  setup: BendSetup
  timestamp: Date
}

// Bend setup
interface BendSetup {
  conduitType: string
  conduitSize: string
  bender: string
  unit: 'imperial' | 'metric'
  rounding: string
}
```

### Navigation Flow

```
Layout Tab
  ├─> Continue → Workbench (modal)
  ├─> Family Tile → Workbench (modal, new type)
  └─> Start New → Workbench (modal, clean slate)

Workbench
  ├─> Setup Chip → Edit Setup (bottom sheet)
  ├─> Back → Layout Tab
  └─> Mark Complete → Save & return

Benders Tab
  └─> Select Bender → Update current & return

Guide Tab
  └─> View content (stays in tab)

Settings Tab
  └─> Edit defaults (stays in tab)
```

## Design Principles

### Layout Tab
✓ Clean starting point, not a dashboard
✓ Obvious primary action (continue or start)
✓ Compact family tiles, not large cards
✓ Don't show unfinished features prominently

### Workbench
✓ Calculator screen stays clean
✓ Settings behind bottom sheet
✓ Large inputs and results
✓ Minimal chrome

### Progressive Disclosure
✓ Hide complexity until needed
✓ Edit Setup bottom sheet for quick changes
✓ Full Settings tab for defaults
✓ Guide tab for learning content

### Mobile-First
✓ Touch targets min 48px
✓ Bottom navigation (thumb-friendly)
✓ Bottom sheets (native mobile pattern)
✓ Single column layouts
✓ Swipe gestures where appropriate

### Field-Ready
✓ High contrast colors
✓ Large readable text
✓ Fast workflows
✓ Minimal taps to result

## File Structure

```
app/
├── (tabs)/
│   ├── _layout.tsx          // Tab navigator
│   ├── layout.tsx           // Layout tab (default)
│   ├── benders.tsx          // Benders tab
│   ├── guide.tsx            // Guide tab
│   └── settings.tsx         // Settings tab
├── workbench.tsx            // Calculator modal
├── edit-setup.tsx           // Setup bottom sheet
└── _layout.tsx              // Root layout

components/
├── navigation/
│   ├── AppTopBar.tsx
│   └── BottomNavigation.tsx
├── layout/
│   ├── ContinueLayoutCard.tsx
│   ├── StartNewLayoutRow.tsx
│   └── BendFamilyTile.tsx
├── workbench/
│   ├── SetupChip.tsx
│   ├── InputSection.tsx
│   └── ResultDisplay.tsx
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Input.tsx
│   └── BottomSheet.tsx
└── benders/
    ├── CurrentBenderCard.tsx
    └── BenderListItem.tsx

contexts/
├── LayoutContext.tsx
├── BenderContext.tsx
└── SettingsContext.tsx

utils/
├── calculations/
│   ├── offset.ts
│   ├── ninety.ts
│   ├── saddle.ts
│   └── types.ts
└── cn.ts

styles/
└── theme.ts                 // Design tokens
```

## Key Implementation Notes

### Expo Router Setup
- Use file-based routing
- Bottom tabs via `(tabs)` group
- Modals via `presentation: "modal"` in stack

### Bottom Sheet
- Use `@gorhom/bottom-sheet` or similar
- Snap points: [0.3, 0.6, 0.9]
- Backdrop dismissal
- Smooth animations

### State Persistence
- AsyncStorage for layouts and settings
- Context + useReducer for app state
- Persist current layout on background

### Accessibility
- Proper label props
- Touch target sizes (min 48px)
- Screen reader support
- High contrast mode

## Future Considerations

- Offline support (already available with native)
- Photo/camera for pipe measurements
- Save/share layouts
- Custom bender database
- Team/instructor features
- Export to PDF
