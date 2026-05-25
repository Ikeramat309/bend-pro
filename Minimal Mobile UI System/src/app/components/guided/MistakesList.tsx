import { AlertTriangle } from "lucide-react";

interface MistakesListProps {
  mistakes: string[];
}

export function MistakesList({ mistakes }: MistakesListProps) {
  return (
    <div className="space-y-3">
      {mistakes.map((mistake, index) => (
        <div key={index} className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-base text-foreground">{mistake}</p>
        </div>
      ))}
    </div>
  );
}
