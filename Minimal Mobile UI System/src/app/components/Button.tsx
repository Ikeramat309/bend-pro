import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-transform",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        mark: "bg-mark text-mark-foreground hover:bg-mark/90",
        secondary: "bg-surface-2 text-foreground hover:bg-surface-2/80 border border-border",
        ghost: "text-foreground hover:bg-surface-2",
        outline: "border border-border text-foreground hover:bg-surface-2",
      },
      size: {
        default: "h-12 px-6 rounded-md",
        sm: "h-10 px-4 rounded-md",
        lg: "h-14 px-8 rounded-lg",
        icon: "h-12 w-12 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
