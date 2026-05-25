import { useState } from "react";
import { Button } from "./components/Button";
import { ComponentShowcase } from "./components/ComponentShowcase";
import { ComponentShowcase2 } from "./components/ComponentShowcase2";
import { EditSetupSheetDemo } from "./components/EditSetupSheetDemo";
import { StartNewLayoutPickerDemo } from "./components/StartNewLayoutPickerDemo";
import { GuidedModeDemo } from "./components/GuidedModeDemo";
import { BottomNav } from "./components/navigation/BottomNav";
import { LayoutScreen } from "./screens/LayoutScreen";
import { BendsScreen } from "./screens/BendsScreen";
import { BendersScreen } from "./screens/BendersScreen";
import { GuideScreen } from "./screens/GuideScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { OffsetWorkbenchScreen } from "./screens/OffsetWorkbenchScreen";
import { WorkbenchScreen } from "./screens/WorkbenchScreen";
import { GuidedOffsetScreen } from "./screens/GuidedOffsetScreen";
import { EditSetupSheet } from "./components/EditSetupSheet";
import { StartNewLayoutPicker } from "./components/layout/StartNewLayoutPicker";
import { QuickBendSwitcher } from "./components/workbench/QuickBendSwitcher";
import { CalculatorMenu } from "./components/workbench/CalculatorMenu";
import { Palette } from "lucide-react";

type Tab = "layout" | "bends" | "benders" | "guide";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("layout");
  const [showWorkbench, setShowWorkbench] = useState(false);
  const [showSetupSheet, setShowSetupSheet] = useState(false);
  const [showComponentShowcase, setShowComponentShowcase] = useState(false);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [showGuidedMode, setShowGuidedMode] = useState(false);
  const [showBendSwitcher, setShowBendSwitcher] = useState(false);
  const [showCalculatorMenu, setShowCalculatorMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [workbenchBendType, setWorkbenchBendType] = useState<string | undefined>();

  const handleOpenWorkbench = (bendType?: string) => {
    setWorkbenchBendType(bendType);
    setShowWorkbench(true);
  };

  const handleCloseWorkbench = () => {
    setShowWorkbench(false);
    setWorkbenchBendType(undefined);
  };

  const handleOpenLayoutPicker = () => {
    setShowLayoutPicker(true);
  };

  const handleSelectBendType = (bendTypeId: string) => {
    // Map bend type IDs to workbench types
    const typeMap: Record<string, string> = {
      "basic-offset": "offset",
      "stub-up-90": "ninety",
      "3-point-saddle": "saddle",
    };
    const workbenchType = typeMap[bendTypeId] || "offset";
    setShowLayoutPicker(false);
    handleOpenWorkbench(workbenchType);
  };

  const handleBendSwitcherSelect = (bendTypeId: string) => {
    const typeMap: Record<string, string> = {
      "basic-offset": "offset",
      "stub-up-90": "ninety",
      "3-point-saddle": "saddle",
    };
    const workbenchType = typeMap[bendTypeId] || "offset";
    setWorkbenchBendType(workbenchType);
  };

  if (showComponentShowcase) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowComponentShowcase(false)}
          >
            Back to App
          </Button>
        </div>
        <div className="grid grid-cols-5">
          <div>
            <ComponentShowcase />
          </div>
          <div className="border-l border-border">
            <ComponentShowcase2 />
          </div>
          <div className="border-l border-border">
            <EditSetupSheetDemo />
          </div>
          <div className="border-l border-border">
            <StartNewLayoutPickerDemo />
          </div>
          <div className="border-l border-border">
            <GuidedModeDemo />
          </div>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return <SettingsScreen onClose={() => setShowSettings(false)} />;
  }

  if (showGuidedMode) {
    return (
      <GuidedOffsetScreen onClose={() => setShowGuidedMode(false)} />
    );
  }

  if (showWorkbench) {
    // Use specialized Offset screen for offset bends
    if (workbenchBendType === "offset") {
      return (
        <>
          <OffsetWorkbenchScreen
            onClose={handleCloseWorkbench}
            onOpenSetup={() => setShowSetupSheet(true)}
            onApplySetup={() => setShowSetupSheet(false)}
            onOpenGuided={() => setShowGuidedMode(true)}
            onOpenBendSwitcher={() => setShowBendSwitcher(true)}
            onOpenMenu={() => setShowCalculatorMenu(true)}
            onOpenSettings={() => setShowSettings(true)}
          />
          <EditSetupSheet
            isOpen={showSetupSheet}
            onClose={() => setShowSetupSheet(false)}
            onApply={() => setShowSetupSheet(false)}
          />
          <QuickBendSwitcher
            isOpen={showBendSwitcher}
            onClose={() => setShowBendSwitcher(false)}
            currentBendType="basic-offset"
            onSelect={handleBendSwitcherSelect}
          />
          <CalculatorMenu
            isOpen={showCalculatorMenu}
            onClose={() => setShowCalculatorMenu(false)}
            onSwitchBend={() => setShowBendSwitcher(true)}
            onEditSetup={() => setShowSetupSheet(true)}
            onGuidedMode={() => setShowGuidedMode(true)}
            onSettings={() => setShowSettings(true)}
            showGuidedMode={true}
          />
        </>
      );
    }

    // Use generic workbench for other bend types
    return (
      <>
        <WorkbenchScreen
          bendType={workbenchBendType}
          onClose={handleCloseWorkbench}
          onOpenSetup={() => setShowSetupSheet(true)}
          onOpenBendSwitcher={() => setShowBendSwitcher(true)}
          onOpenMenu={() => setShowCalculatorMenu(true)}
        />
        <EditSetupSheet
          isOpen={showSetupSheet}
          onClose={() => setShowSetupSheet(false)}
        />
        <QuickBendSwitcher
          isOpen={showBendSwitcher}
          onClose={() => setShowBendSwitcher(false)}
          currentBendType={workbenchBendType}
          onSelect={handleBendSwitcherSelect}
        />
        <CalculatorMenu
          isOpen={showCalculatorMenu}
          onClose={() => setShowCalculatorMenu(false)}
          onSwitchBend={() => setShowBendSwitcher(true)}
          onEditSetup={() => setShowSetupSheet(true)}
          onSettings={() => setShowSettings(true)}
          showGuidedMode={false}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Component Showcase Toggle (Dev only) */}
      <button
        onClick={() => setShowComponentShowcase(true)}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-surface border border-border hover:bg-surface-2"
        title="View Component Showcase"
      >
        <Palette className="w-5 h-5 text-primary" />
      </button>

      {/* Tab Screens */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "layout" && (
          <LayoutScreen
            onOpenWorkbench={handleOpenWorkbench}
            onStartNew={handleOpenLayoutPicker}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}
        {activeTab === "bends" && (
          <BendsScreen
            onSelectBend={handleSelectBendType}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}
        {activeTab === "benders" && (
          <BendersScreen onOpenSettings={() => setShowSettings(true)} />
        )}
        {activeTab === "guide" && (
          <GuideScreen onOpenSettings={() => setShowSettings(true)} />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Start New Layout Picker */}
      <StartNewLayoutPicker
        isOpen={showLayoutPicker}
        onClose={() => setShowLayoutPicker(false)}
        onSelect={handleSelectBendType}
      />
    </div>
  );
}