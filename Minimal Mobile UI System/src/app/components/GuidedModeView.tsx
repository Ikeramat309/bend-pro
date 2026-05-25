import { Button } from "./Button";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Badge } from "./Badge";
import { Circle, Lightbulb } from "lucide-react";

export function GuidedModeView({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-border bg-screen">
        <div className="flex items-center gap-3">
          <Circle className="w-6 h-6 text-primary" />
          <h1 className="text-lg text-foreground">Guided Mode</h1>
          <Badge variant="default">For students</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onBack}>
          Exit
        </Button>
      </header>

      {/* Content */}
      <main className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Progress */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-primary rounded-full"></div>
          <div className="flex-1 h-1 bg-surface-2 rounded-full"></div>
          <div className="flex-1 h-1 bg-surface-2 rounded-full"></div>
          <div className="flex-1 h-1 bg-surface-2 rounded-full"></div>
        </div>
        <div className="text-sm text-muted-foreground text-center">
          Step 1 of 4: Choose bend type
        </div>

        {/* Instructional Card */}
        <Card className="bg-warning/10 border-warning/30">
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <p className="text-base text-foreground">
                  A 90° bend creates a right angle in the conduit.
                </p>
                <p className="text-sm text-muted-foreground">
                  This is the most common bend type used to route conduit around corners,
                  into boxes, or through walls.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bend Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select bend type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-start gap-3 p-4 rounded-lg border-2 border-primary bg-primary/5">
              <div className="flex flex-col items-start gap-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base text-foreground">90° Bend</span>
                  <Badge variant="warning">Most common</Badge>
                </div>
                <span className="text-sm text-muted-foreground text-left">
                  Creates a right angle (quarter turn)
                </span>
              </div>
            </button>

            <button className="w-full flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-surface-2 transition-colors">
              <div className="flex flex-col items-start gap-1 flex-1">
                <span className="text-base text-foreground">Offset Bend</span>
                <span className="text-sm text-muted-foreground text-left">
                  Moves conduit parallel to original path
                </span>
              </div>
            </button>

            <button className="w-full flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-surface-2 transition-colors">
              <div className="flex flex-col items-start gap-1 flex-1">
                <span className="text-base text-foreground">3-Point Saddle</span>
                <span className="text-sm text-muted-foreground text-left">
                  Routes over an obstacle
                </span>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Button variant="primary" className="w-full h-14">
            Continue
          </Button>
          <Button variant="ghost" className="w-full">
            Learn more about bend types
          </Button>
        </div>
      </main>
    </div>
  );
}
