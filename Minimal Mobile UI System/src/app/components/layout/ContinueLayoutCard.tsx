import { Card, CardContent } from "../Card";
import { Button } from "../Button";

interface ContinueLayoutCardProps {
  bendType: string;
  description: string;
  lastResult: {
    label: string;
    value: string;
  };
  onContinue: () => void;
}

export function ContinueLayoutCard({
  bendType,
  description,
  lastResult,
  onContinue,
}: ContinueLayoutCardProps) {
  return (
    <Card className="bg-surface-2 border-primary/30">
      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base text-foreground">{bendType}</h3>
            <span className="text-xs text-muted-foreground">Last active</span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="flex items-baseline gap-2 py-3 px-4 rounded-lg bg-surface border border-border">
          <span className="text-sm text-muted-foreground">{lastResult.label}:</span>
          <span className="text-xl text-mark tabular-nums">{lastResult.value}</span>
        </div>

        <Button variant="primary" className="w-full" onClick={onContinue}>
          Open Workbench
        </Button>
      </CardContent>
    </Card>
  );
}
