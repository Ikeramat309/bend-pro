import { useState } from "react";
import { Button } from "./Button";
import { EditSetupSheet } from "./EditSetupSheet";

export function EditSetupSheetDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="space-y-6 max-w-md w-full">
        <div className="text-center space-y-2">
          <h1 className="text-2xl text-foreground">Edit Setup Bottom Sheet</h1>
          <p className="text-sm text-muted-foreground">
            Click the button below to open the setup bottom sheet
          </p>
        </div>

        <Button variant="primary" className="w-full" onClick={() => setIsOpen(true)}>
          Open Setup
        </Button>

        <div className="p-4 rounded-lg border border-border bg-surface space-y-3">
          <h3 className="text-sm text-muted-foreground">Features:</h3>
          <ul className="text-sm text-foreground space-y-2">
            <li>• Conduit type and size selection</li>
            <li>• Current bender display with change option</li>
            <li>• Imperial/Metric unit toggle</li>
            <li>• Rounding precision selector</li>
            <li>• Save as default toggle</li>
            <li>• Cancel/Apply buttons</li>
          </ul>
        </div>

        <EditSetupSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onApply={(setup) => {
            console.log("Setup applied:", setup);
            setIsOpen(false);
          }}
        />
      </div>
    </div>
  );
}
