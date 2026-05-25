import { AppTopBar } from "../components/navigation/AppTopBar";
import { Button } from "../components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Badge } from "../components/Badge";
import { Lightbulb, BookOpen, AlertTriangle, Calculator, Settings } from "lucide-react";

interface GuideScreenProps {
  onOpenSettings?: () => void;
}

export function GuideScreen({ onOpenSettings }: GuideScreenProps) {
  const topics = [
    {
      icon: Lightbulb,
      title: "Getting Started",
      description: "Learn the basics of conduit bending",
      badge: "Beginner",
    },
    {
      icon: Calculator,
      title: "Formulas & Math",
      description: "Deductions, multipliers, and constants",
      badge: "Reference",
    },
    {
      icon: AlertTriangle,
      title: "Common Mistakes",
      description: "What to avoid and how to fix errors",
      badge: "Tips",
    },
    {
      icon: BookOpen,
      title: "Bend Types",
      description: "Complete guide to all bend families",
      badge: "Guide",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="relative">
        <AppTopBar title="Guide" />
        {onOpenSettings && (
          <div className="absolute top-3 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenSettings}
              className="w-9 h-9"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      <main className="flex-1 overflow-auto pb-20">
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Intro */}
          <Card className="bg-primary/10 border-primary/30">
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <GraduationCap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="text-base text-foreground">
                    Learn as you work
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This section provides reference material, formulas, and
                    guided lessons for electricians and students.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Topics */}
          <div className="space-y-3">
            {topics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <button
                  key={index}
                  className="w-full flex items-start gap-4 p-4 rounded-lg border border-border bg-surface hover:bg-surface-2 transition-colors text-left"
                >
                  <div className="p-2 rounded-lg bg-surface-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base text-foreground">{topic.title}</h3>
                      <Badge variant="default">{topic.badge}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {topic.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">90° deduction (¾" EMT)</span>
                <span className="text-base text-foreground tabular-nums">5"</span>
              </div>
              <div className="flex justify-between py-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Offset multiplier (30°)</span>
                <span className="text-base text-foreground tabular-nums">2.0</span>
              </div>
              <div className="flex justify-between py-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Saddle center (22½°)</span>
                <span className="text-base text-foreground tabular-nums">2.5×</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function GraduationCap(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
