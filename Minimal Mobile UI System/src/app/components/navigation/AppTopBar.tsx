import { ReactNode } from "react";
import { Circle, HelpCircle } from "lucide-react";
import { Badge } from "../Badge";
import { Button } from "../Button";

interface AppTopBarProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  actions?: ReactNode;
  showHelp?: boolean;
}

export function AppTopBar({
  title = "Bend Pro",
  subtitle,
  badge,
  actions,
  showHelp = false,
}: AppTopBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-screen">
      <div className="flex items-center gap-3">
        <Circle className="w-6 h-6 text-primary" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg text-foreground">{title}</h1>
          {badge && <Badge variant="warning">{badge}</Badge>}
        </div>
        {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
      </div>
      <div className="flex items-center gap-2">
        {showHelp && (
          <Button variant="ghost" size="icon">
            <HelpCircle className="w-5 h-5" />
          </Button>
        )}
        {actions}
      </div>
    </div>
  );
}
