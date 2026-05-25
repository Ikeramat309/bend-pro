import { useState } from "react";
import { Button } from "./Button";
import { GuidedOffsetScreen } from "../screens/GuidedOffsetScreen";

export function GuidedModeDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {!isOpen ? (
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="space-y-6 max-w-md w-full">
            <div className="text-center space-y-2">
              <h1 className="text-2xl text-foreground">Guided Mode</h1>
              <p className="text-sm text-muted-foreground">
                Educational overlay for learning offset bends
              </p>
            </div>

            <Button variant="primary" className="w-full" onClick={() => setIsOpen(true)}>
              Open Guided Mode
            </Button>

            <div className="p-4 rounded-lg border border-border bg-surface space-y-3">
              <h3 className="text-sm text-muted-foreground">Contents:</h3>
              <ul className="text-sm text-foreground space-y-2">
                <li>• Short explanation of offset bends</li>
                <li>• Formula cards with examples</li>
                <li>• Annotated visual guide</li>
                <li>• Multipliers reference table</li>
                <li>• 5-step bending procedure</li>
                <li>• Common mistakes to avoid</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <GuidedOffsetScreen onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}
