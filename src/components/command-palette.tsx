"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Command, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type CommandPaletteItem = {
  id: string;
  label: string;
  description: string;
  keywords?: string[];
  action: () => void;
};

export function CommandPalette({ commands }: { commands: CommandPaletteItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return commands;
    return commands.filter((command) =>
      [command.label, command.description, ...(command.keywords ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [commands, query]);

  function runCommand(command: CommandPaletteItem) {
    command.action();
    setQuery("");
    setOpen(false);
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Command className="h-4 w-4" />
        Command
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-slate-950/35 p-4 backdrop-blur-sm">
          <div className="mx-auto mt-12 w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border p-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search commands"
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close command palette">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-2">
              {filteredCommands.map((command, index) => (
                <button
                  key={command.id}
                  className={cn(
                    "flex min-h-14 w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-muted",
                    index === 0 ? "bg-muted/70" : undefined
                  )}
                  onClick={() => runCommand(command)}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{command.label}</span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">{command.description}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
              {filteredCommands.length === 0 ? (
                <div className="flex min-h-28 items-center justify-center text-sm text-muted-foreground">
                  No commands match this search.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
