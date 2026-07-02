import { PenLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FounderReflectionPrompt } from "@/lib/founder-os";

export function ReflectionCard({ prompts }: { prompts: FounderReflectionPrompt[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <PenLine className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">End-of-day Reflection</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {prompts.map((prompt) => (
          <label key={prompt.question} className="block rounded-lg border border-border bg-background p-3">
            <span className="text-sm font-semibold">{prompt.question}</span>
            <textarea
              className="mt-3 min-h-24 w-full resize-none rounded-md border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder={prompt.placeholder}
            />
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
