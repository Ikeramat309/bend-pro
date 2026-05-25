interface AnnotatedMarkingGuideProps {
  spacing: string;
  shrink: string;
  unit?: string;
}

export function AnnotatedMarkingGuide({
  spacing,
  shrink,
  unit = "in",
}: AnnotatedMarkingGuideProps) {
  return (
    <div className="relative py-10 px-4">
      {/* Pipe */}
      <div className="relative h-16 bg-gradient-to-b from-surface-2 to-surface border-y border-border rounded-sm">
        {/* Mark 1 */}
        <div className="absolute left-8 top-0 bottom-0 flex flex-col items-center">
          <div className="w-1 h-full bg-mark"></div>
          <div className="absolute -top-10 flex flex-col items-center gap-1">
            <div className="px-2 py-1 rounded bg-mark/20 border border-mark/30">
              <span className="text-sm text-mark font-medium">Mark 1</span>
            </div>
            <span className="text-xs text-muted-foreground">First bend</span>
          </div>
        </div>

        {/* Mark 2 */}
        <div className="absolute right-8 top-0 bottom-0 flex flex-col items-center">
          <div className="w-1 h-full bg-mark"></div>
          <div className="absolute -top-10 flex flex-col items-center gap-1">
            <div className="px-2 py-1 rounded bg-mark/20 border border-mark/30">
              <span className="text-sm text-mark font-medium">Mark 2</span>
            </div>
            <span className="text-xs text-muted-foreground">Second bend</span>
          </div>
        </div>

        {/* Spacing Indicator */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2">
          {/* Line */}
          <div className="h-px bg-primary/30 relative">
            <div className="absolute left-0 top-1/2 w-1 h-1 -translate-y-1/2 bg-primary rounded-full"></div>
            <div className="absolute right-0 top-1/2 w-1 h-1 -translate-y-1/2 bg-primary rounded-full"></div>
          </div>
          {/* Spacing Badge */}
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-screen border border-primary/30 rounded-full">
            <span className="text-sm text-primary font-medium">
              Spacing: {spacing}{unit === "in" ? '"' : unit}
            </span>
          </div>
        </div>
      </div>

      {/* Shrink Annotation */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <div className="px-3 py-2 rounded-lg border border-border bg-surface">
          <span className="text-sm text-muted-foreground">Shrink: </span>
          <span className="text-base text-foreground font-medium">
            {shrink}{unit === "in" ? '"' : unit}
          </span>
        </div>
      </div>

      {/* Pipe texture lines */}
      <div className="absolute left-0 right-0 top-10 bottom-10 pointer-events-none">
        <div className="h-full flex items-center justify-around px-4 opacity-20">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-px h-12 bg-border"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
