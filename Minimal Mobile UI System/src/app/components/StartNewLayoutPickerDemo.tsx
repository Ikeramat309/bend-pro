import { useState } from "react";
import { Button } from "./Button";
import { StartNewLayoutPicker } from "./layout/StartNewLayoutPicker";

export function StartNewLayoutPickerDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="space-y-6 max-w-md w-full">
        <div className="text-center space-y-2">
          <h1 className="text-2xl text-foreground">Start New Layout Picker</h1>
          <p className="text-sm text-muted-foreground">
            Command menu-style picker for bend types
          </p>
        </div>

        <Button variant="primary" className="w-full" onClick={() => setIsOpen(true)}>
          Open Layout Picker
        </Button>

        {selectedType && (
          <div className="p-4 rounded-lg border border-border bg-surface space-y-2">
            <h3 className="text-sm text-muted-foreground">Last Selected:</h3>
            <p className="text-base text-foreground">{selectedType}</p>
          </div>
        )}

        <div className="p-4 rounded-lg border border-border bg-surface space-y-3">
          <h3 className="text-sm text-muted-foreground">Features:</h3>
          <ul className="text-sm text-foreground space-y-2">
            <li>• Search by name, family, or description</li>
            <li>• Grouped by bend family</li>
            <li>• Only Basic Offset active (others coming soon)</li>
            <li>• Compact list items (not huge cards)</li>
            <li>• Fast, keyboard-friendly interface</li>
            <li>• Clean empty state</li>
          </ul>
        </div>

        <StartNewLayoutPicker
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelect={(id) => {
            setSelectedType(id);
            setIsOpen(false);
          }}
        />
      </div>
    </div>
  );
}
