export default function FounderLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 sm:px-6">
        <div className="h-40 animate-pulse rounded-xl border border-border bg-card" />
        <div className="h-32 animate-pulse rounded-xl bg-primary/20" />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="grid gap-4">
            <div className="h-40 animate-pulse rounded-xl border border-border bg-card" />
            <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />
          </div>
          <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />
        </div>
      </div>
    </main>
  );
}
