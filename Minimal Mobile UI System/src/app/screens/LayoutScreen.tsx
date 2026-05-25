import { AppTopBar } from "../components/navigation/AppTopBar";
import { ContinueLayoutCard } from "../components/layout/ContinueLayoutCard";
import { StartNewLayoutRow } from "../components/layout/StartNewLayoutRow";
import { BendFamilyTile } from "../components/layout/BendFamilyTile";
import { Move, CornerDownRight, Mountain, Zap, Settings } from "lucide-react";
import { Button } from "../components/Button";

interface LayoutScreenProps {
  onOpenWorkbench: (bendType?: string) => void;
  onStartNew?: () => void;
  onOpenSettings?: () => void;
}

export function LayoutScreen({ onOpenWorkbench, onStartNew, onOpenSettings }: LayoutScreenProps) {
  const hasRecentLayout = true;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="relative">
        <AppTopBar badge="Beta" showHelp />
        {onOpenSettings && (
          <div className="absolute top-3 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenSettings}
              className="w-9 h-9"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      <main className="flex-1 overflow-auto pb-20">
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Main Question */}
          <div className="text-center py-4">
            <h2 className="text-xl text-foreground">What are you laying out?</h2>
          </div>

          {/* Continue Layout */}
          {hasRecentLayout && (
            <ContinueLayoutCard
              bendType="Offset Bend"
              description="Clear obstruction. Stay parallel."
              lastResult={{ label: "Mark 2", value: '8"' }}
              onContinue={() => onOpenWorkbench("offset")}
            />
          )}

          {/* Start New */}
          <StartNewLayoutRow onStartNew={onStartNew || (() => onOpenWorkbench())} />

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              or choose family
            </span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Bend Families */}
          <div className="grid grid-cols-2 gap-3">
            <BendFamilyTile
              icon={Move}
              label="Offset"
              onClick={() => onOpenWorkbench("offset")}
            />
            <BendFamilyTile
              icon={CornerDownRight}
              label="90s"
              onClick={() => onOpenWorkbench("ninety")}
            />
            <BendFamilyTile
              icon={Mountain}
              label="Saddles"
              onClick={() => onOpenWorkbench("saddle")}
            />
            <BendFamilyTile
              icon={Zap}
              label="Large / Advanced"
              onClick={() => onOpenWorkbench("advanced")}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
