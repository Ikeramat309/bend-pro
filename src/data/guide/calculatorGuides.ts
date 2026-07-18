import { Routes } from '@/navigation';

import type { CalculatorGuide, GuideCalculatorId } from './guideTypes';

export const CALCULATOR_GUIDES: CalculatorGuide[] = [
  {
    id: 'offset',
    title: 'Basic Offset',
    family: 'Offset',
    summary:
      'Shift conduit sideways with two bends while staying parallel to the original run. The calculator finds distance between bends and shrink from offset height and bend angle.',
    calculatorRoute: Routes.offset,
    formula: {
      title: 'Formula',
      mono: true,
      lines: [
        'Distance Between Bends = Offset Height × Multiplier',
        'Shrink = Offset Height × Shrink per inch',
        'Mark 2 = Mark 1 + Distance Between Bends',
      ],
    },
    steps: {
      title: 'Field steps',
      ordered: true,
      lines: [
        'Measure offset height — how far the pipe must rise to clear the obstruction.',
        'Pick the bend angle your bender and the job allow (common: 30° or 45°).',
        'Add shrink to your run measurement before you mark — shrink is length the offset eats.',
        'Mark the first bend (Mark 1), then measure distance between bends for the second mark.',
        'Bend both marks to the chosen angle and check the offset clears.',
      ],
    },
    mistakes: {
      title: 'Common mistakes',
      lines: [
        'Forgetting to add shrink before marking the run — the finished offset will come up short.',
        'Using the wrong angle multiplier from memory instead of the angle you actually bent.',
        'Calling the first layout mark a “deduct mark” — that term is for stub 90 only.',
        'Assuming every bender matches the generic multiplier table; tap Multiplier or Shrink to override if your chart differs.',
      ],
    },
    example: {
      title: 'Worked example',
      lines: [
        '6" offset height at 30° (multiplier 2.0, shrink 1/4" per inch)',
        '→ Distance Between Bends: 12"',
        '→ Shrink: 1 1/2"',
      ],
    },
  },
  {
    id: 'stub90',
    title: 'Stub-Up 90',
    family: '90s',
    summary:
      'Find where to mark a vertical stub before bending a 90°. Stub length is the finished height; deduct is what the bender shoe consumes.',
    calculatorRoute: Routes.stub90,
    formula: {
      title: 'Formula',
      mono: true,
      lines: ['Deduct Mark = Stub Length − Deduct'],
    },
    steps: {
      title: 'Field steps',
      ordered: true,
      lines: [
        'Measure stub length — finished height to the back of the 90° bend.',
        'Confirm EMT size and bender profile in Edit Setup; deduct comes from the profile chart.',
        'Subtract deduct from stub length to get the deduct mark.',
        'Mark the pipe at the deduct mark and bend to 90°.',
        'Measure the leg run if you need horizontal layout beyond the bend.',
      ],
    },
    mistakes: {
      title: 'Common mistakes',
      lines: [
        'Marking at stub length instead of deduct mark — the stub will overshoot.',
        'Using a deduct for the wrong trade size or bender type.',
        'Calling the result “first mark” — on a stub 90 the result is Deduct Mark.',
        'Ignoring the trust-strip warning when the app falls back to a default deduct; measure your bender or set an override.',
      ],
    },
    example: {
      title: 'Worked example',
      lines: [
        '12" stub length, 1/2" EMT on a generic hand bender (5" deduct)',
        '→ Deduct Mark: 7"',
      ],
    },
  },
  {
    id: 'saddle3',
    title: '3-Point Saddle',
    family: 'Saddles',
    summary:
      'Route over an obstruction with three bends: a center bend toward the obstacle and two side bends back to level.',
    calculatorRoute: Routes.saddle3,
    formula: {
      title: 'Formula',
      mono: true,
      lines: [
        'Between Bends = Obstruction Height × Center-to-side multiplier',
        'Shrink = Obstruction Height × Shrink per inch',
        'Center Mark = Distance to Center + Shrink',
        'Side marks sit ± Between Bends from the center mark',
      ],
    },
    steps: {
      title: 'Field steps',
      ordered: true,
      lines: [
        'Measure obstruction height — clearance needed over the obstacle.',
        'Measure distance to the center of the obstruction along the conduit run.',
        'Add shrink to the center measurement before marking the center bend.',
        'Mark the center bend, then mark each side bend at ± Between Bends.',
        'Bend center toward the obstacle, then side bends back to level using your angle preset.',
      ],
    },
    mistakes: {
      title: 'Common mistakes',
      lines: [
        'Skipping shrink on the center mark — the saddle will not peak high enough.',
        'Mixing up side angle and center angle from the preset table.',
        'Spacing side marks from the obstruction instead of from the center mark.',
        'Expecting manufacturer-specific shoe data — the angle table is a generic field reference.',
      ],
    },
    example: {
      title: 'Worked example',
      lines: [
        '2" obstruction, 22.5°/45° preset, distance to center 24"',
        '→ Between Bends: ~5.23"',
        '→ Shrink: 3/8"',
        '→ Center Mark: 24 3/8"',
      ],
    },
  },
  {
    id: 'saddle4',
    title: '4-Point Saddle',
    family: 'Saddles',
    summary:
      'Cross a wide obstruction with four bends forming a flat-topped plateau — two offsets back-to-back.',
    calculatorRoute: Routes.saddle4,
    formula: {
      title: 'Formula',
      mono: true,
      lines: [
        'Between Bends = Obstruction Height × Multiplier (each offset leg)',
        'Shrink (total) = 2 × (Obstruction Height × Shrink per inch)',
        'Center Mark = Distance to Center + one offset shrink',
        'Inner marks = Center ± (Saddle Width ÷ 2)',
        'Outer marks = Inner marks ± Between Bends',
      ],
    },
    steps: {
      title: 'Field steps',
      ordered: true,
      lines: [
        'Measure obstruction height and saddle width (the flat span across the top).',
        'Measure distance to the obstruction center along the run.',
        'Mark center, then inner (top) marks at half the saddle width each side.',
        'Mark outer bends beyond the inner marks by Between Bends.',
        'Bend all four marks to the same angle, checking the flat top clears the obstacle.',
      ],
    },
    mistakes: {
      title: 'Common mistakes',
      lines: [
        'Using 3-point saddle spacing on a wide obstacle — you need the flat top width.',
        'Adding total shrink twice to the center mark — only one offset shrink sits ahead of center.',
        'Uneven bend angles across the four bends — the calculator assumes one angle throughout.',
        'Measuring saddle width at the obstacle face instead of the flat span you need on the pipe.',
      ],
    },
    example: {
      title: 'Worked example',
      lines: [
        '2" obstruction, 4" saddle width, 22.5°, distance to center 30"',
        '→ Between Bends: 5.2"',
        '→ Total Shrink: 3/4"',
        '→ Center Mark: 30 3/8"',
      ],
    },
  },
  {
    id: 'segment',
    title: 'Segment Bend',
    family: 'Large / Advanced',
    summary:
      'Approximate a large-radius arc with evenly spaced small bends (“shots”). Useful when a hydraulic bender is not available.',
    calculatorRoute: Routes.segment,
    formula: {
      title: 'Formula',
      mono: true,
      lines: [
        'Bends N = round(Total Angle ÷ Degrees per Bend)',
        'Per Bend = Total Angle ÷ N',
        'Between Bends = (π ÷ 180) × Radius × Per Bend',
        'Bend Length = (π ÷ 180) × Radius × Total Angle',
      ],
    },
    steps: {
      title: 'Field steps',
      ordered: true,
      lines: [
        'Lay out radius and total angle the arc must follow.',
        'Pick a practical degrees-per-bend for your bender (often 10° or less).',
        'Mark shots spaced at Between Bends along the run; stagger marks half a space from ends.',
        'Bend each mark to Per Bend degrees, working sequentially along the pipe.',
        'Check the arc against the template or layout line as you go.',
      ],
    },
    mistakes: {
      title: 'Common mistakes',
      lines: [
        'Treating segment spacing like offset multiplier math — this is pure geometry on radius.',
        'Ignoring the shot-count adjustment warning when total angle does not divide evenly.',
        'Expecting spring-back compensation — the model is geometric only.',
        'Using shoe deduct on segment marks — radius layout does not use stub deduct.',
      ],
    },
    example: {
      title: 'Worked example',
      lines: [
        '30" radius, 90° total, 10° per bend',
        '→ 9 bends at 10°',
        '→ Between Bends: ~5 1/4"',
        '→ Bend Length: ~47 1/8"',
      ],
    },
  },
  {
    id: 'rolling',
    title: 'Rolling Offset',
    family: 'Offset',
    summary:
      'Offset in two planes — height and roll (advance). The app combines them into a true offset, then applies standard offset spacing.',
    calculatorRoute: Routes.rolling,
    formula: {
      title: 'Formula',
      mono: true,
      lines: [
        'True Offset = √(Offset Height² + Offset Roll²)',
        'Distance Between Bends = True Offset × Multiplier',
        'Shrink = True Offset × Shrink per inch',
      ],
    },
    steps: {
      title: 'Field steps',
      ordered: true,
      lines: [
        'Measure offset height (vertical rise) and offset roll (horizontal advance in the rolling plane).',
        'Pick bend angle and note distance between bends from the calculator.',
        'Orient the bender head for the rolling plane before bending — the app does not rotate the head for you.',
        'Add shrink to your run, mark both bends, and verify clearance in both directions.',
      ],
    },
    mistakes: {
      title: 'Common mistakes',
      lines: [
        'Using only offset height and ignoring roll — spacing will be too tight.',
        'Bending both marks in the same plane as a basic offset without rolling the bender.',
        'Forgetting that multiplier and shrink overrides are shared with the basic Offset calculator.',
        'Confusing offset roll with saddle width — roll is the horizontal component of a rolling offset.',
      ],
    },
    example: {
      title: 'Worked example',
      lines: [
        '6" offset height, 8" offset roll, 30° bend',
        '→ Distance Between Bends: 20"',
        '→ Shrink: 2 1/2"',
      ],
    },
  },
  {
    id: 'kick90',
    title: 'Kick 90',
    family: '90s',
    summary:
      'Lay out a small-angle kick beside a 90° bend. Spacing from the 90° mark to the kick mark uses kick rise and the standard offset multiplier table.',
    calculatorRoute: Routes.kick90,
    formula: {
      title: 'Formula',
      mono: true,
      lines: [
        'Distance Between Bends = Kick Rise × Multiplier',
        'Shrink = Kick Rise × Shrink per inch',
        'Mark 2 = Mark 1 + Distance Between Bends',
      ],
    },
    steps: {
      title: 'Field steps',
      ordered: true,
      lines: [
        'Measure kick rise — how far the leg must move sideways or up from the 90° run.',
        'Pick the kick angle your bender allows (common: 30° or 45°).',
        'Bend the 90° first, or know where its mark will land on the run.',
        'Add shrink to your run measurement before marking — shrink is length the kick eats.',
        'Mark the kick from the 90° bend mark at distance between bends; bend and check the leg clears.',
      ],
    },
    mistakes: {
      title: 'Common mistakes',
      lines: [
        'Forgetting shrink on the run before marking the kick — the finished leg will come up short.',
        'Using the wrong angle multiplier from memory instead of the angle you actually bent.',
        'Kicking on the wrong plane or rotation — the kick must move the run in the direction you measured.',
      ],
    },
    example: {
      title: 'Worked example',
      lines: [
        '6" kick rise at 30° (multiplier 2.0, shrink 1/4" per inch)',
        '→ Distance Between Bends: 12"',
        '→ Shrink: 1 1/2"',
      ],
    },
  },
  {
    id: 'matchingOffset',
    title: 'Matching Offset',
    family: 'Offset',
    summary:
      'Copy an existing two-bend offset by measuring either its straight-run center projection or its center-to-center distance along the conduit.',
    calculatorRoute: Routes.matchingOffset,
    formula: {
      title: 'Formula',
      mono: true,
      lines: [
        'Match Centers: Bend Angle = atan(Offset Height ÷ Adjacent)',
        'Match Bends: Bend Angle = asin(Offset Height ÷ Existing Center Distance)',
        'Shrink = Distance Between Bends − Adjacent',
        'Exact solved angle is never snapped to a nearby common angle',
      ],
    },
    steps: {
      title: 'Field steps',
      ordered: true,
      lines: [
        'Choose Match Centers when you know the straight-run projection between bend centers.',
        'Choose Match Bends when you can measure along the existing conduit from bend center to bend center.',
        'Enter the perpendicular offset height and the selected reference measurement.',
        'Transfer Centers Apart to the new conduit and mark both bend centers.',
        'If Angle Tool is shown, set the exact angle with a digital level or protractor; do not round to the nearby common angle.',
        'Use the nearby common-angle comparison in the result details only to understand how much the layout would change.',
        'Make two equal bends in opposite directions using a calibrated bend-center reference.',
      ],
    },
    mistakes: {
      title: 'Common mistakes',
      lines: [
        'Measuring to the start of a bend instead of its center.',
        'Entering the along-conduit distance in Match Centers — that mode expects the straight-run projection.',
        'Switching methods and assuming the second field keeps the same meaning.',
        'Rounding an exact angle to a familiar bender angle; that changes the run and no longer matches the reference.',
        'Treating the selected bender as a shoe-radius correction; this calculator uses centerline geometry only.',
      ],
    },
    example: {
      title: 'Worked example',
      lines: [
        'Match Bends: 6" height and 12" existing center distance',
        '→ Bend Angle: 30°',
        '→ Adjacent: about 10.392"',
        '→ Shrink: about 1.608" before display rounding',
      ],
    },
  },
  {
    id: 'parallelOffset',
    title: 'Parallel Offsets',
    family: 'Offset',
    summary:
      'Keep a rack of equal offsets parallel by shifting both bend marks on each successive conduit by the same half-angle adjustment.',
    calculatorRoute: Routes.parallelOffset,
    formula: {
      title: 'Formula',
      mono: true,
      lines: [
        'Shift per Conduit = C-C Spacing × tan(Bend Angle ÷ 2)',
        'Distance Between Bends = Offset Height ÷ sin(Bend Angle)',
        'Pipe n Shift = Shift per Conduit × (n − 1)',
      ],
    },
    steps: {
      title: 'Field steps',
      ordered: true,
      lines: [
        'Measure center-to-center spacing perpendicular to the straight runs.',
        'Choose the same bend angle, conduit size, and shoe for the full rack.',
        'Use Simple Shift when you only need the per-conduit adjustment.',
        'Use Full Layout to add offset height, conduit count, direction, and an optional Pipe 1 Mark 1.',
        'Move both marks on each later conduit by its signed cumulative shift.',
      ],
    },
    mistakes: {
      title: 'Common mistakes',
      lines: [
        'Using edge-to-edge spacing instead of conduit center-to-center spacing.',
        'Moving only one mark — both marks shift together, so their spacing stays unchanged.',
        'Guessing toward or away from the free end; choose the direction that matches where all marks are measured from.',
        'Mixing conduit sizes, shoe radii, or bend angles in one calculated rack.',
      ],
    },
    example: {
      title: 'Worked example',
      lines: [
        '2" C-C spacing, 30°, four conduits, 6" offset height',
        '→ Shift per Conduit: about 0.536"',
        '→ Total Rack Shift: about 1.608"',
        '→ Distance Between Bends: 12"',
      ],
    },
  },
  {
    id: 'backToBack',
    title: 'Back-to-Back 90',
    family: '90s',
    summary:
      'Place two opposing 90° bends with a finished distance between their backs. An optional first stub adds its deduct mark.',
    calculatorRoute: Routes.backToBack,
    formula: {
      title: 'Field layout',
      mono: true,
      lines: [
        'Second 90 Mark = Back-to-Back Distance',
        'Measure it from the back of the formed first 90',
        'Optional First Deduct Mark = First Stub Length − Deduct',
      ],
    },
    steps: {
      title: 'Field steps',
      ordered: true,
      lines: [
        'Make the first 90. If entering First Stub Length, use its deduct mark first.',
        'Measure the finished back-to-back distance from the back of the formed first 90.',
        'Put the second mark on the conduit at that distance.',
        'Face the hook opposite the first bend and align the second mark with the bender star.',
        'Bend to 90° and check the distance between the parallel surfaces.',
      ],
    },
    mistakes: {
      title: 'Common mistakes',
      lines: [
        'Measuring the second mark from the conduit end instead of from the back of the formed first 90.',
        'Aligning the second mark with the arrow instead of the bender star.',
        'Facing both 90s the same way instead of opposing them.',
        'Using an unverified deduct for the optional first stub.',
      ],
    },
    example: {
      title: 'Worked example',
      lines: [
        '36" back-to-back distance, optional 12" first stub, 5" deduct',
        '→ First Deduct Mark: 7" from the starting end',
        '→ Second 90 Mark: 36" from the back of the formed first 90',
      ],
    },
  },
  {
    id: 'compound90',
    title: 'Compound 90',
    family: '90s',
    summary:
      'Split a 90° turn into two 45° bends so the diagonal clears a round obstruction, wall-aligned box, or square set on a corner.',
    calculatorRoute: Routes.compound90,
    formula: {
      title: 'Two-45 field table',
      mono: true,
      lines: [
        'Round: Centers Apart = Diameter × 2.4 + 2 × Clearance − 1/2 EMT OD',
        'Box flat to walls: Centers Apart = (Height + Width) × 1.414 + 2 × Clearance − 1/2 EMT OD',
        'Square on point: Centers Apart = Side × 3 + 2 × Clearance − 1/2 EMT OD',
        'Optional Second Mark = First Mark + Between Bends',
      ],
    },
    steps: {
      title: 'Field steps',
      ordered: true,
      lines: [
        'Choose how the obstruction sits: round at the corner, box flat to the walls, or square on point.',
        'Measure the requested outside dimension and enter any clearance needed on each side.',
        'Mark the two bend centers at the calculated spacing.',
        'Use the center-bend reference on the bender and make the first 45° bend.',
        'Keep both bends in the same plane and make the second 45° bend to complete the turn.',
        'Check the diagonal section clears the obstruction before installing the conduit.',
      ],
    },
    mistakes: {
      title: 'Common mistakes',
      lines: [
        'Measuring radius when the Round mode asks for diameter.',
        'Entering only one side of a rectangular obstruction.',
        'Using the square-on-point method for a box whose sides are flat to the walls.',
        'Adding total clearance instead of the clearance required on each side.',
        'Using arrow/start-of-bend marks when the layout is specified on bend centers.',
        'Treating the table as a bender-specific radius or springback correction.',
      ],
    },
    example: {
      title: 'Worked example',
      lines: [
        '7" round obstruction, two 45° bends',
        '1/2" EMT has a nominal 0.706" outside diameter',
        '→ Between Bends: 16.447" before display rounding',
        '→ With First Bend Mark at 20", Second Bend Mark is 36.447"',
      ],
    },
  },
  {
    id: 'multipleBends',
    title: 'Multiple Bends',
    family: 'Large / Advanced',
    summary:
      'Plan and check an ordered set of bend and cut marks on one conduit stick. It organizes supplied marks; it does not invent bend math.',
    calculatorRoute: Routes.multipleBends,
    formula: {
      title: 'Planner checks',
      mono: true,
      lines: [
        'Every Mark = absolute distance from the same start end',
        'Gap = Next Mark − Previous Mark',
        'Tail = Stick Length − Last Mark',
        'Total Bend = sum of supplied bend angles',
      ],
    },
    steps: {
      title: 'Field steps',
      ordered: true,
      lines: [
        'Enter the full conduit stick length.',
        'Add every bend or cut as an absolute mark from one chosen start end.',
        'For bend marks, enter the angle, up/down direction, and whether to flip first.',
        'Review the sorted field sequence, gaps, collisions, overflow, and total bend warning.',
        'Transfer the marks from the same start end and follow the displayed order.',
      ],
    },
    mistakes: {
      title: 'Common mistakes',
      lines: [
        'Mixing measurements from opposite ends of the conduit.',
        'Entering a relative gap as though it were an absolute mark.',
        'Expecting the planner to add deduct, take-up, gain, shrink, or shoe clearance.',
        'Ignoring the warning when total bend exceeds 360° between pull points.',
      ],
    },
    example: {
      title: 'Worked example',
      lines: [
        '120" stick with 30° bends at 24" and 36", then a cut at 96"',
        '→ Gaps: 12" between bends and 60" to the cut',
        '→ Tail after final mark: 24"',
        '→ Total Bend: 60°',
      ],
    },
  },
];

export const GUIDE_INTRO = {
  title: 'How to use this guide',
  body:
    'Each walkthrough covers formulas, field steps, and common mistakes for one calculator. Open Guide from a bend screen to jump straight to that calculator’s section. The pipe diagram and results stay on the calculator — learning lives here.',
};

export const GUIDE_BASICS = {
  title: 'Core concepts',
  lines: [
    'Mark — pencil line on the pipe where the bender shoe sits.',
    'Shrink — extra length to add before marking because the offset path is longer than a straight run.',
    'Deduct — length the bender shoe uses on a stub 90; subtract from stub length to find the deduct mark.',
    'Distance Between Bends — spacing between the two bends of an offset (not the same as shrink).',
  ],
};

export function getCalculatorGuide(id: string): CalculatorGuide | undefined {
  return CALCULATOR_GUIDES.find((guide) => guide.id === id);
}

export function isGuideCalculatorId(id: string): id is GuideCalculatorId {
  return CALCULATOR_GUIDES.some((guide) => guide.id === id);
}
