import { Button } from "./Button";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Badge } from "./Badge";
import { ChevronRight, Circle } from "lucide-react";

export function SettingsView({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-border bg-screen">
        <div className="flex items-center gap-3">
          <Circle className="w-6 h-6 text-primary" />
          <h1 className="text-lg text-foreground">Settings</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={onBack}>
          Done
        </Button>
      </header>

      {/* Content */}
      <main className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Conduit Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Conduit Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex flex-col items-start gap-1">
                <span className="text-base text-foreground">Conduit Type</span>
                <span className="text-sm text-muted-foreground">¾" EMT</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex flex-col items-start gap-1">
                <span className="text-base text-foreground">Bender Shoe</span>
                <span className="text-sm text-muted-foreground">Shoe 1</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>

        {/* Units */}
        <Card>
          <CardHeader>
            <CardTitle>Units & Precision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex flex-col items-start gap-1">
                <span className="text-base text-foreground">Measurement System</span>
                <span className="text-sm text-muted-foreground">Imperial (inches)</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex flex-col items-start gap-1">
                <span className="text-base text-foreground">Precision</span>
                <span className="text-sm text-muted-foreground">1/16"</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>

        {/* Mode */}
        <Card>
          <CardHeader>
            <CardTitle>Interface Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="text-base text-foreground">Field Mode</span>
                <Badge variant="primary">Active</Badge>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="pt-2 border-t border-border">
              <button className="w-full flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="text-base text-foreground">Guided Mode</span>
                  <Badge variant="default">For students</Badge>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="bg-surface/50">
          <CardContent className="pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="text-sm text-foreground">1.0.0-beta</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Build</span>
              <span className="text-sm text-foreground">2024.01</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-2 pt-4">
          <Button variant="outline" className="w-full">
            Export saved setups
          </Button>
          <Button variant="outline" className="w-full">
            Reset to defaults
          </Button>
        </div>
      </main>
    </div>
  );
}
