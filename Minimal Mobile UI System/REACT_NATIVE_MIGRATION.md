# React Native Migration Guide

This document outlines how to migrate the Bend Pro web prototype to React Native + Expo.

## Package Replacements

### Navigation
```bash
# Install Expo Router
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

**Migration**:
- Current: React components with state-based navigation
- Target: File-based routing in `app/(tabs)/` directory
- Bottom nav becomes `<Tabs>` component from Expo Router

### Styling
```bash
# Install NativeWind (Tailwind for React Native)
npm install nativewind
npm install --save-dev tailwindcss
```

**Migration**:
- Keep same Tailwind classes
- Add `className` to `View`, `Text`, `Pressable` components
- Update `tailwind.config.js` for React Native

### UI Components

| Web Component | React Native Equivalent | Notes |
|--------------|-------------------------|-------|
| `<div>` | `<View>` | Direct replacement |
| `<button>` | `<Pressable>` | Add `onPress` instead of `onClick` |
| `<input>` | `<TextInput>` | Different props API |
| `<span>`, `<p>`, `<h1>` | `<Text>` | All text must be in `<Text>` |
| CSS animations | `Animated` API or Reanimated | Use `react-native-reanimated` |

### Bottom Sheet
```bash
# Install bottom sheet library
npm install @gorhom/bottom-sheet@^4
npm install react-native-reanimated react-native-gesture-handler
```

**Migration**:
- Replace custom `EditSetupSheet` with `<BottomSheet>` from Gorhom
- Use snap points: `[200, 400, '90%']`
- Add gesture handler wrapper

## Component Migration Examples

### Button Component

**Before (Web)**:
```tsx
<button
  className="bg-primary text-primary-foreground hover:bg-primary/90"
  onClick={handlePress}
>
  Calculate
</button>
```

**After (React Native)**:
```tsx
import { Pressable, Text } from 'react-native';

<Pressable
  className="bg-primary px-6 py-3 rounded-md active:opacity-90"
  onPress={handlePress}
>
  <Text className="text-primary-foreground font-medium">
    Calculate
  </Text>
</Pressable>
```

### Input Component

**Before (Web)**:
```tsx
<input
  type="number"
  className="h-16 w-full rounded-lg border border-input"
  value={measurement}
  onChange={(e) => setMeasurement(e.target.value)}
/>
```

**After (React Native)**:
```tsx
import { TextInput } from 'react-native';

<TextInput
  className="h-16 w-full rounded-lg border border-input px-4"
  keyboardType="numeric"
  value={measurement}
  onChangeText={setMeasurement}
  placeholder="0"
/>
```

### Card Component

**Before (Web)**:
```tsx
<div className="rounded-lg border border-border bg-card p-4">
  <h3 className="text-base text-foreground">Title</h3>
  <p className="text-sm text-muted-foreground">Content</p>
</div>
```

**After (React Native)**:
```tsx
import { View, Text } from 'react-native';

<View className="rounded-lg border border-border bg-card p-4">
  <Text className="text-base text-foreground font-medium">Title</Text>
  <Text className="text-sm text-muted-foreground">Content</Text>
</View>
```

## Navigation Setup

### File Structure

```
app/
├── _layout.tsx                 # Root layout
├── (tabs)/
│   ├── _layout.tsx            # Tab layout
│   ├── index.tsx              # Layout tab (default)
│   ├── benders.tsx            # Benders tab
│   ├── guide.tsx              # Guide tab
│   └── settings.tsx           # Settings tab
└── workbench.tsx              # Modal screen
```

### Tab Layout (`app/(tabs)/_layout.tsx`)

```tsx
import { Tabs } from 'expo-router';
import { Layers, Wrench, GraduationCap, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#080C13',
          borderTopColor: '#263142',
        },
        tabBarActiveTintColor: '#35BDF8',
        tabBarInactiveTintColor: '#8F9BAD',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Layout',
          tabBarIcon: ({ color, size }) => (
            <Layers size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="benders"
        options={{
          title: 'Benders',
          tabBarIcon: ({ color, size }) => (
            <Wrench size={size} color={color} />
          ),
        }}
      />
      {/* ... other tabs */}
    </Tabs>
  );
}
```

### Modal Navigation

```tsx
// Open modal from Layout tab
import { router } from 'expo-router';

<Button onPress={() => router.push('/workbench')}>
  Open Workbench
</Button>

// In app/workbench.tsx
export default function WorkbenchScreen() {
  return (
    <View className="flex-1 bg-background">
      {/* Workbench content */}
    </View>
  );
}
```

## Icons

Replace Lucide React with Lucide React Native:

```bash
npm install lucide-react-native
```

**Before**:
```tsx
import { Circle, Menu } from 'lucide-react';
```

**After**:
```tsx
import { Circle, Menu } from 'lucide-react-native';
```

## Styling Considerations

### Safe Area

Always wrap screens in `<SafeAreaView>`:

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView className="flex-1 bg-background">
  {/* Content */}
</SafeAreaView>
```

### ScrollView

Replace overflow containers with `<ScrollView>`:

```tsx
import { ScrollView } from 'react-native';

<ScrollView className="flex-1 px-4 py-6">
  {/* Scrollable content */}
</ScrollView>
```

### Keyboard Handling

Use `KeyboardAvoidingView` for input screens:

```tsx
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  className="flex-1"
>
  {/* Input fields */}
</KeyboardAvoidingView>
```

## Platform-Specific Code

Use `Platform.select()` for platform differences:

```tsx
import { Platform } from 'react-native';

const buttonHeight = Platform.select({
  ios: 48,
  android: 52,
});
```

## State Management

Current prototype uses local state. For production, consider:

```bash
# Option 1: Zustand (recommended for simplicity)
npm install zustand

# Option 2: React Context (already using)
# No additional package needed

# Option 3: Redux Toolkit (for complex apps)
npm install @reduxjs/toolkit react-redux
```

## Persistence

Replace browser localStorage with AsyncStorage:

```bash
npx expo install @react-native-async-storage/async-storage
```

**Before (Web)**:
```tsx
localStorage.setItem('bendSetup', JSON.stringify(setup));
const setup = JSON.parse(localStorage.getItem('bendSetup') || '{}');
```

**After (React Native)**:
```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('bendSetup', JSON.stringify(setup));
const setup = JSON.parse(await AsyncStorage.getItem('bendSetup') || '{}');
```

## Gestures

For swipe gestures and advanced interactions:

```bash
npm install react-native-gesture-handler react-native-reanimated
```

Example: Swipeable bottom sheet, swipe-to-delete, etc.

## Testing on Device

```bash
# iOS Simulator
npx expo run:ios

# Android Emulator
npx expo run:android

# Physical device via Expo Go
npx expo start
# Scan QR code with Expo Go app
```

## Build for Production

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## Key Differences to Remember

1. **All text must be in `<Text>` components** - You can't have raw text in `<View>`
2. **No CSS hover states** - Use `Pressable` with state-based styles
3. **Different event handlers** - `onClick` → `onPress`, `onChange` → `onChangeText`
4. **No `div` or `span`** - Everything is `<View>` or `<Text>`
5. **Flexbox by default** - All `<View>` components use flexbox
6. **StatusBar management** - Use `expo-status-bar` for bar styling
7. **Safe areas matter** - Always consider notches and system UI
8. **Keyboard avoidance** - Plan for virtual keyboard overlay

## Component Portability

The current prototype is designed to be easily portable:

✓ Uses Tailwind classes (NativeWind compatible)
✓ Component-based architecture
✓ Separation of concerns (UI vs. logic)
✓ Minimal browser-specific APIs
✓ Touch-friendly sizing (48px+ targets)

Main changes needed:
- Swap HTML elements for React Native components
- Update event handlers
- Wrap screens in SafeAreaView
- Replace bottom sheet implementation
- Update navigation to Expo Router

## Timeline Estimate

For an experienced React Native developer:

- Basic setup & navigation: 1-2 days
- Component migration: 3-5 days
- Bottom sheet & modals: 1 day
- Testing & polish: 2-3 days
- **Total: ~1-2 weeks**

## Resources

- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Gorhom Bottom Sheet](https://gorhom.github.io/react-native-bottom-sheet/)
