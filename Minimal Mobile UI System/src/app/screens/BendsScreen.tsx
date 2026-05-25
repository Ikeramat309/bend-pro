import { useState } from "react";
import { AppTopBar } from "../components/navigation/AppTopBar";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Badge } from "../components/Badge";
import { Search, Move, CornerDownRight, Mountain, Rotate3D, Zap, Settings } from "lucide-react";

interface BendType {
  id: string;
  name: string;
  description: string;
  family: string;
  icon: React.ComponentType<{ className?: string }>;
  available?: boolean;
  difficulty?: "beginner" | "intermediate" | "advanced";
}

interface BendsScreenProps {
  onSelectBend?: (bendId: string) => void;
  onOpenSettings?: () => void;
}

export function BendsScreen({ onSelectBend, onOpenSettings }: BendsScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const allBends: BendType[] = [
    // Offset Family
    {
      id: "basic-offset",
      name: "Basic Offset",
      description: "Clear obstructions while maintaining parallel pipe",
      family: "Offset",
      icon: Move,
      available: true,
      difficulty: "beginner",
    },
    {
      id: "parallel-offset",
      name: "Parallel Offset",
      description: "Multiple offset bends running parallel",
      family: "Offset",
      icon: Move,
      available: false,
      difficulty: "intermediate",
    },
    {
      id: "rolling-offset",
      name: "Rolling Offset",
      description: "Change elevation and direction simultaneously",
      family: "Rolling",
      icon: Rotate3D,
      available: false,
      difficulty: "advanced",
    },
    {
      id: "box-offset",
      name: "Box Offset",
      description: "Navigate around rectangular obstacles",
      family: "Offset",
      icon: Move,
      available: false,
      difficulty: "intermediate",
    },
    // 90s Family
    {
      id: "stub-up-90",
      name: "Stub-Up 90",
      description: "Single 90° bend from floor or horizontal",
      family: "90s",
      icon: CornerDownRight,
      available: false,
      difficulty: "beginner",
    },
    {
      id: "back-to-back-90",
      name: "Back-to-Back 90",
      description: "Two 90° bends creating a U-shape",
      family: "90s",
      icon: CornerDownRight,
      available: false,
      difficulty: "beginner",
    },
    // Saddles Family
    {
      id: "3-point-saddle",
      name: "3-Point Saddle",
      description: "Cross over small obstacles or other conduit",
      family: "Saddles",
      icon: Mountain,
      available: false,
      difficulty: "intermediate",
    },
    {
      id: "4-point-saddle",
      name: "4-Point Saddle",
      description: "Cross over wider obstacles with flatter profile",
      family: "Saddles",
      icon: Mountain,
      available: false,
      difficulty: "advanced",
    },
    // Advanced
    {
      id: "segment-bend",
      name: "Segment Bend",
      description: "Multiple small bends creating smooth curves",
      family: "Large / Advanced",
      icon: Zap,
      available: false,
      difficulty: "advanced",
    },
    {
      id: "concentric-90",
      name: "Concentric 90",
      description: "Multiple 90° bends with matching radius",
      family: "Large / Advanced",
      icon: Zap,
      available: false,
      difficulty: "intermediate",
    },
  ];

  // Filter bends by search query
  const filteredBends = searchQuery
    ? allBends.filter(
        (bend) =>
          bend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bend.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bend.family.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allBends;

  // Group by family
  const families = ["Offset", "90s", "Saddles", "Rolling", "Large / Advanced"];
  const bendsByFamily = families.reduce((acc, family) => {
    acc[family] = filteredBends.filter((bend) => bend.family === family);
    return acc;
  }, {} as Record<string, BendType[]>);

  const difficultyColors: Record<string, string> = {
    beginner: "bg-success/20 text-success border-success/30",
    intermediate: "bg-warning/20 text-warning border-warning/30",
    advanced: "bg-destructive/20 text-destructive border-destructive/30",
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="relative">
        <AppTopBar title="Bend Library" badge="Beta" />
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
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search bends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Bend Families */}
          {families.map((family) => {
            const familyBends = bendsByFamily[family];
            if (!familyBends || familyBends.length === 0) return null;

            return (
              <div key={family} className="space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {family}
                </h2>
                <div className="space-y-2">
                  {familyBends.map((bend) => {
                    const Icon = bend.icon;
                    const isAvailable = bend.available !== false;

                    return (
                      <button
                        key={bend.id}
                        onClick={() => isAvailable && onSelectBend?.(bend.id)}
                        disabled={!isAvailable}
                        className={`w-full flex items-start gap-3 p-4 rounded-lg transition-colors ${
                          isAvailable
                            ? "bg-surface border border-border hover:bg-surface-2"
                            : "bg-surface/50 border border-border/50 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            isAvailable
                              ? "bg-primary/20 text-primary"
                              : "bg-muted-foreground/20 text-muted-foreground"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium text-foreground">
                              {bend.name}
                            </h3>
                            {bend.difficulty && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  difficultyColors[bend.difficulty]
                                }`}
                              >
                                {bend.difficulty}
                              </Badge>
                            )}
                            {!isAvailable && (
                              <Badge variant="warning" className="text-xs">
                                Soon
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {bend.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* No Results */}
          {filteredBends.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No bends found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
