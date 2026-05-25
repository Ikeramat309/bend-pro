import { Button } from "../Button";

interface AngleSelectorProps {
  angles: number[];
  selected: number;
  onSelect: (angle: number) => void;
}

export function AngleSelector({ angles, selected, onSelect }: AngleSelectorProps) {
  return (
    <div className="flex gap-2">
      {angles.map((angle) => (
        <Button
          key={angle}
          variant={selected === angle ? "primary" : "secondary"}
          size="sm"
          onClick={() => onSelect(angle)}
          className="flex-1"
        >
          {angle}°
        </Button>
      ))}
    </div>
  );
}
