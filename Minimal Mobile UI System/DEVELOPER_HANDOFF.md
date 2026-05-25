# Bend Pro - Developer Handoff

**Version**: 1.0.0-beta  
**Platform**: React Native + Expo  
**Design Date**: 2026-05-25  
**Status**: Ready for Implementation

---

## 1. Design Tokens

### Colors

#### Surfaces
```typescript
const surfaces = {
  background: '#05070B',    // Deep navy/black - app background
  screen: '#080C13',        // Screen-level backgrounds (headers, nav)
  surface: '#101722',       // Card backgrounds
  surface2: '#151E2B',      // Elevated cards, secondary surfaces
  border: '#263142',        // All borders and dividers
};
```

#### Text
```typescript
const text = {
  foreground: '#F6F8FB',      // Primary text (white)
  mutedForeground: '#8F9BAD', // Secondary text (gray)
};
```

#### Actions
```typescript
const actions = {
  primary: '#35BDF8',         // Electric blue - main actions, active states
  primaryForeground: '#05070B', // Text on primary buttons
  
  mark: '#FF7A2F',           // Mark orange - physical marking indicators
  markForeground: '#05070B', // Text on mark buttons
  
  warning: '#FFD22E',        // Warning yellow - beta labels, hints
  warningForeground: '#05070B', // Text on warning badges
  
  success: '#4ADE80',        // Success green - confirmations
  successForeground: '#05070B', // Text on success states
  
  destructive: '#EF4444',    // Error red - errors, destructive actions
  destructiveForeground: '#F6F8FB', // Text on error states
};
```

#### Alpha Variants (for backgrounds)
```typescript
const alphaColors = {
  primaryBackground: 'rgba(53, 189, 248, 0.1)',   // primary/10
  primaryBorder: 'rgba(53, 189, 248, 0.3)',       // primary/30
  
  markBackground: 'rgba(255, 122, 47, 0.2)',      // mark/20
  markBorder: 'rgba(255, 122, 47, 0.3)',          // mark/30
  
  warningBackground: 'rgba(255, 210, 46, 0.05)',  // warning/5
  warningBorder: 'rgba(255, 210, 46, 0.3)',       // warning/30
};
```

### Typography

#### Font Sizes
```typescript
const fontSize = {
  '5xl': 48,  // Large calculated results
  '4xl': 40,  // Result cards
  '2xl': 24,  // Large input values
  'xl': 20,   // Input units, secondary results
  'lg': 18,   // Screen titles, headers
  'base': 16, // Body text, labels, list items
  'sm': 14,   // Helper text, descriptions
  'xs': 12,   // Badges, hints, fine print
};
```

#### Font Weights
```typescript
const fontWeight = {
  normal: '400',  // Body text
  medium: '600',  // Headings, labels, buttons
};
```

#### Line Height
```typescript
const lineHeight = {
  tight: 1.2,     // Large display numbers
  normal: 1.5,    // Body text
  relaxed: 1.75,  // Long-form content
};
```

#### Font Family
```typescript
const fontFamily = {
  default: 'System',     // iOS: SF Pro, Android: Roboto
  mono: 'Monospace',     // For formulas, numbers
};
```

### Spacing

```typescript
const spacing = {
  0: 0,
  1: 4,    // Tight gaps (icon spacing)
  2: 8,    // Button groups, small gaps
  3: 12,   // Card internal spacing
  4: 16,   // Standard padding (screen horizontal)
  5: 20,   // Card padding
  6: 24,   // Section spacing
  8: 32,   // Large gaps
  10: 40,  // Extra large gaps
  12: 48,  // Screen section spacing
  16: 64,  // Major sections
  20: 80,  // Bottom navigation spacing
};
```

### Border Radius

```typescript
const borderRadius = {
  sm: 4,     // Small elements
  md: 8,     // Buttons, inputs
  lg: 12,    // Cards
  xl: 16,    // Bottom sheets, modals
  '2xl': 20, // Large modals
  full: 999, // Pills, badges, circular
};
```

### Shadows (Optional)

```typescript
const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
```

### Touch Targets

```typescript
const touchTargets = {
  minimum: 44,     // Absolute minimum (iOS HIG)
  recommended: 48, // Recommended minimum
  comfortable: 56, // Comfortable for gloves
  large: 64,       // Large inputs
};
```

---

## 2. Components

### 2.1 AppTopBar

**Purpose**: Top navigation bar for main screens

**Props**:
```typescript
interface AppTopBarProps {
  title: string;
  badge?: string;           // Optional "Beta" badge
  rightIcon?: ReactNode;    // Optional icon (HelpCircle, etc)
  onRightIconPress?: () => void;
}
```

**Specifications**:
- Height: 56px + SafeArea top
- Background: `screen`
- Border: `border` 1px bottom
- Padding: 16px horizontal
- Logo: Circle icon, 24px, `primary` color
- Title: `lg` (18px), `medium` weight
- Badge: `xs` (12px), `warning` background

**Example**:
```tsx
<AppTopBar 
  title="Bend Pro"
  badge="Beta"
  rightIcon={<HelpCircle size={20} color={colors.foreground} />}
  onRightIconPress={openHelp}
/>
```

---

### 2.2 BottomNavigation

**Purpose**: Primary tab navigation (4 tabs)

**Props**:
```typescript
interface BottomNavigationProps {
  activeTab: 'layout' | 'benders' | 'guide' | 'settings';
  onTabChange: (tab: string) => void;
}
```

**Tabs**:
| ID | Icon | Label |
|----|------|-------|
| layout | Layers | Layout |
| benders | Wrench | Benders |
| guide | GraduationCap | Guide |
| settings | Settings | Settings |

**Specifications**:
- Height: 64px + SafeArea bottom
- Background: `screen`
- Border: `border` 1px top
- 4 equal-width tabs
- Icon size: 24px
- Label: `xs` (12px)
- Active color: `primary`
- Inactive color: `mutedForeground`

**Example**:
```tsx
<BottomNavigation
  activeTab="layout"
  onTabChange={(tab) => router.push(`/(tabs)/${tab}`)}
/>
```

---

### 2.3 SetupChip

**Purpose**: Collapsed setup display with edit action

**Props**:
```typescript
interface SetupChipProps {
  mainText: string;        // "EMT 3/4" • 30°"
  subText: string;         // "Tap to change bender, unit, rounding"
  onEdit: () => void;
}
```

**Specifications**:
- Height: auto (min 72px)
- Padding: 16px
- Border: `border` 1px, radius `lg` (12px)
- Background: `surface`
- Main text: `base` (16px), `foreground`
- Sub text: `xs` (12px), `mutedForeground`
- Edit button: ghost variant, `sm` size

**Example**:
```tsx
<SetupChip
  mainText='EMT 3/4" • 30°'
  subText="Tap to change bender, unit, rounding"
  onEdit={() => setShowSetup(true)}
/>
```

---

### 2.4 BigMeasurementInput

**Purpose**: Large input for primary measurements

**Props**:
```typescript
interface BigMeasurementInputProps {
  label: string;
  value: string;
  unit: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  autoFocus?: boolean;
}
```

**Specifications**:
- Height: 64px (input only)
- Padding: 16px
- Border: `border` 1px, radius `lg` (12px)
- Background: `surface`
- Label: `sm` (14px), `mutedForeground`, 8px margin-bottom
- Input: `2xl` (24px), `foreground`, tabular numbers
- Unit: `xl` (20px), `mutedForeground`, absolute right
- Keyboard: numeric

**Example**:
```tsx
<BigMeasurementInput
  label="Offset Height"
  value={height}
  unit="in"
  placeholder="0"
  onChangeText={setHeight}
  autoFocus
/>
```

---

### 2.5 AngleSelector

**Purpose**: Compact angle selection buttons

**Props**:
```typescript
interface AngleSelectorProps {
  selectedAngle: number;
  angles: number[];
  commonAngle?: number;     // Highlight as "most common"
  onSelect: (angle: number) => void;
}
```

**Specifications**:
- Button height: 48px
- Gap: 8px
- Border radius: `md` (8px)
- Selected: `primary` background
- Unselected: `surface2` background with `border`
- Text: `sm` (14px), `medium` weight
- Hint text: `xs` (12px), `warning` color

**Example**:
```tsx
<AngleSelector
  selectedAngle={30}
  angles={[10, 22.5, 30, 45, 60]}
  commonAngle={30}
  onSelect={setAngle}
/>
```

---

### 2.6 MarkingGuide

**Purpose**: Visual pipe representation with marks (Hero component)

**Props**:
```typescript
interface MarkingGuideProps {
  mark1Label: string;
  mark1Value: string;
  mark2Label: string;
  mark2Value: string;
  distanceValue: string;
  shrinkValue?: string;
  unit?: string;
}
```

**Specifications**:
- Container height: 120px
- Pipe height: 64px
- Pipe: gradient from `surface2` to `surface`
- Mark width: 4px, `mark` color
- Distance line: 1px, `primary/30`
- Distance badge: pill, `primary/30` border
- Labels: `xs` (12px), `mutedForeground`
- Values: `sm` (14px), `foreground`

**Example**:
```tsx
<MarkingGuide
  mark1Label="Mark 1"
  mark1Value="Start"
  mark2Label="Mark 2"
  mark2Value="+8&quot;"
  distanceValue="8"
  shrinkValue="1"
  unit="in"
/>
```

---

### 2.7 ActionResultCard

**Purpose**: Display calculated results with helper text

**Props**:
```typescript
interface ActionResultCardProps {
  label: string;
  value: string;
  unit?: string;
  helperText: string;
  variant?: 'primary' | 'secondary' | 'mark';
}
```

**Specifications**:
- Padding: 20px
- Border: `border` 1px, radius `lg` (12px)
- Background: `surface2`
- Label: `sm` (14px), `mutedForeground`
- Value: `4xl` (40px), colored by variant, tabular
- Unit: `xl` (20px), `mutedForeground`
- Helper: `sm` (14px), `mutedForeground`
- Gap: 12px vertical

**Variant Colors**:
- `primary`: `primary` (#35BDF8)
- `mark`: `mark` (#FF7A2F)
- `secondary`: `foreground` (#F6F8FB)

**Example**:
```tsx
<ActionResultCard
  label="Mark 2 Distance"
  value="8"
  unit="in"
  helperText="Measure from Mark 1"
  variant="mark"
/>
```

---

### 2.8 DrawerRow

**Purpose**: Expandable section trigger

**Props**:
```typescript
interface DrawerRowProps {
  title: string;
  subtitle?: string;
  isExpanded?: boolean;
  icon?: ReactNode;
  onPress: () => void;
  variant?: 'default' | 'primary';  // primary for "Open Guided Mode"
}
```

**Specifications**:
- Height: min 56px
- Padding: 12px vertical, 16px horizontal
- Border: `border` 1px, radius `lg` (12px)
- Background: `surface` (default) or `primary/10` (primary)
- Title: `sm` (14px), colored by variant
- Subtitle: `xs` (12px), `mutedForeground`
- Chevron: 16px, rotates 180° when expanded

**Example**:
```tsx
<DrawerRow
  title="Optional First Mark"
  isExpanded={showFirst}
  onPress={() => setShowFirst(!showFirst)}
/>

<DrawerRow
  title="Open Guided Mode"
  variant="primary"
  onPress={openGuided}
/>
```

---

### 2.9 FamilyTile

**Purpose**: Bend family selection tile

**Props**:
```typescript
interface FamilyTileProps {
  title: string;
  icon: ReactNode;
  status: 'active' | 'coming-soon';
  onPress?: () => void;
}
```

**Specifications**:
- Width: 50% - 12px (2 columns, 8px gap)
- Height: 120px
- Padding: 24px
- Border: `border` 1px, radius `lg` (12px)
- Background: `surface`
- Icon: 32px, `primary` color
- Title: `sm` (14px)
- Gap: 12px between icon and title
- Disabled: 50% opacity

**Example**:
```tsx
<FamilyTile
  title="Offset"
  icon={<Move size={32} color={colors.primary} />}
  status="active"
  onPress={() => selectFamily('offset')}
/>
```

---

### 2.10 BottomSheet

**Purpose**: Sliding modal for settings/pickers

**Props**:
```typescript
interface BottomSheetProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  primaryAction?: {
    label: string;
    onPress: () => void;
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
  onClose: () => void;
}
```

**Specifications**:
- Max height: 70vh
- Width: 100% (max 448px centered)
- Border radius: `xl` (16px) top only
- Background: `screen`
- Handle: 48px × 4px, `border` color
- Title: `lg` (18px), `medium` weight
- Content: scrollable
- Action buttons: 48px height
- Backdrop: rgba(5, 7, 11, 0.8) with blur

**Example**:
```tsx
<BottomSheet
  isOpen={showSetup}
  title="Setup"
  primaryAction={{ label: "Apply", onPress: apply }}
  secondaryAction={{ label: "Cancel", onPress: close }}
  onClose={close}
>
  {/* Setup sections */}
</BottomSheet>
```

**Library**: Use `@gorhom/bottom-sheet`

---

### 2.11 SearchPickerRow

**Purpose**: List item for searchable picker

**Props**:
```typescript
interface SearchPickerRowProps {
  title: string;
  description?: string;
  family: string;          // Not displayed, for grouping
  status: 'active' | 'coming-soon';
  onPress?: () => void;
}
```

**Specifications**:
- Height: min 64px (80px with description)
- Padding: 16px
- Border: `border` 1px bottom only
- Background: transparent
- Hover: `surface2`
- Title: `base` (16px)
- Description: `sm` (14px), `mutedForeground`
- Badge: `xs` (12px), `warning` variant
- Chevron: 20px (active only)
- Disabled: 50% opacity

**Example**:
```tsx
<SearchPickerRow
  title="Basic Offset"
  description="Clear obstruction. Stay parallel."
  family="Offset"
  status="active"
  onPress={select}
/>
```

---

## 3. Screens

### 3.1 Layout Home

**Route**: `/(tabs)/index.tsx`

**Components Used**:
- AppTopBar
- ContinueLayoutCard (custom)
- StartNewLayoutRow (custom)
- FamilyTile (4 tiles)
- BottomNavigation

**State**:
```typescript
const [hasRecentLayout, setHasRecentLayout] = useState(true);
const [recentLayout, setRecentLayout] = useState<Layout | null>(null);
```

**Actions**:
- Continue → Open workbench with recent layout
- Start New → Open StartNewLayoutPicker
- Family Tile → Open workbench with bend type

---

### 3.2 Offset Workbench

**Route**: `/workbench/offset.tsx` (modal)

**Components Used**:
- AppTopBar (with close, help icons)
- SetupChip
- BigMeasurementInput
- AngleSelector
- MarkingGuide
- ActionResultCard (2x)
- DrawerRow (2x)
- Button (Mark Complete)

**State**:
```typescript
const [offsetHeight, setOffsetHeight] = useState('');
const [selectedAngle, setSelectedAngle] = useState(30);
const [showOptionalFirst, setShowOptionalFirst] = useState(false);
const [setup, setSetup] = useState<SetupConfig>({...});
```

**Calculations**:
```typescript
import { calculateOffset } from '@/utils/calculations/offset';

const result = calculateOffset({
  offsetHeight: parseFloat(offsetHeight),
  angle: selectedAngle,
  conduitType: setup.conduitType,
  conduitSize: setup.conduitSize,
});

// result: { mark2Distance, shrink, multiplier }
```

---

### 3.3 Edit Setup (Bottom Sheet)

**Route**: Not a route, rendered in workbench

**Components Used**:
- BottomSheet
- Button (groups for selections)
- Card (for sections)

**Sections**:
1. Conduit (Type + Size)
2. Bender (Current + Change button)
3. Unit (Imperial/Metric)
4. Rounding (1/16", 1/8", 1/4")
5. Save as Default (Toggle)

**State**:
```typescript
const [conduitType, setConduitType] = useState('EMT');
const [conduitSize, setConduitSize] = useState('3/4');
const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
const [rounding, setRounding] = useState('1/16');
const [saveAsDefault, setSaveAsDefault] = useState(false);
```

---

### 3.4 Start New Layout Picker

**Route**: Modal overlay

**Components Used**:
- AppTopBar (with close)
- TextInput (search)
- SearchPickerRow (grouped by family)
- FlatList or SectionList

**State**:
```typescript
const [searchQuery, setSearchQuery] = useState('');
const bendTypes = [...]; // Array of bend type objects
const filteredTypes = useMemo(() => 
  bendTypes.filter(type => 
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  ), [searchQuery]
);
```

**Families**:
- Offset (4 types)
- 90s (3 types)
- Saddles (2 types)
- Large / Advanced (2 types)

---

### 3.5 Guided Mode

**Route**: `/guided/offset.tsx` (full screen)

**Components Used**:
- AppTopBar (with close)
- Card (multiple for sections)
- FormulaCard (custom)
- AnnotatedMarkingGuide (custom)
- StepList (custom)
- MistakesList (custom)
- Button (Back to Calculator)

**Sections**:
1. Explanation (concept)
2. Formula Cards (2x)
3. Visual Guide (annotated)
4. Multipliers Table
5. Bending Steps (5 steps)
6. Common Mistakes (4 items)

---

### 3.6 Benders

**Route**: `/(tabs)/benders.tsx`

**Components Used**:
- AppTopBar
- CurrentBenderCard (custom)
- TextInput (search)
- BenderListItem (custom)
- Button (Add custom)
- BottomNavigation

**State**:
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [benders, setBenders] = useState<Bender[]>([...]);
const [currentBender, setCurrentBender] = useState<Bender>({...});
```

---

### 3.7 Settings

**Route**: `/(tabs)/settings.tsx`

**Components Used**:
- AppTopBar
- Card (for grouped sections)
- SettingRow (custom)
- BottomNavigation

**Sections**:
1. Defaults (5 items)
2. Interface (2 items)
3. About (2 items)

**State**:
```typescript
const settings = useSettings(); // From context
```

---

## 4. Implementation Notes

### 4.1 Project Structure

```
app/
├── (tabs)/
│   ├── _layout.tsx          # Tab navigator
│   ├── index.tsx            # Layout home (default)
│   ├── benders.tsx          # Benders tab
│   ├── guide.tsx            # Guide tab
│   └── settings.tsx         # Settings tab
├── workbench/
│   ├── offset.tsx           # Offset calculator
│   ├── ninety.tsx           # 90° calculator
│   └── saddle.tsx           # Saddle calculator
├── guided/
│   ├── offset.tsx           # Guided mode: offset
│   └── ...
└── _layout.tsx              # Root layout

components/
├── navigation/
│   ├── AppTopBar.tsx
│   └── BottomNavigation.tsx
├── workbench/
│   ├── SetupChip.tsx
│   ├── BigMeasurementInput.tsx
│   ├── AngleSelector.tsx
│   ├── MarkingGuide.tsx
│   └── ActionResultCard.tsx
├── layout/
│   ├── ContinueLayoutCard.tsx
│   ├── StartNewLayoutRow.tsx
│   ├── BendFamilyTile.tsx
│   └── SearchPickerRow.tsx
├── guided/
│   ├── FormulaCard.tsx
│   ├── StepList.tsx
│   └── MistakesList.tsx
└── ui/
    ├── Button.tsx
    ├── Card.tsx
    ├── Badge.tsx
    ├── Input.tsx
    └── BottomSheet.tsx

utils/
├── calculations/
│   ├── offset.ts
│   ├── ninety.ts
│   ├── saddle.ts
│   └── types.ts
└── theme/
    ├── colors.ts
    ├── typography.ts
    └── spacing.ts

contexts/
├── LayoutContext.tsx
├── SettingsContext.tsx
└── BenderContext.tsx
```

### 4.2 Calculation Separation

**Rule**: Keep calculator math separate from UI.

**Example**: Offset calculation
```typescript
// utils/calculations/offset.ts
export interface OffsetInput {
  offsetHeight: number;
  angle: number;
  conduitType: string;
  conduitSize: string;
}

export interface OffsetResult {
  mark2Distance: number;
  shrink: number;
  multiplier: number;
}

export function calculateOffset(input: OffsetInput): OffsetResult {
  const multipliers: Record<number, number> = {
    10: 6.0,
    22.5: 2.6,
    30: 2.0,
    45: 1.4,
    60: 1.2,
  };
  
  const multiplier = multipliers[input.angle] || 2.0;
  const mark2Distance = input.offsetHeight * multiplier;
  const shrink = input.offsetHeight * 0.25;
  
  return { mark2Distance, shrink, multiplier };
}
```

**UI consumes formatted values**:
```tsx
const result = calculateOffset({
  offsetHeight: parseFloat(height),
  angle: selectedAngle,
  conduitType: setup.conduitType,
  conduitSize: setup.conduitSize,
});

<ActionResultCard
  label="Mark 2 Distance"
  value={result.mark2Distance.toFixed(2)}
  unit="in"
  helperText="Measure from Mark 1"
  variant="mark"
/>
```

### 4.3 Settings & Defaults

**Rule**: Units and rounding are defaults/settings, not always shown.

**Implementation**:
```typescript
// contexts/SettingsContext.tsx
interface Settings {
  unit: 'imperial' | 'metric';
  rounding: string;
  conduitType: string;
  conduitSize: string;
  defaultBender: string;
  appearance: 'dark' | 'light';
  defaultMode: 'field' | 'guided';
}

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({
    unit: 'imperial',
    rounding: '1/16',
    conduitType: 'EMT',
    conduitSize: '3/4',
    defaultBender: 'Generic Hand Bender',
    appearance: 'dark',
    defaultMode: 'field',
  });
  
  // Persist to AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);
  
  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
```

**Usage in components**:
```tsx
const { settings } = useSettings();

// Use settings.unit, settings.rounding, etc.
// Only show in Edit Setup when user needs to change
```

### 4.4 Progressive Disclosure

**Rule**: First mark is optional and collapsed by default.

**Implementation**:
```tsx
const [showOptionalFirst, setShowOptionalFirst] = useState(false);

// In render:
<DrawerRow
  title="Optional First Mark"
  isExpanded={showOptionalFirst}
  onPress={() => setShowOptionalFirst(!showOptionalFirst)}
/>

{showOptionalFirst && (
  <Card>
    <BigMeasurementInput
      label="Distance from reference"
      value={firstMarkDistance}
      unit="in"
      onChangeText={setFirstMarkDistance}
    />
  </Card>
)}
```

**Rule**: Guided Mode is separate from Field Mode.

**Implementation**:
- Default: Field Mode (calculator only)
- Optional: Guided Mode (full screen overlay)
- Access: "Open Guided Mode" button (primary variant)

```tsx
// Workbench screen
<DrawerRow
  title="Open Guided Mode"
  variant="primary"
  onPress={() => router.push('/guided/offset')}
/>
```

### 4.5 Bender Selection

**Rule**: Bender selection is accessible through Edit Setup.

**Implementation**:
```tsx
// Edit Setup Bottom Sheet
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Bender</Text>
  
  <Card>
    <View style={styles.currentBender}>
      <Text style={styles.label}>Current</Text>
      <Text style={styles.value}>{setup.bender}</Text>
    </View>
    
    <Button 
      variant="outline"
      onPress={() => router.push('/(tabs)/benders')}
    >
      Change bender →
    </Button>
    
    <Text style={styles.note}>
      Bender-specific guidance can affect markings and 
      instructions when available.
    </Text>
  </Card>
</View>
```

**Flow**:
1. User taps "Edit" on SetupChip
2. Bottom sheet opens with current bender
3. User taps "Change bender"
4. Navigate to Benders tab
5. User selects bender
6. Return to workbench with new bender

---

## 5. Component Props Reference

### Quick Reference Table

| Component | Key Props | Height | Notes |
|-----------|-----------|--------|-------|
| AppTopBar | title, badge?, rightIcon? | 56px | + SafeArea |
| BottomNavigation | activeTab, onTabChange | 64px | + SafeArea |
| SetupChip | mainText, subText, onEdit | auto | Min 72px |
| BigMeasurementInput | label, value, unit, onChangeText | 64px | Input only |
| AngleSelector | selectedAngle, angles, onSelect | 48px | Buttons |
| MarkingGuide | mark1/2Label/Value, distanceValue | 120px | Full component |
| ActionResultCard | label, value, unit, helperText, variant | auto | Min 120px |
| DrawerRow | title, subtitle?, isExpanded?, onPress | 56px | Min height |
| FamilyTile | title, icon, status, onPress | 120px | Fixed |
| BottomSheet | isOpen, title, children, actions, onClose | 70vh | Max |
| SearchPickerRow | title, description?, status, onPress | 64px | Min (80px with desc) |

---

## 6. Development Checklist

### Phase 1: Foundation
- [ ] Set up Expo project with TypeScript
- [ ] Install dependencies (Expo Router, React Navigation, etc.)
- [ ] Create design token files (colors, typography, spacing)
- [ ] Set up folder structure
- [ ] Create theme provider

### Phase 2: Core Components
- [ ] Button (5 variants)
- [ ] Card
- [ ] Badge
- [ ] Input
- [ ] AppTopBar
- [ ] BottomNavigation

### Phase 3: Workbench Components
- [ ] SetupChip
- [ ] BigMeasurementInput
- [ ] AngleSelector
- [ ] MarkingGuide (Hero component)
- [ ] ActionResultCard
- [ ] DrawerRow

### Phase 4: Layout Components
- [ ] FamilyTile
- [ ] SearchPickerRow
- [ ] ContinueLayoutCard
- [ ] StartNewLayoutRow

### Phase 5: Screens
- [ ] Layout Home
- [ ] Offset Workbench
- [ ] Edit Setup Bottom Sheet
- [ ] Start New Layout Picker
- [ ] Benders
- [ ] Settings

### Phase 6: Logic
- [ ] Offset calculations
- [ ] Settings context
- [ ] Layout context
- [ ] Bender context
- [ ] AsyncStorage persistence

### Phase 7: Advanced
- [ ] Guided Mode
- [ ] 90° calculator
- [ ] Saddle calculator
- [ ] Testing
- [ ] Performance optimization

---

## 7. Libraries & Dependencies

### Required
```json
{
  "expo": "~51.0.0",
  "expo-router": "~3.5.0",
  "react-native": "0.74.0",
  "react-native-safe-area-context": "4.10.0",
  "react-native-screens": "~3.31.0",
  "@react-native-async-storage/async-storage": "1.23.0",
  "lucide-react-native": "^0.400.0"
}
```

### Recommended
```json
{
  "@gorhom/bottom-sheet": "^4.6.0",
  "react-native-reanimated": "~3.10.0",
  "react-native-gesture-handler": "~2.16.0"
}
```

### Dev Dependencies
```json
{
  "typescript": "~5.3.0",
  "@types/react": "~18.2.0",
  "@types/react-native": "~0.73.0"
}
```

---

## 8. Assets Required

### Icons
Use `lucide-react-native` for all icons:
- Circle (logo)
- Layers (Layout tab)
- Wrench (Benders tab)
- GraduationCap (Guide tab)
- Settings (Settings tab)
- HelpCircle
- ChevronRight
- ChevronDown
- X (close)
- Search
- Plus
- Move (Offset icon)
- CornerDownRight (90° icon)
- Mountain (Saddle icon)
- Zap (Advanced icon)
- BookOpen (Guided mode)
- AlertTriangle (Warnings)

### Fonts
System fonts (no custom fonts needed):
- iOS: SF Pro
- Android: Roboto

---

## 9. Testing Requirements

### Unit Tests
- Calculation functions (offset.ts, etc.)
- Utility functions
- Context providers

### Component Tests
- All 11 core components
- Prop validation
- Event handlers
- Accessibility

### Integration Tests
- Complete user flows
- Navigation
- State persistence
- Bottom sheet interactions

### Visual Tests
- Screenshot testing
- Different screen sizes (iPhone SE to iPad)
- Dark theme only (for now)
- Text scaling

---

## 10. Performance Targets

- App launch: <2 seconds
- Screen transition: <300ms
- Calculation: <50ms
- Bottom sheet animation: 60fps
- List scrolling: 60fps
- Input responsiveness: <100ms

---

## 11. Accessibility Requirements

### WCAG 2.1 Level AA
- Color contrast: 4.5:1 (body text)
- Color contrast: 3:1 (UI elements)
- Touch targets: ≥44px
- Screen reader support
- Keyboard navigation (desktop web)

### React Native Accessibility
```tsx
<Pressable
  accessible
  accessibilityRole="button"
  accessibilityLabel="Edit setup"
  accessibilityHint="Opens setup configuration"
>
```

---

## 12. Contact & Questions

**Design Lead**: [Your Name]  
**Email**: [Your Email]  
**Figma**: [Link to Figma file]  
**GitHub**: [Repository URL]

**Questions?**
- Slack: #bend-pro-dev
- Email: team@bendpro.app

---

**Handoff Status**: ✅ Ready for Implementation  
**Last Updated**: 2026-05-25  
**Version**: 1.0.0-beta
