import { ChevronRight } from "lucide-react";
import { Badge } from "../Badge";

interface BendTypeItemProps {
  name: string;
  description?: string;
  isActive: boolean;
  onClick?: () => void;
}

export function BendTypeItem({ name, description, isActive, onClick }: BendTypeItemProps) {
  return (
    <button
      onClick={isActive ? onClick : undefined}
      disabled={!isActive}
      className={`
        w-full flex items-center justify-between p-4
        transition-colors text-left
        ${
          isActive
            ? "hover:bg-surface-2 cursor-pointer"
            : "opacity-50 cursor-not-allowed"
        }
      `}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-base text-foreground">{name}</span>
            {!isActive && (
              <Badge variant="warning" className="text-xs px-2 py-0">
                Coming Soon
              </Badge>
            )}
          </div>
          {description && (
            <span className="text-sm text-muted-foreground">{description}</span>
          )}
        </div>
      </div>
      {isActive && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
    </button>
  );
}
