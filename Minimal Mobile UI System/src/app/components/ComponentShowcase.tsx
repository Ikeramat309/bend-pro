import { Button } from "./Button";
import { Input } from "./Input";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Badge } from "./Badge";
import { ResultDisplay } from "./ResultDisplay";
import { Settings, Menu, Plus, Trash2 } from "lucide-react";

export function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Typography */}
        <section>
          <h2 className="text-xl text-foreground mb-4">Typography</h2>
          <div className="space-y-2 bg-screen p-4 rounded-lg">
            <div className="text-5xl text-primary">48px Primary</div>
            <div className="text-2xl text-foreground">24px Foreground</div>
            <div className="text-base text-foreground">16px Foreground</div>
            <div className="text-sm text-muted-foreground">14px Muted</div>
          </div>
        </section>

        {/* Colors */}
        <section>
          <h2 className="text-xl text-foreground mb-4">Colors</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-background rounded-lg border border-border flex items-center justify-center">
                <span className="text-sm text-foreground">Background</span>
              </div>
              <div className="h-16 bg-screen rounded-lg flex items-center justify-center">
                <span className="text-sm text-foreground">Screen</span>
              </div>
              <div className="h-16 bg-surface rounded-lg flex items-center justify-center">
                <span className="text-sm text-foreground">Surface</span>
              </div>
              <div className="h-16 bg-surface-2 rounded-lg flex items-center justify-center">
                <span className="text-sm text-foreground">Surface 2</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-sm text-primary-foreground">Primary</span>
              </div>
              <div className="h-16 bg-mark rounded-lg flex items-center justify-center">
                <span className="text-sm text-mark-foreground">Mark</span>
              </div>
              <div className="h-16 bg-warning rounded-lg flex items-center justify-center">
                <span className="text-sm text-warning-foreground">Warning</span>
              </div>
              <div className="h-16 bg-success rounded-lg flex items-center justify-center">
                <span className="text-sm text-success-foreground">Success</span>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-xl text-foreground mb-4">Buttons</h2>
          <div className="space-y-4 bg-screen p-4 rounded-lg">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Primary (Actions)</p>
              <div className="flex gap-2 flex-wrap">
                <Button variant="primary">Calculate</Button>
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="lg">Large</Button>
                <Button variant="primary" size="icon">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Mark (Physical actions)</p>
              <div className="flex gap-2 flex-wrap">
                <Button variant="mark">Mark complete</Button>
                <Button variant="mark" size="sm">Mark</Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Secondary</p>
              <div className="flex gap-2 flex-wrap">
                <Button variant="secondary">Cancel</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">States</p>
              <div className="flex gap-2 flex-wrap">
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-xl text-foreground mb-4">Inputs</h2>
          <div className="space-y-4 bg-screen p-4 rounded-lg">
            <Input placeholder="Enter measurement" />
            <Input placeholder="0" unit="in" />
            <Input placeholder="0" unit="°" />
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-xl text-foreground mb-4">Badges</h2>
          <div className="flex gap-2 flex-wrap bg-screen p-4 rounded-lg">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Active</Badge>
            <Badge variant="mark">Mark</Badge>
            <Badge variant="warning">BETA</Badge>
            <Badge variant="success">Complete</Badge>
            <Badge variant="destructive">Error</Badge>
          </div>
        </section>

        {/* Result Displays */}
        <section>
          <h2 className="text-xl text-foreground mb-4">Result Displays</h2>
          <div className="space-y-4">
            <ResultDisplay label="Mark at" value="24" unit="in" variant="mark" />
            <ResultDisplay label="Bend angle" value="90" unit="°" variant="primary" />
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-xl text-foreground mb-4">Cards</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">Card content goes here.</p>
              </CardContent>
            </Card>

            <Card className="bg-surface-2">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Label</span>
                    <span className="text-base text-foreground">Value</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Label 2</span>
                    <span className="text-base text-foreground">Value 2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Icons */}
        <section>
          <h2 className="text-xl text-foreground mb-4">Icons (Lucide)</h2>
          <div className="flex gap-4 bg-screen p-4 rounded-lg">
            <Settings className="w-6 h-6 text-foreground" />
            <Menu className="w-6 h-6 text-foreground" />
            <Plus className="w-6 h-6 text-primary" />
            <Trash2 className="w-6 h-6 text-destructive" />
          </div>
        </section>
      </div>
    </div>
  );
}
