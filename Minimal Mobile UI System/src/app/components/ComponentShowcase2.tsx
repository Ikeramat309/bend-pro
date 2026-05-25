import { MarkingGuide } from "./workbench/MarkingGuide";
import { AngleSelector } from "./workbench/AngleSelector";
import { ResultCard } from "./workbench/ResultCard";
import { useState } from "react";

export function ComponentShowcase2() {
  const [selectedAngle, setSelectedAngle] = useState(30);

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Marking Guide */}
        <section>
          <h2 className="text-xl text-foreground mb-4">Marking Guide (Hero Component)</h2>
          <div className="bg-screen rounded-lg p-4">
            <MarkingGuide
              mark1Label="Mark 1"
              mark2Label="Mark 2"
              distance="8"
              unit="in"
            />
          </div>
        </section>

        {/* Angle Selector */}
        <section>
          <h2 className="text-xl text-foreground mb-4">Angle Selector</h2>
          <div className="bg-screen rounded-lg p-4">
            <AngleSelector
              angles={[10, 22.5, 30, 45, 60]}
              selected={selectedAngle}
              onSelect={setSelectedAngle}
            />
          </div>
        </section>

        {/* Result Cards */}
        <section>
          <h2 className="text-xl text-foreground mb-4">Result Cards</h2>
          <div className="space-y-3">
            <ResultCard
              label="Mark 2 Distance"
              value="8"
              unit="in"
              subtitle="Measure from Mark 1"
              variant="mark"
            />
            <ResultCard
              label="Shrink"
              value="1"
              unit="in"
              subtitle="Only if landing on target"
              variant="default"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
