# Bend Pro - Component Library

A mobile-first component library for React Native + Expo, designed specifically for field electricians.

## Design Principles

- **Mobile-first**: Touch targets ≥48px, thumb-friendly layouts
- **High contrast**: Outdoor-readable colors
- **Minimal**: No decorative elements, only functional design
- **Fast**: Optimized for quick interactions
- **Field-ready**: Large text, clear actions

## Color System

```typescript
const colors = {
  // Surfaces
  background: '#05070B',
  screen: '#080C13',
  surface: '#101722',
  surface2: '#151E2B',
  border: '#263142',
  
  // Text
  foreground: '#F6F8FB',
  mutedForeground: '#8F9BAD',
  
  // Actions
  primary: '#35BDF8',      // Electric blue
  mark: '#FF7A2F',         // Mark orange
  warning: '#FFD22E',      // Warning yellow
  success: '#4ADE80',      // Success green
  destructive: '#EF4444',  // Error red
};
```

---

## 1. AppTopBar

Top navigation bar for all main screens.

### Props
```typescript
interface AppTopBarProps {
  title: string;
  badge?: string;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
}
```

### Usage
```tsx
<AppTopBar 
  title="Bend Pro" 
  badge="Beta"
  rightIcon={<HelpCircle />}
  onRightIconPress={() => {}}
/>
```

### Design
```
┌─────────────────────────────────┐
│ ○ Bend Pro [Beta]        [?]   │
└─────────────────────────────────┘
```

### Specifications
- Height: 56px (header) + safe area
- Padding: 16px horizontal
- Title: 18px (text-lg)
- Badge: Warning variant, 12px text
- Background: screen color
- Border: bottom 1px

### React Native Example
```tsx
<View style={styles.header}>
  <View style={styles.leftSection}>
    <Circle width={24} height={24} color={colors.primary} />
    <Text style={styles.title}>{title}</Text>
    {badge && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    )}
  </View>
  {rightIcon && (
    <Pressable onPress={onRightIconPress}>
      {rightIcon}
    </Pressable>
  )}
</View>
```

---

## 2. BottomNavigation

Primary navigation for app tabs.

### Props
```typescript
interface BottomNavigationProps {
  activeTab: 'layout' | 'benders' | 'guide' | 'settings';
  onTabChange: (tab: string) => void;
}
```

### Usage
```tsx
<BottomNavigation 
  activeTab="layout"
  onTabChange={(tab) => navigate(tab)}
/>
```

### Design
```
┌─────────────────────────────────┐
│  📐       🔧       📚       ⚙️  │
│ Layout  Benders  Guide  Settings│
└─────────────────────────────────┘
```

### Specifications
- Height: 64px + safe area
- 4 equal-width tabs
- Icon size: 24px
- Label: 12px (text-xs)
- Active color: primary
- Inactive color: mutedForeground
- Background: screen color
- Border: top 1px

### Tabs
| Tab | Icon | Label |
|-----|------|-------|
| Layout | Layers | Layout |
| Benders | Wrench | Benders |
| Guide | GraduationCap | Guide |
| Settings | Settings | Settings |

---

## 3. SetupChip

Collapsed settings display for workbench screens.

### Props
```typescript
interface SetupChipProps {
  mainText: string;
  subText: string;
  onEdit: () => void;
}
```

### Usage
```tsx
<SetupChip
  mainText="EMT 3/4&quot; • 30°"
  subText="Tap to change bender, unit, rounding"
  onEdit={() => openSetupSheet()}
/>
```

### Design
```
┌─────────────────────────────────┐
│ EMT 3/4" • 30°            Edit  │
│ Tap to change bender, unit...   │
└─────────────────────────────────┘
```

### Specifications
- Height: auto (72px typical)
- Padding: 16px
- Main text: 16px (text-base)
- Sub text: 12px (text-xs), muted
- Border: 1px, rounded-lg
- Background: surface
- Edit button: ghost variant

---

## 4. BigMeasurementInput

Large input field for primary measurements.

### Props
```typescript
interface BigMeasurementInputProps {
  label: string;
  value: string;
  unit: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
}
```

### Usage
```tsx
<BigMeasurementInput
  label="Offset Height"
  value={height}
  unit="in"
  placeholder="0"
  onChangeText={setHeight}
/>
```

### Design
```
Offset Height
┌─────────────────────────────────┐
│  4                          in  │
└─────────────────────────────────┘
```

### Specifications
- Height: 64px (input only)
- Label: 14px (text-sm), muted, 8px margin-bottom
- Input: 24px (text-2xl)
- Unit: 20px (text-xl), muted, absolute right
- Padding: 16px
- Border: 1px, rounded-lg
- Background: surface
- Keyboard: numeric

### React Native Example
```tsx
<View style={styles.container}>
  <Text style={styles.label}>{label}</Text>
  <View style={styles.inputContainer}>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType="numeric"
      style={styles.input}
    />
    <Text style={styles.unit}>{unit}</Text>
  </View>
</View>
```

---

## 5. AngleSelector

Compact angle selection button group.

### Props
```typescript
interface AngleSelectorProps {
  selectedAngle: number;
  angles: number[];
  commonAngle?: number;
  onSelect: (angle: number) => void;
}
```

### Usage
```tsx
<AngleSelector
  selectedAngle={30}
  angles={[10, 22.5, 30, 45, 60]}
  commonAngle={30}
  onSelect={setAngle}
/>
```

### Design
```
Bend Angle
┌────┬────┬────┬────┬────┐
│10° │22.5│30° │45° │60° │
└────┴────┴────┴────┴────┘
   Most common: 30°
```

### Specifications
- Height: 48px (buttons)
- 5 equal-width buttons
- Gap: 8px
- Selected: primary background
- Unselected: surface2 background
- Text: 14px (text-sm)
- Border: 1px on unselected
- Rounded: 8px
- Hint text: 12px (text-xs), warning color

---

## 6. MarkingGuide

Visual pipe representation with marks and measurements.

### Props
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

### Usage
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

### Design
```
   Mark 1        Mark 2
    Start         +8"
      │            │
      │◄───8"────►│
──────┃═══════════┃──────
──────┃═══════════┃──────
```

### Specifications
- Height: 120px (pipe section)
- Pipe height: 64px
- Mark width: 4px, orange
- Distance line: 1px, primary with dots
- Badge: pill-shaped, primary border
- Labels: 12px (text-xs) above marks
- Values: 14px (text-sm)
- Spacing: 32px margins

### Visual Elements
1. **Pipe**: Gradient surface, subtle texture
2. **Marks**: Vertical orange bars
3. **Distance**: Blue line with measurement badge
4. **Shrink**: Optional annotation below

---

## 7. ActionResultCard

Display calculated results with helper text.

### Props
```typescript
interface ActionResultCardProps {
  label: string;
  value: string;
  unit?: string;
  helperText: string;
  variant?: 'primary' | 'secondary' | 'mark';
}
```

### Usage
```tsx
<ActionResultCard
  label="Mark 2 Distance"
  value="8"
  unit="in"
  helperText="Measure from Mark 1"
  variant="mark"
/>
```

### Design
```
┌─────────────────────────────────┐
│ Mark 2 Distance                 │
│ 8 in                            │
│ Measure from Mark 1             │
└─────────────────────────────────┘
```

### Specifications
- Padding: 20px
- Label: 14px (text-sm), muted
- Value: 40px (text-4xl), colored by variant
- Unit: 20px (text-xl), muted
- Helper: 14px (text-sm), muted
- Gap: 12px between elements
- Border: 1px, rounded-lg
- Background: surface2

### Variant Colors
- `primary`: Primary blue (#35BDF8)
- `mark`: Mark orange (#FF7A2F)
- `secondary`: Foreground white (#F6F8FB)

---

## 8. DrawerRow

Expandable/collapsible section trigger.

### Props
```typescript
interface DrawerRowProps {
  title: string;
  subtitle?: string;
  status?: 'collapsed' | 'expanded';
  icon?: ReactNode;
  onPress: () => void;
}
```

### Usage
```tsx
<DrawerRow
  title="Optional First Mark"
  status="collapsed"
  onPress={toggle}
/>

<DrawerRow
  title="Guided Mode"
  subtitle="Learn how offset bends work"
  status="collapsed"
  icon={<BookOpen />}
  onPress={openGuided}
/>
```

### Design
```
┌─────────────────────────────────┐
│ Optional First Mark          ▼  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 📖 Guided Mode               ▶  │
│ Learn how offset bends work     │
└─────────────────────────────────┘
```

### Specifications
- Height: 56px (min)
- Padding: 12px vertical, 16px horizontal
- Title: 14px (text-sm)
- Subtitle: 12px (text-xs), muted
- Chevron: 16px, rotates 180° when expanded
- Border: 1px, rounded-lg
- Background: surface
- Pressable with hover/active states

---

## 9. FamilyTile

Compact bend family selection tile.

### Props
```typescript
interface FamilyTileProps {
  title: string;
  description?: string;
  status: 'active' | 'coming-soon';
  icon?: ReactNode;
  onPress?: () => void;
}
```

### Usage
```tsx
<FamilyTile
  title="Offset"
  icon={<Move />}
  status="active"
  onPress={selectOffset}
/>

<FamilyTile
  title="3-Point Saddle"
  description="Route over obstacle"
  status="coming-soon"
/>
```

### Design
```
┌──────────────────┐
│      ↕️          │
│    Offset        │
└──────────────────┘

┌──────────────────┐
│  3-Point Saddle  │
│  [Coming Soon]   │
└──────────────────┘
```

### Specifications
- Width: flexible (grid 2 columns)
- Height: 120px
- Padding: 24px
- Icon: 32px, primary color
- Title: 14px (text-sm)
- Badge: 12px (text-xs), warning variant
- Gap: 12px between icon and title
- Border: 1px, rounded-lg
- Background: surface
- Disabled state: 50% opacity

---

## 10. BottomSheet

Sliding modal from bottom for settings and pickers.

### Props
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

### Usage
```tsx
<BottomSheet
  isOpen={showSetup}
  title="Setup"
  primaryAction={{
    label: "Apply",
    onPress: applyChanges
  }}
  secondaryAction={{
    label: "Cancel",
    onPress: close
  }}
  onClose={close}
>
  {/* Content sections */}
</BottomSheet>
```

### Design
```
┌─────────────────────────────────┐
│        ═══                      │
│ Setup                           │
├─────────────────────────────────┤
│                                 │
│ [Content]                       │
│                                 │
├─────────────────────────────────┤
│ [Cancel]      [Apply]           │
└─────────────────────────────────┘
```

### Specifications
- Max height: 70vh
- Width: 100% (max 448px centered)
- Border radius: 16px (top only)
- Handle: 48px wide, 4px tall, gray
- Title: 18px (text-lg)
- Content: Scrollable
- Actions: 48px height, equal width
- Backdrop: 80% black, blur
- Animation: Slide up 200ms

### React Native Implementation
Use `@gorhom/bottom-sheet` or `react-native-modal`

---

## 11. SearchPickerRow

List item for searchable pickers (Start New Layout).

### Props
```typescript
interface SearchPickerRowProps {
  title: string;
  description?: string;
  family: string;
  status: 'active' | 'coming-soon';
  onPress?: () => void;
}
```

### Usage
```tsx
<SearchPickerRow
  title="Basic Offset"
  description="Clear obstruction. Stay parallel."
  family="Offset"
  status="active"
  onPress={select}
/>

<SearchPickerRow
  title="Parallel Offset"
  family="Offset"
  status="coming-soon"
/>
```

### Design
```
┌─────────────────────────────────┐
│ Basic Offset                  → │
│ Clear obstruction. Stay parallel│
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Parallel Offset  [Coming Soon]  │
└─────────────────────────────────┘
```

### Specifications
- Height: auto (64px min, 80px with description)
- Padding: 16px
- Title: 16px (text-base)
- Description: 14px (text-sm), muted
- Badge: 12px (text-xs), warning
- Chevron: 20px, right side
- Border: bottom 1px only
- Background: transparent
- Hover: surface2
- Disabled: 50% opacity

---

## Component Variants

### Button Variants
```typescript
type ButtonVariant = 
  | 'primary'    // Electric blue, main actions
  | 'mark'       // Orange, marking actions
  | 'secondary'  // Gray, secondary actions
  | 'ghost'      // Transparent, tertiary actions
  | 'outline';   // Border only
```

### Badge Variants
```typescript
type BadgeVariant = 
  | 'default'     // Gray
  | 'primary'     // Blue
  | 'mark'        // Orange
  | 'warning'     // Yellow (Coming Soon, Beta)
  | 'success'     // Green
  | 'destructive'; // Red
```

---

## Touch Target Guidelines

All interactive elements must meet minimum touch targets:

| Element Type | Min Size | Recommended |
|-------------|----------|-------------|
| Primary button | 48px | 56px |
| Secondary button | 44px | 48px |
| Input field | 48px | 64px |
| Icon button | 44px | 48px |
| List item | 48px | 56px |
| Nav tab | 48px | 64px |

**Why?** Electricians often wear gloves in the field.

---

## Typography Scale

```typescript
const typography = {
  '5xl': 48,  // Large results (mark distances)
  '4xl': 40,  // Result cards
  '2xl': 24,  // Large inputs
  'xl': 20,   // Input units
  'lg': 18,   // Headers, titles
  'base': 16, // Body text, labels
  'sm': 14,   // Helper text, descriptions
  'xs': 12,   // Badges, hints
};
```

---

## Spacing System

```typescript
const spacing = {
  1: 4,    // Tight (icon gaps)
  2: 8,    // Small (button groups)
  3: 12,   // Medium (card internal)
  4: 16,   // Standard (screen padding)
  5: 20,   // Card padding
  6: 24,   // Section spacing
  8: 32,   // Large gaps
  12: 48,  // Screen sections
};
```

---

## Border Radius

```typescript
const radius = {
  sm: 4,   // Small elements
  md: 8,   // Buttons, inputs
  lg: 12,  // Cards
  xl: 16,  // Bottom sheets
  full: 999, // Pills, badges
};
```

---

## Component Composition Examples

### Offset Workbench Screen
```tsx
<View style={styles.screen}>
  <AppTopBar 
    title="Offset Bend" 
    rightIcon={<HelpCircle />}
  />
  
  <ScrollView>
    <SetupChip
      mainText="EMT 3/4&quot; • 30°"
      subText="Tap to change"
      onEdit={openSetup}
    />
    
    <BigMeasurementInput
      label="Offset Height"
      value={height}
      unit="in"
      onChangeText={setHeight}
    />
    
    <AngleSelector
      selectedAngle={30}
      angles={[10, 22.5, 30, 45, 60]}
      onSelect={setAngle}
    />
    
    <MarkingGuide
      mark1Label="Mark 1"
      mark2Label="Mark 2"
      distanceValue="8"
      unit="in"
    />
    
    <ActionResultCard
      label="Mark 2 Distance"
      value="8"
      unit="in"
      helperText="Measure from Mark 1"
      variant="mark"
    />
  </ScrollView>
  
  <BottomNavigation 
    activeTab="layout"
    onTabChange={navigate}
  />
</View>
```

### Start New Layout Picker
```tsx
<Modal visible={isOpen}>
  <AppTopBar 
    title="Start New Layout"
    rightIcon={<X />}
    onRightIconPress={close}
  />
  
  <TextInput
    placeholder="Search bend type..."
    style={styles.search}
  />
  
  <FlatList
    data={bendTypes}
    renderItem={({ item }) => (
      <SearchPickerRow
        title={item.name}
        description={item.description}
        family={item.family}
        status={item.status}
        onPress={() => select(item)}
      />
    )}
  />
</Modal>
```

---

## React Native vs Web Differences

### Component Mapping

| Web | React Native |
|-----|-------------|
| `<div>` | `<View>` |
| `<button>` | `<Pressable>` |
| `<input>` | `<TextInput>` |
| `<span>`, `<p>` | `<Text>` |
| CSS classes | StyleSheet |

### Style Conversion

Web (Tailwind):
```tsx
<div className="flex items-center gap-2 p-4">
```

React Native:
```tsx
<View style={styles.container}>
// styles.container: { 
//   flexDirection: 'row',
//   alignItems: 'center', 
//   gap: 8,
//   padding: 16 
// }
```

### Touch Handling

Web:
```tsx
<button onClick={handlePress}>
```

React Native:
```tsx
<Pressable onPress={handlePress}>
```

---

## Accessibility

### Labels
Every interactive element needs an accessible label:
```tsx
<Pressable 
  accessibilityLabel="Edit setup"
  accessibilityRole="button"
>
```

### Screen Readers
Use semantic roles:
- `button` - Pressable actions
- `header` - Section headers
- `text` - Static text
- `search` - Search inputs

### Focus Management
- Proper tab order
- Focus indicators
- Keyboard navigation (desktop)

---

## Performance Optimization

### Image Optimization
- Use correct image sizes
- Lazy load images
- Cache network images

### List Performance
- Use `FlatList` for long lists
- Implement `getItemLayout`
- Add `keyExtractor`
- Optimize `renderItem`

### Animation Performance
- Use `useNativeDriver: true`
- Avoid animating layout
- Use `Animated` API
- Keep animations under 60fps

---

## Testing Guidelines

### Unit Tests
Test component logic:
- Props handling
- State changes
- Event handlers
- Edge cases

### Visual Tests
Test appearance:
- Different screen sizes
- Dark/light themes
- Text scaling
- Touch targets

### Integration Tests
Test user flows:
- Navigation
- Form submission
- Multi-step processes
- Error states

---

## Storybook Setup (Optional)

For component development and documentation:

```bash
npx sb init --type react_native
```

Create stories for each component:
```tsx
// SetupChip.stories.tsx
export default {
  title: 'Components/SetupChip',
  component: SetupChip,
};

export const Default = () => (
  <SetupChip
    mainText="EMT 3/4&quot; • 30°"
    subText="Tap to change"
    onEdit={() => {}}
  />
);
```

---

## Next Steps

1. **Implement in React Native**: Port web components to React Native
2. **Create Storybook**: Document all variants
3. **Write tests**: Unit and visual regression
4. **Build design tokens**: Centralized colors, spacing, typography
5. **Create theme provider**: Support light/dark modes
6. **Add animations**: Smooth transitions and feedback
7. **Optimize performance**: Profile and improve render times
8. **Document patterns**: Common compositions and layouts

---

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Gorhom Bottom Sheet](https://gorhom.github.io/react-native-bottom-sheet/)
- [Lucide React Native](https://lucide.dev/)
- [NativeWind](https://www.nativewind.dev/) (Tailwind for RN)

---

**Last Updated**: 2026-05-25  
**Component Count**: 11 core components  
**Status**: Ready for React Native implementation
