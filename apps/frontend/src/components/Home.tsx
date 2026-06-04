import AccountOverview from "./AccountOverview";
import SearchNdSee from "./SearchNdSee";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto grid max-w-6xl items-stretch gap-8 px-5 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <SearchNdSee />
        <AccountOverview />
      </section>
    </main>
  );
}