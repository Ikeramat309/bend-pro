import { AppTopBar } from "../components/navigation/AppTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Input } from "../components/Input";
import { Check, ChevronRight, Search, Settings } from "lucide-react";

interface BendersScreenProps {
  onOpenSettings?: () => void;
}

export function BendersScreen({ onOpenSettings }: BendersScreenProps) {
  const benders = [
    { id: "1", name: "Generic Hand Bender", manufacturer: "Generic", active: true },
    { id: "2", name: "Klein Tools Bender", manufacturer: "Klein", active: false },
    { id: "3", name: "Ideal 74-028", manufacturer: "Ideal", active: false },
    { id: "4", name: "Greenlee 841", manufacturer: "Greenlee", active: false },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="relative">
        <AppTopBar title="Benders" />
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
          {/* Current Bender */}
          <Card className="bg-surface-2 border-primary/30">
            <CardHeader>
              <CardTitle>Current Bender</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-base text-foreground">Generic Hand Bender</span>
                  <span className="text-sm text-muted-foreground">Generic</span>
                </div>
                <Badge variant="primary">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search benders..."
              className="h-12 pl-10 text-base"
            />
            <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Bender Database */}
          <Card>
            <CardHeader>
              <CardTitle>Bender Database</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {benders.map((bender, index) => (
                <button
                  key={bender.id}
                  className="w-full flex items-center justify-between py-4 border-b border-border last:border-0 hover:bg-surface-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {bender.active && (
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                    {!bender.active && <div className="w-5 h-5"></div>}
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-base text-foreground">{bender.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {bender.manufacturer}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <Button variant="outline" className="w-full">
            Add custom bender
          </Button>
        </div>
      </main>
    </div>
  );
}
