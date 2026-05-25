import { X, Zap, Settings, Sliders, GraduationCap } from "lucide-react";
import { Button } from "../Button";

interface CalculatorMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchBend: () => void;
  onEditSetup: () => void;
  onGuidedMode?: () => void;
  onSettings: () => void;
  showGuidedMode?: boolean;
}

export function CalculatorMenu({
  isOpen,
  onClose,
  onSwitchBend,
  onEditSetup,
  onGuidedMode,
  onSettings,
  showGuidedMode = true,
}: CalculatorMenuProps) {
  if (!isOpen) return null;

  const menuItems = [
    {
      icon: Zap,
      label: "Switch Bend",
      description: "Change to different bend type",
      onClick: () => {
        onSwitchBend();
        onClose();
      },
    },
    {
      icon: Sliders,
      label: "Edit Setup",
      description: "Adjust current calculation settings",
      onClick: () => {
        onEditSetup();
        onClose();
      },
    },
  ];

  if (showGuidedMode && onGuidedMode) {
    menuItems.push({
      icon: GraduationCap,
      label: "Guided Mode",
      description: "Step-by-step learning support",
      onClick: () => {
        onGuidedMode();
        onClose();
      },
    });
  }

  menuItems.push({
    icon: Settings,
    label: "Settings",
    description: "App defaults and preferences",
    onClick: () => {
      onSettings();
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-screen">
          <h2 className="text-base font-medium text-foreground">Calculator Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-4 py-4">
          <div className="max-w-md mx-auto space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full flex items-start gap-3 p-4 rounded-lg bg-surface border border-border hover:bg-surface-2 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-sm font-medium text-foreground mb-1">
                      {item.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
