import { Card, CardContent } from "../Card";

interface FormulaCardProps {
  title: string;
  formula: string;
  example: {
    calculation: string;
    result: string;
  };
}

export function FormulaCard({ title, formula, example }: FormulaCardProps) {
  return (
    <Card className="bg-primary/10 border-primary/30">
      <CardContent className="p-5 space-y-4">
        <h3 className="text-base text-foreground font-medium">{title}</h3>

        {/* Formula */}
        <div className="p-3 rounded-lg bg-surface border border-border">
          <p className="text-sm text-primary font-mono">{formula}</p>
        </div>

        {/* Example */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Example</p>
          <div className="flex items-center gap-2">
            <span className="text-base text-foreground font-mono">{example.calculation}</span>
            <span className="text-muted-foreground">=</span>
            <span className="text-lg text-primary font-mono">{example.result}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
