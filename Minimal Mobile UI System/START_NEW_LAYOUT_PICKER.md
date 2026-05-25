# Start New Layout Picker - Design Documentation

## Overview

The Start New Layout Picker is a command-menu-style interface for selecting which type of bend to calculate. It opens from the Layout tab when the user taps "Start new layout".

## Design Philosophy

**Command Menu Feel**: Fast, searchable, keyboard-friendly (on desktop), organized by family.

**Not a Dashboard**: Uses compact list items, not large cards. Keeps the interface clean even with future bend types marked as "Coming Soon".

**Progressive Disclosure**: Shows all bend types upfront (builds anticipation) but clearly marks what's available now vs. later.

## Modal Structure

### Full-Screen Modal (Not Bottom Sheet)

**Why full-screen?**
- Better for search interactions
- More vertical space for scrolling
- Consistent with command palette patterns
- Clear focus on task (choosing a bend type)

### Header
```
┌─────────────────────────────────┐
│ Start New Layout           [X]  │
└─────────────────────────────────┘
```
- Title: "Start New Layout"
- Right: Close button (X)
- Fixed at top (doesn't scroll)

### Search Bar
```
┌─────────────────────────────────┐
│ 🔍 Search bend type, example:   │
│    offset, saddle, 90            │
└─────────────────────────────────┘
```
- Prominent search field
- Placeholder text gives examples
- Filters results in real-time
- Searches: name, family, description
- Fixed below header (doesn't scroll)

## Bend Type Organization

### Grouped by Family

**Family 1: Offset**
```
Offset
├─ Basic Offset
│  Clear obstruction. Stay parallel.        →
├─ Parallel Offset                Coming Soon
├─ Rolling Offset                 Coming Soon
└─ Box Offset                     Coming Soon
```

**Family 2: 90s**
```
90s
├─ Stub-Up 90                     Coming Soon
│  Vertical rise from surface.
├─ Back-to-Back 90                Coming Soon
└─ Kick 90                        Coming Soon
```

**Family 3: Saddles**
```
Saddles
├─ 3-Point Saddle                 Coming Soon
│  Route over obstacle.
└─ 4-Point Saddle                 Coming Soon
```

**Family 4: Large / Advanced**
```
Large / Advanced
├─ Segment Bend                   Coming Soon
└─ Hydraulic Layout               Coming Soon
```

### List Item Design

**Active Item** (Basic Offset):
```
┌─────────────────────────────────┐
│ Basic Offset                  → │
│ Clear obstruction. Stay parallel│
└─────────────────────────────────┘
```
- Tappable
- Hover state (desktop)
- Chevron (→) indicates action
- Optional description in smaller text

**Coming Soon Item**:
```
┌─────────────────────────────────┐
│ Parallel Offset  [Coming Soon]  │
└─────────────────────────────────┘
```
- Grayed out (50% opacity)
- Small yellow badge: "Coming Soon"
- Not tappable (disabled)
- No chevron

**Key Design Decision**: Keep "Coming Soon" items compact
- Small badge (not large banner)
- No huge disabled cards
- No apologetic messaging
- Just shows what's being built
- Maintains professional, confident feel

## Interaction Flow

### 1. Search
```
User types: "saddle"

Results:
Saddles
├─ 3-Point Saddle  [Coming Soon]
└─ 4-Point Saddle  [Coming Soon]
```

Empty state:
```
No bend types found matching "xyz"
Try a different search term
```

### 2. Selection
```
User taps: Basic Offset
Action:   Opens Offset Workbench
```

### 3. Close
- Tap X button
- Tap device back button (Android)
- No backdrop to tap (full-screen modal)

## Component Structure

### BendTypeItem Component
```typescript
interface BendTypeItemProps {
  name: string;
  description?: string;
  isActive: boolean;
  onClick?: () => void;
}
```

**Styling**:
- Active: White text, hover bg, chevron, cursor pointer
- Inactive: 50% opacity, small badge, no hover, disabled

### StartNewLayoutPicker Component
```typescript
interface StartNewLayoutPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bendTypeId: string) => void;
}
```

### Bend Type Data
```typescript
interface BendType {
  id: string;
  name: string;
  description?: string;
  family: string;
  isActive: boolean;
}
```

## Bend Type Catalog

### Currently Active
- ✅ **Basic Offset** - Only active bend type

### Coming Soon (Phase 1)
- **Stub-Up 90** - Vertical rise
- **3-Point Saddle** - Route over obstacle

### Coming Soon (Phase 2)
- Parallel Offset
- Rolling Offset
- Box Offset
- Back-to-Back 90
- Kick 90
- 4-Point Saddle

### Coming Soon (Phase 3)
- Segment Bend
- Hydraulic Layout

## Search Behavior

### What Gets Searched
1. Bend type name: "Basic Offset"
2. Family name: "Offset", "90s", "Saddles"
3. Description: "Clear obstruction", "Stay parallel"

### Search Examples
- "offset" → Shows all Offset family items
- "90" → Shows all 90s family items
- "saddle" → Shows 3-Point and 4-Point Saddle
- "parallel" → Shows Parallel Offset
- "clear" → Shows Basic Offset (matches description)

### Case Insensitive
- "OFFSET" = "offset" = "Offset"

## Visual Hierarchy

1. **Search field** - Highest priority (auto-focus optional)
2. **Family headers** - Group identifiers
3. **Active bend types** - Primary action items
4. **Coming soon items** - Secondary (muted)

## Layout Specifications

### Spacing
- Header padding: 16px (1rem)
- Search padding: 16px (1rem)
- Family header: 12px (0.75rem) vertical, 16px horizontal
- List item: 16px (1rem) all sides
- Between families: 0px (border only)

### Typography
- Title: 18px (text-lg)
- Family header: 14px (text-sm), muted
- Bend name: 16px (text-base)
- Description: 14px (text-sm), muted
- Badge: 12px (text-xs)

### Colors
- Badge: Warning yellow background, dark text
- Inactive: 50% opacity
- Hover: Surface-2 background

## State Management

```typescript
// Local state
const [searchQuery, setSearchQuery] = useState("");

// Filtered results
const filteredTypes = searchQuery
  ? bendTypes.filter(type => 
      type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.family.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : bendTypes;

// Grouped by family
const groupedTypes = families.map(family => ({
  family,
  types: filteredTypes.filter(type => type.family === family)
}));
```

## Accessibility

- Semantic HTML (header, main, button)
- Focus management
- Keyboard navigation (up/down arrows)
- Screen reader labels
- Disabled state clearly communicated

## Mobile Considerations

### iOS
- Respects safe areas
- Swipe down to dismiss (optional)
- Search activates keyboard

### Android
- Back button closes modal
- Respects navigation bar
- Search activates keyboard

## Desktop Enhancements

### Keyboard Shortcuts
- `/` - Focus search
- `↓` / `↑` - Navigate items
- `Enter` - Select focused item
- `Esc` - Close modal

### Hover States
- Active items show background on hover
- Cursor changes to pointer

## Future Enhancements

- [ ] Recently used bend types at top
- [ ] Favorite/pin bend types
- [ ] Custom bend type creation
- [ ] Bend type categories (residential, commercial, industrial)
- [ ] Tutorial videos linked from items
- [ ] Keyboard navigation
- [ ] Voice search (mobile)
- [ ] QR code scan for bend type (from manual)

## Design Validation

✅ **Fast**: Single tap or search to find bend type  
✅ **Organized**: Grouped by logical families  
✅ **Searchable**: Real-time filtering  
✅ **Compact**: List items, not huge cards  
✅ **Honest**: Coming Soon items visible but not prominent  
✅ **Professional**: Clean, confident interface  
✅ **Mobile-optimized**: Full-screen modal, touch-friendly  

## Why Not Bottom Sheet?

Bottom sheet would be better for:
- Quick selections from small set
- Contextual actions
- Supplementary content

Full-screen modal is better here because:
- ✅ Search interaction needs focus
- ✅ Many items to scroll through
- ✅ Command palette pattern
- ✅ Clear task separation
- ✅ Future expansion (more bend types)

## Testing Scenarios

1. **Quick select**: Open → tap Basic Offset → opens workbench
2. **Search active**: Type "offset" → see filtered results
3. **Search inactive**: Type "saddle" → see coming soon items
4. **Empty search**: Type "xyz" → see empty state
5. **Clear search**: Type → clear → see all results
6. **Close actions**: X button, device back button
7. **Disabled tap**: Tap coming soon item → no action
8. **Family grouping**: Scroll → see organized families
9. **Long list**: Add more types → scrollable

## Anti-Patterns Avoided

❌ Large disabled cards (too much visual weight)  
❌ Apologetic messaging ("Sorry, not available yet")  
❌ Hidden coming soon items (users want to know what's coming)  
❌ Cluttered layout (each item is clean and compact)  
❌ Vague labels (clear family names and descriptions)  
❌ Bottom sheet (search needs full screen)  

This picker sets the tone for Bend Pro: organized, professional, and thoughtfully designed for electricians.
