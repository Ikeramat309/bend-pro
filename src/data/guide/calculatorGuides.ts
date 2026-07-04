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
