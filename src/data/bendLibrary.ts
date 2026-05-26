/**
 * FILE: src/data/bendLibrary.ts
 *
 * PURPOSE:
 * Shared bend-library metadata for navigation and quick switching.
 * This is UI/navigation data only — no calculator logic lives here.
 */

export type BendStatus = 'active' | 'coming-soon';

export type BendLibraryItem = {
  title: string;
  description?: string;
  status: BendStatus;
};

export type BendFamily = {
  title: string;
  items: BendLibraryItem[];
};

export const BEND_FAMILIES: BendFamily[] = [
  {
    title: 'Offset',
    items: [
      {
        title: 'Basic Offset',
        description: 'Clear obstruction. Stay parallel.',
        status: 'active',
      },
      { title: 'Parallel Offset', status: 'coming-soon' },
      { title: 'Rolling Offset', status: 'coming-soon' },
      { title: 'Box Offset', status: 'coming-soon' },
    ],
  },
  {
    title: '90s',
    items: [
      { title: 'Stub-Up 90', status: 'coming-soon' },
      { title: 'Back-to-Back 90', status: 'coming-soon' },
      { title: 'Kick 90', status: 'coming-soon' },
    ],
  },
  {
    title: 'Saddles',
    items: [
      { title: '3-Point Saddle', status: 'coming-soon' },
      { title: '4-Point Saddle', status: 'coming-soon' },
    ],
  },
  {
    title: 'Large / Advanced',
    items: [
      { title: 'Segment Bend', status: 'coming-soon' },
      { title: 'Hydraulic Layout', status: 'coming-soon' },
    ],
  },
];
