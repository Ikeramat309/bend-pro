import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  unit?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", unit, ...props }, ref) => {
    if (unit) {
      return (
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-16 w-full rounded-lg border border-input bg-input-background px-4 pr-12 text-2xl text-foreground transition-colors",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground">
            {unit}
          </span>
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-16 w-full rounded-lg border border-input bg-input-background px-4 text-2xl text-foreground transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
