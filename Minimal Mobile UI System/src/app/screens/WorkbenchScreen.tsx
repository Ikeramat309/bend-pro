import { useState } from "react";
import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Card, CardContent } from "../components/Card";
import { ResultDisplay } from "../components/ResultDisplay";
import { SetupChip } from "../components/workbench/SetupChip";

interface WorkbenchScreenProps {
  bendType?: string;
  onClose: () => void;
  onOpenSetup: () => void;
  onOpenBendSwitcher?: () => void;
  onOpenMenu?: () => void;
}

export function WorkbenchScreen({
  bendType = "offset",
  onClose,
  onOpenSetup,
  onOpenBendSwitcher,
  onOpenMenu,
}: WorkbenchScreenProps) {
  const [measurement, setMeasurement] = useState("");
  const [calculated, setCalculated] = useState(false);

  const bendTypes: Record<string, { title: string; description: string }> = {
    offset: { title: "Offset Bend", description: "Clear obstruction. Stay parallel." },
    ninety: { title: "90° Bend", description: "Create right angle." },
    saddle: { title: "3-Point Saddle", description: "Route over obstacle." },
    advanced: { title: "Advanced Bend", description: "Complex layouts." },
  };

  const current = bendTypes[bendType] || bendTypes.offset;

  const handleCalculate = () => {
    if (measurement) {
      setCalculated(true);
    }
  };

  const handleReset = () => {
    setMeasurement("");
    setCalculated(false);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-screen">
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0 ml-2">
          <h1 className="text-base text-foreground font-medium">{current.title}</h1>
          <p className="text-xs text-muted-foreground">EMT ¾" • 30°</p>
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
      <main className="flex-1 overflow-auto px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Setup */}
          <div className="flex justify-center">
            <SetupChip
              conduitType="EMT"
              conduitSize="¾&quot;"
              bender="Shoe 1"
              onClick={onOpenSetup}
            />
          </div>

          {!calculated ? (
            <>
              {/* Measurement Input */}
              <Card>
                <CardContent className="p-5 space-y-3">
                  <label className="text-sm text-muted-foreground">
                    Obstacle height
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    unit="in"
                    value={measurement}
                    onChange={(e) => setMeasurement(e.target.value)}
                    autoFocus
                  />
                </CardContent>
              </Card>

              {/* Angle Selection */}
              <Card>
                <CardContent className="p-5 space-y-3">
                  <label className="text-sm text-muted-foreground">Bend angle</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="primary" size="sm">
                      30°
                    </Button>
                    <Button variant="secondary" size="sm">
                      45°
                    </Button>
                    <Button variant="secondary" size="sm">
                      60°
                    </Button>
                  </div>
                  <p className="text-xs text-warning">30° most common</p>
                </CardContent>
              </Card>

              {/* Calculate */}
              <Button
                variant="primary"
                className="w-full h-14"
                onClick={handleCalculate}
                disabled={!measurement}
              >
                Calculate marks
              </Button>
            </>
          ) : (
            <>
              {/* Results */}
              <div className="space-y-3">
                <ResultDisplay
                  label="Mark 1"
                  value={String(Number(measurement) * 6)}
                  unit="in"
                  variant="mark"
                />
                <ResultDisplay
                  label="Mark 2"
                  value={String(Number(measurement) * 6 + Number(measurement) * 2)}
                  unit="in"
                  variant="mark"
                />
              </div>

              {/* Details */}
              <Card className="bg-surface-2">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Distance between marks</span>
                    <span className="text-base text-foreground tabular-nums">
                      {Number(measurement) * 2}"
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border pt-3">
                    <span className="text-sm text-muted-foreground">Multiplier (30°)</span>
                    <span className="text-base text-foreground">2.0</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border pt-3">
                    <span className="text-sm text-muted-foreground">Shrink</span>
                    <span className="text-base text-foreground tabular-nums">
                      {Math.round(Number(measurement) * 0.25)}"
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button variant="mark" className="w-full h-14">
                  Mark complete
                </Button>
                <Button variant="outline" className="w-full" onClick={handleReset}>
                  New calculation
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
