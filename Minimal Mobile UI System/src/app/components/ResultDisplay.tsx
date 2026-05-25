import { forwardRef, HTMLAttributes } from "react";
import { cn } from "../utils";

interface ResultDisplayProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  unit?: string;
  variant?: "primary" | "mark";
}

const ResultDisplay = forwardRef<HTMLDivElement, ResultDisplayProps>(
  ({ label, value, unit, variant = "primary", className, ...props }, ref) => {
    const colorClass = variant === "mark" ? "text-mark" : "text-primary";

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-2 rounded-lg border border-border bg-surface p-6",
          className
        )}
        {...props}
      >
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-5xl tabular-nums", colorClass)}>
            {value}
          </span>
          {unit && (
            <span className="text-2xl text-muted-foreground">{unit}</span>
          )}
        </div>
      </div>
    );
  }
);

ResultDisplay.displayName = "ResultDisplay";

export { ResultDisplay };
