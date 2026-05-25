# Bend Pro - Conduit Layout Assistant

A minimal, field-ready mobile app for electricians to calculate conduit bending marks quickly and accurately.

**Version**: 1.0.0-beta  
**Status**: ✅ Ready for Developer Handoff  
**Date**: 2026-05-25

---

## 🚀 Quick Start for Developers

**New to this project?** Start here:

1. **[HANDOFF_SUMMARY.md](./HANDOFF_SUMMARY.md)** ← Start here! (5 min)
2. **[DEVELOPER_HANDOFF.md](./DEVELOPER_HANDOFF.md)** ← Complete implementation guide (30 min)
3. Explore feature docs: [OFFSET_WORKBENCH.md](./OFFSET_WORKBENCH.md), [GUIDED_MODE.md](./GUIDED_MODE.md), etc.

**Everything you need** to implement Bend Pro in React Native + Expo is documented.

---

## Overview

Bend Pro is designed as a **fast field tool**, not a generic calculator dashboard. The interface prioritizes speed, clarity, and focus—helping electricians open the app, enter a measurement, get marking distances, and bend.

**Core workflow**: Measure → Mark → Bend → Check

## Project Status

**Current**: Web prototype demonstrating mobile UI/UX  
**Target**: React Native + Expo mobile app for iOS and Android

## Key Features

### 🎯 Field Mode (Default)
- Clean starting point for quick layouts
- Continue last active layout
- Start new layout with single tap
- Compact bend family tiles (Offset, 90s, Saddles, Large/Advanced)

### 🔧 Main Calculator (Workbench)
- Large touch-friendly inputs
- Real-time calculation
- Color-coded results (mark orange for physical marks, blue for calculated values)
- Clean interface with settings accessible via bottom sheet

### 🔨 Bender Management
- Current default bender selection
- Searchable bender database
- Support for generic and manufacturer-specific benders
- Custom bender creation (future)

### 📚 Learning & Reference (Guide Tab)
- Guided mode for students and apprentices
- Formula reference
- Common mistakes and tips
- Bend type explanations

### ⚙️ Smart Defaults (Settings)
- Default unit system (imperial/metric)
- Default rounding (1/16", 1/8", decimal)
- Default conduit type (EMT, PVC, Rigid)
- Default conduit size (½", ¾", 1", etc.)
- Default bender selection
- Interface preferences

## Design Philosophy

### What Makes It Different

**NOT a dashboard**: No cards, widgets, or busy layouts  
**NOT a SaaS app**: No heavy chrome, unnecessary decoration, or marketing fluff  
**NOT complicated**: Settings and complexity hidden until needed

**IS a field tool**: Fast, minimal, practical, high-contrast  
**IS thumb-friendly**: Bottom navigation, large targets, one-handed use  
**IS focused**: Only show what's needed right now

### Design Principles

✓ Less UI, more useful action  
✓ Large readable numbers (outdoor use)  
✓ High contrast dark theme  
✓ Progressive disclosure (hide complexity)  
✓ Touch targets ≥48px  
✓ Single column layouts  
✓ Semantic color usage  

✗ No tiny controls  
✗ No desktop-style layouts  
✗ No over-designed animations  
✗ No crowded dashboards  
✗ No settings on main screen  

## Technical Stack

### Current (Web Prototype)
- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS v4
- **Build**: Vite
- **Icons**: Lucide React
- **State**: React hooks + Context

### Target (React Native)
- **Framework**: React Native + Expo
- **Navigation**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind for RN)
- **Icons**: Lucide React Native
- **State**: Context/Zustand
- **Persistence**: AsyncStorage
- **Bottom Sheet**: @gorhom/bottom-sheet

## Architecture

### Navigation Structure

```
Bottom Tabs (4 tabs):
├── Layout (default) - Continue or start layouts
├── Benders - Manage bender database
├── Guide - Learning content
└── Settings - Default preferences

Modals:
├── Workbench - Main calculator screen
└── Edit Setup - Bottom sheet for quick settings
```

### Component Library

**Navigation**
- AppTopBar
- BottomNav

**Layout Screen**
- ContinueLayoutCard
- StartNewLayoutRow
- BendFamilyTile

**Workbench**
- SetupChip
- InputSection
- ResultDisplay

**UI Primitives**
- Button (5 variants)
- Input
- Card
- Badge
- BottomSheet

## Color System

### Semantic Usage

| Color | Usage | Hex |
|-------|-------|-----|
| **Electric Blue** | Actions, calculated results, active states | `#35BDF8` |
| **Mark Orange** | Physical pipe marks, marking indicators | `#FF7A2F` |
| **Warning Yellow** | Beta labels, warnings, common angle hints | `#FFD22E` |
| **Success Green** | Confirmations, completed states | `#4ADE80` |
| **Error Red** | Errors, destructive actions | `#EF4444` |

### Palette

```
Background: #05070B    Screen: #080C13
Surface: #101722       Surface 2: #151E2B
Border: #263142
Text: #F6F8FB          Muted: #8F9BAD
```

## File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navigation/
│   │   │   ├── AppTopBar.tsx
│   │   │   └── BottomNav.tsx
│   │   ├── layout/
│   │   │   ├── ContinueLayoutCard.tsx
│   │   │   ├── StartNewLayoutRow.tsx
│   │   │   └── BendFamilyTile.tsx
│   │   ├── workbench/
│   │   │   ├── SetupChip.tsx
│   │   │   └── ResultDisplay.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── EditSetupSheet.tsx
│   ├── screens/
│   │   ├── LayoutScreen.tsx
│   │   ├── BendersScreen.tsx
│   │   ├── GuideScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── WorkbenchScreen.tsx
│   ├── utils.ts
│   └── App.tsx
└── styles/
    ├── theme.css
    └── fonts.css
```

## 📚 Complete Documentation

### Implementation Guides
- **[DEVELOPER_HANDOFF.md](./DEVELOPER_HANDOFF.md)** - Complete handoff with tokens, components, screens
- **[HANDOFF_SUMMARY.md](./HANDOFF_SUMMARY.md)** - Quick reference and overview
- **[REACT_NATIVE_MIGRATION.md](./REACT_NATIVE_MIGRATION.md)** - Web to React Native guide

### Architecture
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - App structure and navigation
- **[COMPONENTS.md](./COMPONENTS.md)** - 11 core components with props

### Design System
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Colors, typography, spacing, guidelines

### Feature Documentation
- **[OFFSET_WORKBENCH.md](./OFFSET_WORKBENCH.md)** - Offset calculator design
- **[EDIT_SETUP_SHEET.md](./EDIT_SETUP_SHEET.md)** - Setup bottom sheet
- **[START_NEW_LAYOUT_PICKER.md](./START_NEW_LAYOUT_PICKER.md)** - Layout picker
- **[GUIDED_MODE.md](./GUIDED_MODE.md)** - Educational mode

## 🎨 Design Prototype

### Web Prototype (Current)

This repository contains a **web-based prototype** to demonstrate the mobile UI/UX. The prototype is built with React + Tailwind and shows all screens, components, and interactions.

```bash
# View the prototype
pnpm install
# Dev server is running - open preview
```

### Component Showcase

Click the **palette icon** (top-right) to view:
- Typography scale
- Color palette  
- All button variants
- Input examples
- Badge variants
- Result displays
- Card examples
- Icon usage
- MarkingGuide (hero component)
- Guided Mode demo
- Edit Setup demo
- Layout Picker demo

### Navigation Demo

The prototype demonstrates the full navigation flow:
1. **Layout Tab** (default) - Continue layout or choose bend family
2. **Benders Tab** - Manage bender database
3. **Guide Tab** - Learning content and reference
4. **Settings Tab** - Default preferences
5. **Workbench** (modal) - Main calculator screen
6. **Edit Setup** (bottom sheet) - Quick settings access

## Key Product Rules

1. **Layout tab is not a dashboard** - It's a clean starting point
2. **Main calculator screen stays clean** - Settings via bottom sheet only
3. **Progressive disclosure** - Hide complexity until needed
4. **Field Mode is default** - Fast workflow for experienced users
5. **Guided Mode available** - Step-by-step for students
6. **High contrast** - Designed for outdoor use
7. **Large touch targets** - Minimum 48px for field gloves

## Future Enhancements

- [ ] Custom bender database with user-defined deductions
- [ ] Photo/camera for pipe measurements
- [ ] Save and share layouts
- [ ] Team/instructor features
- [ ] Export layouts to PDF
- [ ] Offline mode (already available in React Native)
- [ ] Advanced bend types (kicks, rolling offsets, etc.)
- [ ] Unit conversion helpers
- [ ] Imperial/metric dual display

## Target Users

### Primary: Field Electricians
- Need fast, accurate calculations
- Work in bright outdoor conditions
- Often wearing gloves
- Want minimal taps to result

### Secondary: Apprentices/Students
- Learning conduit bending fundamentals
- Need explanations and formulas
- Benefit from guided mode
- Want reference material

### Tertiary: Instructors
- Teaching bending techniques
- Need to demonstrate concepts
- Want to share layouts with students

## Success Metrics

**Speed**: Open → result in <10 seconds  
**Accuracy**: Calculations match NEC standards  
**Usability**: 48px+ touch targets, high contrast  
**Learnability**: Guided mode for new users  
**Reliability**: Offline-capable, no dependencies on external APIs  

## License

[To be determined]

## Contact

[To be determined]

---

**Design Philosophy**: Less UI, more useful action.
