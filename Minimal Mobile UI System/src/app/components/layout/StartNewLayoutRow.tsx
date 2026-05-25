import { Plus } from "lucide-react";
import { Button } from "../Button";

interface StartNewLayoutRowProps {
  onStartNew: () => void;
}

export function StartNewLayoutRow({ onStartNew }: StartNewLayoutRowProps) {
  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-3 h-12"
      onClick={onStartNew}
    >
      <Plus className="w-5 h-5" />
      <span>Start new layout</span>
    </Button>
  );
}
