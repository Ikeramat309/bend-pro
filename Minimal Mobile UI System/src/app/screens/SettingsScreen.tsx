import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface SettingsScreenProps {
  onClose?: () => void;
}

export function SettingsScreen({ onClose }: SettingsScreenProps) {
  const settings = [
    {
      section: "Defaults",
      items: [
        { label: "Unit System", value: "Imperial (inches)" },
        { label: "Rounding", value: "1/16\"" },
        { label: "Default Conduit Type", value: "EMT" },
        { label: "Default Conduit Size", value: "¾\"" },
        { label: "Default Bender", value: "Generic Hand Bender" },
      ],
    },
    {
      section: "Appearance",
      items: [
        { label: "Theme", value: "Dark" },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top Bar */}
      <div className="flex items-center px-4 py-4 border-b border-border bg-screen">
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <h1 className="text-base font-medium text-foreground ml-2">Settings</h1>
      </div>

      <main className="flex-1 overflow-auto">
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {settings.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader>
                <CardTitle>{section.section}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    className="w-full flex items-center justify-between py-4 border-b border-border last:border-0 hover:bg-surface-2 transition-colors"
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-base text-foreground">{item.label}</span>
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* About */}
          <Card className="bg-surface/50">
            <CardContent className="pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Version</span>
                <span className="text-sm text-foreground">1.0.0-beta</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Build</span>
                <span className="text-sm text-foreground">2024.01</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
