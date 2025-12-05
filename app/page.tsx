import Link from "next/link";
import AuthButton from "./components/AuthButton";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();

  // Redirect logged-in users to dashboard
  if (session?.user?.email) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-6xl space-y-10">
        {/* Top bar */}
        <header className="flex items-center justify-between text-xs text-slate-400 tracking-[0.25em] uppercase">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            CPSD • Supply Management Core
          </span>
          <AuthButton />
        </header>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Left: big hero card */}
          <section className="rounded-3xl bg-gradient-to-br from-emerald-400 via-sky-400 to-indigo-500 p-[1px]">
            <div className="rounded-3xl bg-slate-950/60 p-8 md:p-10 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <p className="text-xs font-semibold tracking-[0.2em] text-emerald-200 uppercase">
                  Your study hub
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold text-slate-50">
                  Be exam-ready, one focused
                  <br />
                  session at a time.
                </h1>
                <p className="text-sm text-slate-100/90 max-w-xl">
                  Practise timed questions, review your weak spots, and keep
                  everything organized in one place. Designed for busy
                  professionals and adult learners.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 text-slate-50 px-5 py-2.5 text-sm font-medium border border-slate-700 hover:bg-slate-800 transition">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-slate-900 text-xs">
                    ▶
                  </span>
                  Continue where I left off
                </button>
                <button className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-5 py-2.5 text-sm font-medium hover:bg-slate-200 transition">
                  Start a new practice set
                </button>
              </div>
            </div>
          </section>

          {/* Right: progress cards */}
          <section className="space-y-4">
            <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                  Overall progress
                </p>
                <span className="text-[11px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-400/40">
                  Target: exam-ready by June
                </span>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-4xl font-semibold">24%</p>
                <p className="text-xs text-slate-400 mb-2">
                  Chapters covered: <strong>6 / 25</strong>
                  <br />
                  Questions answered: <strong>180</strong>
                </p>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full w-[24%] bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 space-y-1">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
                  Timed exam sessions
                </p>
                <p className="text-2xl font-semibold">3</p>
                <p className="text-xs text-slate-400">
                  Last one: <strong>32 / 50 correct</strong>
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 space-y-1">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-sky-300 uppercase">
                  Flashcard drills
                </p>
                <p className="text-2xl font-semibold">5</p>
                <p className="text-xs text-slate-400">
                  Great for glossary terms
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Study modes */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Study modes
            </p>
            <p className="text-[11px] text-slate-500">
              Mix practice types to remember more and stay engaged.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Study by Topic */}
            <article className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-500/10 text-[11px] tracking-[0.16em] text-indigo-200 border border-indigo-500/40 uppercase">
                  Recommended
                </span>
                <h2 className="text-lg font-semibold">Study by Topic</h2>
                <p className="text-sm text-slate-400">
                  Work through Supply Management Core domains with shorter,
                  focused sets.
                </p>
              </div>
              <Link
                href="/study"
                className="mt-4 inline-flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200"
              >
                Start session →
              </Link>
            </article>

            {/* Timed Practice */}
            <article className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/10 text-[11px] tracking-[0.16em] text-amber-200 border border-amber-500/40 uppercase">
                  Exam mode
                </span>
                <h2 className="text-lg font-semibold">Timed Practice Exam</h2>
                <p className="text-sm text-slate-400">
                  Simulate the real exam with a timer, score, and exam-style
                  interface.
                </p>
              </div>
              <button className="mt-4 inline-flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200">
                Start session →
              </button>
            </article>

            {/* Review My Mistakes */}
            <article className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-[11px] tracking-[0.16em] text-emerald-200 border border-emerald-500/40 uppercase">
                  Master your weak spots
                </span>
                <h2 className="text-lg font-semibold">Review My Mistakes</h2>
                <p className="text-sm text-slate-400">
                  Go back to questions you missed and see explanations until
                  they stick.
                </p>
              </div>
              <button className="mt-4 inline-flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200">
                Start session →
              </button>
            </article>

            {/* Glossary */}
            <article className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-cyan-500/10 text-[11px] tracking-[0.16em] text-cyan-200 border border-cyan-500/40 uppercase">
                  Flashcards
                </span>
                <h2 className="text-lg font-semibold">Glossary &amp; Definitions</h2>
                <p className="text-sm text-slate-400">
                  Drill key CPSM / CPSD terms using flashcards and quick-hit
                  quizzes.
                </p>
              </div>
              <button className="mt-4 inline-flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200">
                Start session →
              </button>
            </article>
          </div>
        </section>

        {/* Tip bar */}
        <footer className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>
            Tip: Keep sessions short and focused. 25–40 minutes of practice +
            quick review is better than cramming.
          </span>
          <button className="text-sky-300 hover:text-sky-200">
            View suggested study plan →
          </button>
        </footer>
      </div>
    </main>
  );
}
