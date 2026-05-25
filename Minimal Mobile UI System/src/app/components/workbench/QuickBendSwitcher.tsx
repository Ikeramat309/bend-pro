import { X, Move, CornerDownRight, Mountain, Rotate3D, Zap } from "lucide-react";
import { Button } from "../Button";

interface BendType {
  id: string;
  label: string;
  family: string;
  icon?: React.ComponentType<{ className?: string }>;
  available?: boolean;
}

interface QuickBendSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  currentBendType?: string;
  onSelect: (bendTypeId: string) => void;
}

export function QuickBendSwitcher({
  isOpen,
  onClose,
  currentBendType,
  onSelect,
}: QuickBendSwitcherProps) {
  if (!isOpen) return null;

  const bendTypes: BendType[] = [
    { id: "basic-offset", label: "Basic Offset", family: "Offset", icon: Move, available: true },
    { id: "parallel-offset", label: "Parallel Offset", family: "Offset", icon: Move, available: false },
    { id: "rolling-offset", label: "Rolling Offset", family: "Offset", icon: Rotate3D, available: false },
    { id: "box-offset", label: "Box Offset", family: "Offset", icon: Move, available: false },
    { id: "stub-up-90", label: "Stub-Up 90", family: "90s", icon: CornerDownRight, available: false },
    { id: "back-to-back-90", label: "Back-to-Back 90", family: "90s", icon: CornerDownRight, available: false },
    { id: "3-point-saddle", label: "3-Point Saddle", family: "Saddles", icon: Mountain, available: false },
    { id: "4-point-saddle", label: "4-Point Saddle", family: "Saddles", icon: Mountain, available: false },
    { id: "segment-bend", label: "Segment Bend", family: "Advanced", icon: Zap, available: false },
  ];

  const handleSelect = (bendTypeId: string, available: boolean) => {
    if (available) {
      onSelect(bendTypeId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-screen">
          <h2 className="text-base font-medium text-foreground">Switch Bend Type</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-4 py-4">
          <div className="max-w-md mx-auto space-y-1">
            {bendTypes.map((bend) => {
              const Icon = bend.icon;
              const isActive = currentBendType === bend.id;
              const isAvailable = bend.available !== false;

              return (
                <button
                  key={bend.id}
                  onClick={() => handleSelect(bend.id, isAvailable)}
                  disabled={!isAvailable}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary/20 border border-primary/40"
                      : isAvailable
                      ? "bg-surface border border-border hover:bg-surface-2"
                      : "bg-surface/50 border border-border/50 opacity-50 cursor-not-allowed"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  )}
                  <div className="flex-1 text-left">
                    <div
                      className={`text-sm font-medium ${
                        isActive ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {bend.label}
                    </div>
                    <div className="text-xs text-muted-foreground">{bend.family}</div>
                  </div>
                  {isActive && (
                    <div className="text-xs text-primary font-medium">Active</div>
                  )}
                  {!isAvailable && (
                    <div className="text-xs text-muted-foreground">Soon</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
