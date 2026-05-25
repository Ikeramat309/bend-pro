import { LucideIcon } from "lucide-react";

interface BendFamilyTileProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export function BendFamilyTile({ icon: Icon, label, onClick }: BendFamilyTileProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border border-border bg-surface hover:bg-surface-2 transition-colors active:scale-95"
    >
      <Icon className="w-8 h-8 text-primary" />
      <span className="text-sm text-foreground">{label}</span>
    </button>
  );
}
