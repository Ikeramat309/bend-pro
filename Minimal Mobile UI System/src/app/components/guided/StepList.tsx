interface StepListProps {
  steps: string[];
}

export function StepList({ steps }: StepListProps) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            {index + 1}
          </div>
          <p className="text-base text-foreground pt-0.5">{step}</p>
        </div>
      ))}
    </div>
  );
}
