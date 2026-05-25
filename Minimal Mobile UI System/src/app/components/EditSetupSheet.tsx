import { useState } from "react";
import { Button } from "./Button";
import { ChevronRight } from "lucide-react";

interface EditSetupSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (setup: SetupConfig) => void;
}

export interface SetupConfig {
  conduitType: string;
  conduitSize: string;
  bender: string;
  unit: "imperial" | "metric";
  rounding: string;
  saveAsDefault: boolean;
}

export function EditSetupSheet({ isOpen, onClose, onApply }: EditSetupSheetProps) {
  const [conduitType, setConduitType] = useState("EMT");
  const [conduitSize, setConduitSize] = useState("3/4");
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [rounding, setRounding] = useState("1/16");
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  if (!isOpen) return null;

  const handleApply = () => {
    if (onApply) {
      onApply({
        conduitType,
        conduitSize,
        bender: "Generic Hand Bender",
        unit,
        rounding,
        saveAsDefault,
      });
    }
    onClose();
  };

  const conduitTypes = ["EMT", "PVC", "IMC", "RMC"];
  const imperialSizes = ["1/2", "3/4", "1", "1-1/4", "1-1/2", "2"];
  const imperialRounding = ["1/16", "1/8", "1/4"];
  const metricRounding = ["1 mm", "5 mm", "10 mm"];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50" style={{ animation: "slideUp 0.2s ease-out" }}>
        <div className="max-w-md mx-auto bg-screen rounded-t-2xl border-t border-l border-r border-border shadow-2xl">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-border rounded-full"></div>
          </div>

          {/* Header */}
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-lg text-foreground">Setup</h2>
          </div>

          {/* Content */}
          <div className="px-4 py-6 space-y-6 max-h-[70vh] overflow-auto">
            {/* 1. Conduit */}
            <div className="space-y-3">
              <h3 className="text-sm text-muted-foreground">Conduit</h3>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {conduitTypes.map((type) => (
                    <Button
                      key={type}
                      variant={conduitType === type ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setConduitType(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {imperialSizes.map((size) => (
                    <Button
                      key={size}
                      variant={conduitSize === size ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setConduitSize(size)}
                    >
                      {size}"
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Bender */}
            <div className="space-y-3">
              <h3 className="text-sm text-muted-foreground">Bender</h3>

              <div className="p-4 rounded-lg border border-border bg-surface">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Current</p>
                    <p className="text-base text-foreground">Generic Hand Bender</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <span className="flex items-center gap-2">
                    Change bender
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Bender-specific guidance can affect markings and instructions when available.
                </p>
              </div>
            </div>

            {/* 3. Unit */}
            <div className="space-y-3">
              <h3 className="text-sm text-muted-foreground">Unit</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={unit === "imperial" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setUnit("imperial")}
                >
                  Imperial
                </Button>
                <Button
                  variant={unit === "metric" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setUnit("metric")}
                >
                  Metric
                </Button>
              </div>
            </div>

            {/* 4. Rounding */}
            <div className="space-y-3">
              <h3 className="text-sm text-muted-foreground">Rounding</h3>
              <div className="grid grid-cols-3 gap-2">
                {(unit === "imperial" ? imperialRounding : metricRounding).map((round) => (
                  <Button
                    key={round}
                    variant={rounding === round ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setRounding(round)}
                  >
                    {round}{unit === "imperial" && !round.includes('mm') ? '"' : ''}
                  </Button>
                ))}
              </div>
            </div>

            {/* 5. Save as default */}
            <div className="space-y-3">
              <button
                onClick={() => setSaveAsDefault(!saveAsDefault)}
                className="flex items-center justify-between w-full p-4 rounded-lg border border-border bg-surface hover:bg-surface-2 transition-colors"
              >
                <span className="text-sm text-foreground">Use this setup as default</span>
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${
                    saveAsDefault ? "bg-primary" : "bg-border"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-foreground transition-transform mt-0.5 ${
                      saveAsDefault ? "ml-5" : "ml-0.5"
                    }`}
                  ></div>
                </div>
              </button>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="px-4 py-4 border-t border-border bg-screen flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
