import { Settings } from "lucide-react";

interface SetupChipProps {
  conduitType: string;
  conduitSize: string;
  bender: string;
  onClick: () => void;
}

export function SetupChip({ conduitType, conduitSize, bender, onClick }: SetupChipProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface hover:bg-surface-2 transition-colors"
    >
      <Settings className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        {conduitSize} {conduitType} • {bender}
      </span>
    </button>
  );
}
