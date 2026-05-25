import { X, BookOpen } from "lucide-react";
import { Button } from "../components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { FormulaCard } from "../components/guided/FormulaCard";
import { StepList } from "../components/guided/StepList";
import { MistakesList } from "../components/guided/MistakesList";
import { AnnotatedMarkingGuide } from "../components/guided/AnnotatedMarkingGuide";

interface GuidedOffsetScreenProps {
  onClose: () => void;
  offsetHeight?: number;
  angle?: number;
}

export function GuidedOffsetScreen({
  onClose,
  offsetHeight = 4,
  angle = 30,
}: GuidedOffsetScreenProps) {
  // Calculate values for examples
  const multipliers: Record<number, number> = { 10: 6.0, 22.5: 2.6, 30: 2.0, 45: 1.4, 60: 1.2 };
  const multiplier = multipliers[angle] || 2.0;
  const spacing = offsetHeight * multiplier;
  const shrink = offsetHeight * 0.25;

  const bendSteps = [
    "Mark the first bend location on the conduit.",
    "Measure the spacing distance to mark the second bend.",
    "Bend both marks at the selected angle using your bender.",
    "Keep bends opposite and parallel to each other.",
    "Check the finished offset height matches your target.",
  ];

  const commonMistakes = [
    "Forgetting shrink when landing on a target measurement",
    "Bending marks in the wrong direction (not opposite)",
    "Using the wrong bender mark or degree indicator",
    "Not checking that bends are parallel after completion",
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-screen">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-primary" />
          <h1 className="text-base text-foreground">Guided Mode: Offset Bend</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto px-4 py-6 pb-20">
        <div className="max-w-md mx-auto space-y-6">
          {/* Explanation */}
          <Card className="bg-primary/10 border-primary/30">
            <CardContent className="pt-5 pb-5 px-5">
              <p className="text-base text-foreground leading-relaxed">
                An offset bend moves conduit around an obstruction while keeping it
                parallel to its original path. Two bends at the same angle create
                the offset.
              </p>
            </CardContent>
          </Card>

          {/* Formula Cards */}
          <div className="space-y-3">
            <h2 className="text-sm text-muted-foreground font-medium">Formulas</h2>
            <FormulaCard
              title="Spacing Between Marks"
              formula={`Spacing = Offset Height × Multiplier`}
              example={{
                calculation: `${offsetHeight}" × ${multiplier}`,
                result: `${spacing}"`,
              }}
            />
            <FormulaCard
              title="Shrink Amount"
              formula={`Shrink = Offset Height × 1/4`}
              example={{
                calculation: `${offsetHeight}" × 0.25`,
                result: `${shrink}"`,
              }}
            />
          </div>

          {/* Visual Explanation */}
          <div>
            <h2 className="text-sm text-muted-foreground font-medium mb-3">
              Visual Guide
            </h2>
            <Card className="bg-screen border-primary/30">
              <CardContent className="p-0">
                <AnnotatedMarkingGuide
                  spacing={spacing.toString()}
                  shrink={shrink.toString()}
                  unit="in"
                />
              </CardContent>
            </Card>
          </div>

          {/* Multipliers Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Multipliers by Angle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(multipliers).map(([deg, mult]) => (
                <div
                  key={deg}
                  className={`flex justify-between py-2 border-b border-border last:border-0 ${
                    Number(deg) === angle ? "text-primary" : "text-foreground"
                  }`}
                >
                  <span className="text-sm">{deg}°</span>
                  <span className="text-sm font-medium">{mult}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Bend Steps */}
          <div>
            <h2 className="text-sm text-muted-foreground font-medium mb-3">
              Bending Steps
            </h2>
            <Card>
              <CardContent className="pt-5 pb-5 px-5">
                <StepList steps={bendSteps} />
              </CardContent>
            </Card>
          </div>

          {/* Common Mistakes */}
          <div>
            <h2 className="text-sm text-muted-foreground font-medium mb-3">
              Common Mistakes to Avoid
            </h2>
            <Card className="bg-warning/5 border-warning/30">
              <CardContent className="pt-5 pb-5 px-5">
                <MistakesList mistakes={commonMistakes} />
              </CardContent>
            </Card>
          </div>

          {/* Back to Calculator */}
          <Button variant="primary" className="w-full" onClick={onClose}>
            Back to Calculator
          </Button>
        </div>
      </main>
    </div>
  );
}
