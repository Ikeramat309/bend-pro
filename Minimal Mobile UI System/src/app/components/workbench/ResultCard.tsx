import { Card, CardContent } from "../Card";

interface ResultCardProps {
  label: string;
  value: string;
  unit?: string;
  subtitle: string;
  variant?: "primary" | "mark" | "default";
}

export function ResultCard({
  label,
  value,
  unit,
  subtitle,
  variant = "default",
}: ResultCardProps) {
  const valueColor =
    variant === "mark"
      ? "text-mark"
      : variant === "primary"
      ? "text-primary"
      : "text-foreground";

  return (
    <Card className="bg-surface-2">
      <CardContent className="p-5 space-y-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl tabular-nums ${valueColor}`}>{value}</span>
          {unit && <span className="text-xl text-muted-foreground">{unit}</span>}
        </div>
        <span className="text-sm text-muted-foreground">{subtitle}</span>
      </CardContent>
    </Card>
  );
}
