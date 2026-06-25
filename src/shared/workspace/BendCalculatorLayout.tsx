import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/shared/ui';
import { colors, spacing, workspaceTheme } from '@/theme';

import { BendActionDock } from './BendActionDock';
import { BendHeader } from './BendHeader';
import { BendInputStrip } from './BendInputStrip';
import { BendPipeWorkspace } from './BendPipeWorkspace';
import { BendTrustStrip } from './BendTrustStrip';
import { WarningList } from './WarningList';
import type { BendCalculatorLayoutProps } from './workspaceTypes';

/** Universal calculator screen shell — compact chrome, hero pipe workspace, adaptive dock. */
export function BendCalculatorLayout({
  title,
  subtitle,
  trust,
  inputs,
  inputStrip,
  workspace,
  primaryResult,
  secondaryResults,
  dock,
  showBottomNav = false,
  warnings,
  onBackPress,
  footer,
}: BendCalculatorLayoutProps) {
  const workspaceNode = (
    <BendPipeWorkspace
      diagram={workspace}
      primaryResult={primaryResult}
      secondaryResults={secondaryResults}
    />
  );

  return (
    <View style={styles.screen}>
      <BendHeader title={title} subtitle={subtitle} onBackPress={onBackPress} />
      <SafeAreaView style={styles.body} edges={['left', 'right', 'bottom']}>
        <BendTrustStrip {...trust} />
        <ScrollView
          style={styles.inputScroll}
          contentContainerStyle={styles.inputScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <BendInputStrip inputs={inputs}>{inputStrip}</BendInputStrip>
        </ScrollView>
        <View style={styles.workspace}>{workspaceNode}</View>
        {warnings && warnings.length > 0 ? (
          <View style={styles.warnings}>
            <WarningList warnings={warnings} />
          </View>
        ) : null}
        <BendActionDock {...dock} />
        {showBottomNav ? <BottomNav activeTab="bends" onTabChange={() => {}} /> : null}
      </SafeAreaView>
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
  },
  inputScroll: {
    flexGrow: 0,
    flexShrink: 0,
    maxHeight: workspaceTheme.inputStrip.maxHeight,
  },
  inputScrollContent: {
    flexGrow: 0,
  },
  workspace: {
    flex: 1,
    minHeight: workspaceTheme.workspace.minHeight,
    flexShrink: 1,
  },
  warnings: {
    flexShrink: 0,
    paddingHorizontal: spacing.lg,
    paddingVertical: workspaceTheme.warningStrip.paddingVertical,
  },
});
