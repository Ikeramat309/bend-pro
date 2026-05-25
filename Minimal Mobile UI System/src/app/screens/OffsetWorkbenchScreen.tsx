import { useState } from "react";
import { ArrowLeft, Menu, ChevronDown } from "lucide-react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Card, CardContent } from "../components/Card";
import { MarkingGuide } from "../components/workbench/MarkingGuide";
import { AngleSelector } from "../components/workbench/AngleSelector";
import { ResultCard } from "../components/workbench/ResultCard";
import type { SetupConfig } from "../components/EditSetupSheet";

interface OffsetWorkbenchScreenProps {
  onClose: () => void;
  onOpenSetup: () => void;
  onApplySetup?: (setup: SetupConfig) => void;
  onOpenGuided?: () => void;
  onOpenBendSwitcher?: () => void;
  onOpenMenu?: () => void;
  onOpenSettings?: () => void;
}

export function OffsetWorkbenchScreen({
  onClose,
  onOpenSetup,
  onApplySetup,
  onOpenGuided,
  onOpenBendSwitcher,
  onOpenMenu,
  onOpenSettings,
}: OffsetWorkbenchScreenProps) {
  const [offsetHeight, setOffsetHeight] = useState("4");
  const [selectedAngle, setSelectedAngle] = useState(30);
  const [showOptionalFirst, setShowOptionalFirst] = useState(false);
  const [showGuided, setShowGuided] = useState(false);
  const [setup, setSetup] = useState<SetupConfig>({
    conduitType: "EMT",
    conduitSize: "3/4",
    bender: "Generic Hand Bender",
    unit: "imperial",
    rounding: "1/16",
    saveAsDefault: false,
  });

  const handleSetupApply = (newSetup: SetupConfig) => {
    setSetup(newSetup);
    if (onApplySetup) {
      onApplySetup(newSetup);
    }
  };

  const angles = [10, 22.5, 30, 45, 60];

  // Calculate results based on offset height and angle
  const height = Number(offsetHeight) || 0;
  const multipliers: Record<number, number> = {
    10: 6.0,
    22.5: 2.6,
    30: 2.0,
    45: 1.4,
    60: 1.2,
  };
  const multiplier = multipliers[selectedAngle] || 2.0;
  const mark2Distance = Math.round(height * multiplier * 10) / 10;
  const shrink = Math.round(height * 0.25 * 10) / 10;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-screen">
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0 ml-2">
          <h1 className="text-base text-foreground font-medium">Offset Bend</h1>
          <p className="text-xs text-muted-foreground">
            {setup.conduitType} {setup.conduitSize}" • {selectedAngle}°
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMenu}
          className="shrink-0"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto px-4 py-6 pb-20">
        <div className="max-w-md mx-auto space-y-6">
          {/* Setup Chip */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-foreground">
                {setup.bender}
              </span>
              <span className="text-xs text-muted-foreground">
                Tap to change unit, rounding, bender
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onOpenSetup}>
              Edit
            </Button>
          </div>

          {/* Main Input */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <label className="text-sm text-muted-foreground">Offset Height</label>
              <Input
                type="number"
                placeholder="0"
                unit="in"
                value={offsetHeight}
                onChange={(e) => setOffsetHeight(e.target.value)}
                autoFocus
              />
            </CardContent>
          </Card>

          {/* Angle Selector */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <label className="text-sm text-muted-foreground">Bend Angle</label>
              <AngleSelector
                angles={angles}
                selected={selectedAngle}
                onSelect={setSelectedAngle}
              />
            </CardContent>
          </Card>

          {/* Hero: Marking Guide */}
          {height > 0 && (
            <Card className="bg-screen border-primary/30">
              <CardContent className="p-0">
                <div className="px-4 pt-4 pb-2">
                  <h3 className="text-sm text-muted-foreground">Marking Guide</h3>
                </div>
                <MarkingGuide
                  mark1Label="Mark 1"
                  mark2Label="Mark 2"
                  distance={mark2Distance.toString()}
                  unit="in"
                />
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {height > 0 && (
            <div className="space-y-3">
              <ResultCard
                label="Mark 2 Distance"
                value={mark2Distance.toString()}
                unit="in"
                subtitle="Measure from Mark 1"
                variant="mark"
              />
              {shrink > 0 && (
                <ResultCard
                  label="Shrink"
                  value={shrink.toString()}
                  unit="in"
                  subtitle="Only if landing on target"
                  variant="default"
                />
              )}
            </div>
          )}

          {/* Optional Sections */}
          <div className="space-y-2">
            <button
              onClick={() => setShowOptionalFirst(!showOptionalFirst)}
              className="w-full flex items-center justify-between py-3 px-4 rounded-lg border border-border bg-surface hover:bg-surface-2 transition-colors"
            >
              <span className="text-sm text-foreground">Optional First Mark</span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  showOptionalFirst ? "rotate-180" : ""
                }`}
              />
            </button>
            {showOptionalFirst && (
              <Card className="bg-surface-2">
                <CardContent className="p-5 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    If you need to maintain a specific starting point, calculate
                    Mark 1 position from your reference point.
                  </p>
                  <Input
                    type="number"
                    placeholder="Distance from reference"
                    unit="in"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
