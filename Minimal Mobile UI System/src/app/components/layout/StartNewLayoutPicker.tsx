import { useState } from "react";
import { X, Search } from "lucide-react";
import { Button } from "../Button";
import { Input } from "../Input";
import { BendTypeItem } from "./BendTypeItem";

interface BendType {
  id: string;
  name: string;
  description?: string;
  family: string;
  isActive: boolean;
}

interface StartNewLayoutPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bendTypeId: string) => void;
}

export function StartNewLayoutPicker({
  isOpen,
  onClose,
  onSelect,
}: StartNewLayoutPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const bendTypes: BendType[] = [
    // Offset
    { id: "basic-offset", name: "Basic Offset", description: "Clear obstruction. Stay parallel.", family: "Offset", isActive: true },
    { id: "parallel-offset", name: "Parallel Offset", family: "Offset", isActive: false },
    { id: "rolling-offset", name: "Rolling Offset", family: "Offset", isActive: false },
    { id: "box-offset", name: "Box Offset", family: "Offset", isActive: false },

    // 90s
    { id: "stub-up-90", name: "Stub-Up 90", description: "Vertical rise from surface.", family: "90s", isActive: false },
    { id: "back-to-back-90", name: "Back-to-Back 90", family: "90s", isActive: false },
    { id: "kick-90", name: "Kick 90", family: "90s", isActive: false },

    // Saddles
    { id: "3-point-saddle", name: "3-Point Saddle", description: "Route over obstacle.", family: "Saddles", isActive: false },
    { id: "4-point-saddle", name: "4-Point Saddle", family: "Saddles", isActive: false },

    // Large / Advanced
    { id: "segment-bend", name: "Segment Bend", family: "Large / Advanced", isActive: false },
    { id: "hydraulic-layout", name: "Hydraulic Layout", family: "Large / Advanced", isActive: false },
  ];

  // Filter by search query
  const filteredTypes = searchQuery
    ? bendTypes.filter(
        (type) =>
          type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          type.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
          type.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : bendTypes;

  // Group by family
  const families = ["Offset", "90s", "Saddles", "Large / Advanced"];
  const groupedTypes = families.map((family) => ({
    family,
    types: filteredTypes.filter((type) => type.family === family),
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-screen">
        <h1 className="text-lg text-foreground">Start New Layout</h1>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 py-4 border-b border-border bg-screen">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search bend type, example: offset, saddle, 90"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-20">
        <div className="max-w-md mx-auto">
          {groupedTypes.map(({ family, types }) => {
            if (types.length === 0) return null;

            return (
              <div key={family} className="border-b border-border">
                {/* Family Header */}
                <div className="px-4 py-3 bg-surface/50">
                  <h2 className="text-sm text-muted-foreground font-medium">
                    {family}
                  </h2>
                </div>

                {/* Bend Types */}
                <div className="divide-y divide-border">
                  {types.map((type) => (
                    <BendTypeItem
                      key={type.id}
                      name={type.name}
                      description={type.description}
                      isActive={type.isActive}
                      onClick={() => {
                        onSelect(type.id);
                        onClose();
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {filteredTypes.length === 0 && (
            <div className="px-4 py-12 text-center">
              <p className="text-base text-muted-foreground">
                No bend types found matching &quot;{searchQuery}&quot;
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
