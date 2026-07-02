import Link from "next/link";
import { DailyWin } from "@/components/founder/daily-win";
import { DecisionCenter } from "@/components/founder/decision-center";
import { EnterprisePulse } from "@/components/founder/enterprise-pulse";
import { EnterpriseRadar } from "@/components/founder/enterprise-radar";
import { ExecutiveAttention } from "@/components/founder/executive-attention";
import { ExecutiveNarrative } from "@/components/founder/executive-narrative";
import { NextAction } from "@/components/founder/next-action";
import { OpportunityList } from "@/components/founder/opportunity-list";
import { ReflectionCard } from "@/components/founder/reflection-card";
import { RiskList } from "@/components/founder/risk-list";
import type { FounderWorkspaceData } from "@/lib/founder-os";

export function FounderShell({ data, embedded = false }: { data: FounderWorkspaceData; embedded?: boolean }) {
  const content = (
    <>
      <ExecutiveNarrative narrative={data.narrative} />
      <NextAction action={data.nextAction} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="grid gap-4">
          <DailyWin win={data.dailyWin} />
          <ExecutiveAttention priorities={data.priorities} />
          <DecisionCenter decisions={data.decisions} />
        </div>
        <div className="grid content-start gap-4">
          <EnterprisePulse pulse={data.pulse} />
          <EnterpriseRadar radar={data.radar} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <OpportunityList opportunities={data.opportunities} />
        <RiskList risks={data.risks} />
      </section>

      <ReflectionCard prompts={data.reflection} />
    </>
  );

  if (embedded) {
    return <div className="grid gap-4">{content}</div>;
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/90">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Founder OS</p>
            <p className="text-xs text-muted-foreground">Today, decisions, proof, and founder capacity.</p>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            <HeaderLink href="/founder" label="Today" active />
            <HeaderLink href="/executive-brief" label="Executive Brief" />
            <HeaderLink href="/work-queue" label="Work Queue" />
            <HeaderLink href="/decisions" label="Decisions" />
          </nav>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:py-6">
        {content}
      </div>
    </main>
  );
}

function HeaderLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground"
          : "rounded-md px-3 py-2 font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
      }
    >
      {label}
    </Link>
  );
}
