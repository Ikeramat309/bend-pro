import { Layers, Wrench, GraduationCap, Zap } from "lucide-react";

interface BottomNavProps {
  activeTab: "layout" | "bends" | "benders" | "guide";
  onTabChange: (tab: "layout" | "bends" | "benders" | "guide") => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "layout", label: "Layout", icon: Layers },
    { id: "bends", label: "Bends", icon: Zap },
    { id: "benders", label: "Benders", icon: Wrench },
    { id: "guide", label: "Guide", icon: GraduationCap },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-screen border-t border-border">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 py-3 px-4 flex-1 transition-colors"
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-xs ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
