interface MarkingGuideProps {
  mark1Label?: string;
  mark2Label: string;
  distance: string;
  unit?: string;
}

export function MarkingGuide({
  mark1Label = "Mark 1",
  mark2Label,
  distance,
  unit = "in",
}: MarkingGuideProps) {
  return (
    <div className="relative py-8 px-4">
      {/* Pipe */}
      <div className="relative h-16 bg-gradient-to-b from-surface-2 to-surface border-y border-border rounded-sm">
        {/* Mark 1 */}
        <div className="absolute left-8 top-0 bottom-0 flex flex-col items-center">
          <div className="w-1 h-full bg-mark"></div>
          <div className="absolute -top-8 flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">{mark1Label}</span>
            <span className="text-sm text-foreground">Start</span>
          </div>
        </div>

        {/* Mark 2 */}
        <div className="absolute right-8 top-0 bottom-0 flex flex-col items-center">
          <div className="w-1 h-full bg-mark"></div>
          <div className="absolute -top-8 flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">{mark2Label}</span>
            <span className="text-sm text-foreground">+{distance}{unit === "in" ? '"' : unit}</span>
          </div>
        </div>

        {/* Distance Indicator */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2">
          {/* Line */}
          <div className="h-px bg-primary/30 relative">
            <div className="absolute left-0 top-1/2 w-1 h-1 -translate-y-1/2 bg-primary rounded-full"></div>
            <div className="absolute right-0 top-1/2 w-1 h-1 -translate-y-1/2 bg-primary rounded-full"></div>
          </div>
          {/* Distance Badge */}
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-screen border border-primary/30 rounded-full">
            <span className="text-sm text-primary tabular-nums">{distance}{unit === "in" ? '"' : unit}</span>
          </div>
        </div>
      </div>

      {/* Pipe texture lines */}
      <div className="absolute left-0 right-0 top-8 bottom-8 pointer-events-none">
        <div className="h-full flex items-center justify-around px-4 opacity-20">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-px h-12 bg-border"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
