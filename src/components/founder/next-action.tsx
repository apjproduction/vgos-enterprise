import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import type { FounderNextAction } from "@/lib/founder-os";

export function NextAction({ action }: { action: FounderNextAction }) {
  return (
    <section className="rounded-xl border border-primary/30 bg-primary p-5 text-primary-foreground shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/15">
              <Play className="h-5 w-5" />
            </span>
            <p className="text-sm font-semibold uppercase text-primary-foreground/80">Next Action</p>
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">{action.label}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-primary-foreground/85">{action.detail}</p>
        </div>
        <Link
          href={action.href}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-primary shadow-sm hover:bg-white/90"
        >
          Start now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
