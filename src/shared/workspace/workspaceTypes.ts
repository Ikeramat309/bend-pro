import type { ReactNode } from 'react';

import type { MeasurementChipTone } from './MeasurementChip';

export type BendTrustConfig = {
  benderName: string;
  meta: string;
  note?: string;
  noteTone?: 'info' | 'warning';
  noteAction?: string;
  onEdit?: () => void;
  onNoteAction?: () => void;
};

export type BendFieldInputConfig = {
  type: 'field';
  key: string;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  unit?: string;
  variant?: 'default' | 'compact';
  /** Imperial fraction keypad or metric decimal pad for length fields. */
  lengthInput?: 'decimal' | 'imperial';
  /** Optional controlled imperial length sheet — for opening from outside the field. */
  lengthSheetOpen?: boolean;
  onLengthSheetOpenChange?: (open: boolean) => void;
  /** System keyboard for non-length numeric fields (e.g. degrees). */
  keyboardType?: 'decimal-pad';
  error?: string;
};

export type BendPickerInputConfig = {
  type: 'picker';
  key: string;
  label: string;
  value: string;
  onPress: () => void;
};

export type BendOptionalInputConfig = {
  type: 'optional';
  key: string;
  addLabel: string;
  onAdd: () => void;
  visible: boolean;
  field?: BendFieldInputConfig;
};

export type BendInputRowConfig = {
  type: 'row';
  key: string;
  inputs: BendInputConfig[];
};

export type BendCustomInputConfig = {
  type: 'custom';
  key: string;
  node: ReactNode;
};

export type BendInputConfig =
  | BendFieldInputConfig
  | BendPickerInputConfig
  | BendOptionalInputConfig
  | BendInputRowConfig
  | BendCustomInputConfig;

export type BendResultConfig = {
  label: string;
  value: string;
  tone?: MeasurementChipTone;
  onPress?: () => void;
};

export type BendDockAction = {
  key: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Workflow action styling — defaults to emphasis on the last left action when 2+ actions. */
  variant?: 'default' | 'emphasis' | 'pill';
};

export type BendActionDockConfig = {
  left: BendDockAction[];
  /** Optional centered dock action — e.g. Set First Mark between Reset and Guide. */
  center?: BendDockAction;
  guide?: {
    label?: string;
    onPress: () => void;
  };
};

export type BendCalculatorLayoutProps = {
  title: string;
  subtitle: string;
  trust: BendTrustConfig;
  /** Structured inputs and/or a custom strip for calculator-specific fields. */
  inputs?: BendInputConfig[];
  inputStrip?: ReactNode;
  workspace: ReactNode;
  primaryResult?: BendResultConfig;
  secondaryResults?: BendResultConfig[];
  dock: BendActionDockConfig;
  showBottomNav?: boolean;
  warnings?: string[];
  onBackPress: () => void;
  /** Tighter vertical rhythm between inputs, diagram, and results. */
  workspaceDensity?: 'default' | 'compact';
  /** Tighter input strip padding. */
  inputDensity?: 'default' | 'compact';
  /** Center the screen title in the header bar. */
  centerTitle?: boolean;
  footer?: ReactNode;
};
