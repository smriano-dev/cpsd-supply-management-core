// app/page.tsx
import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 md:px-8 md:py-16">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              CPSD • Supply Management Core
            </p>
            <h1 className="mt-1 text-2xl font-semibold md:text-3xl">
              CPSD Practice App
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-800/60 px-3 py-1 text-xs text-slate-300">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            <span>Study streak: <strong>3 days</strong></span>
          </div>
        </header>

        {/* Hero */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/90 via-cyan-500 to-sky-500 px-6 py-6 text-slate-900 shadow-lg shadow-emerald-900/40 md:px-8 md:py-7">
            <div className="relative z-10 flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-950/80">
                Your study hub
              </p>
              <h2 className="text-2xl font-semibold leading-snug md:text-3xl">
                Be exam-ready, one focused session at a time.
              </h2>
              <p className="max-w-md text-sm text-emerald-950/90 md:text-base">
                Practice timed questions, review your weak spots, and keep
                everything organized in one place. Designed for busy
                professionals and adult learners.
              </p>
              <div className="mt-1 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-slate-50 shadow-md shadow-slate-900/40 transition hover:bg-slate-900 hover:shadow-lg">
                  <span>▶</span>
                  <span>Continue where I left off</span>
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-slate-900/30 bg-white/60 px-4 py-2 text-sm font-medium text-slate-900 backdrop-blur-md transition hover:bg-white">
                  Start a new practice set
                </button>
              </div>
            </div>

            {/* soft decoration blob */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
            <div className="pointer-events-none absolute bottom-[-3rem] right-10 h-36 w-36 rounded-3xl border border-white/30 bg-sky-400/60 blur-xl" />
          </div>

          {/* Key stats card */}
          <div className="grid gap-4">
            <div className="rounded-3xl bg-slate-900/80 p-4 shadow-md shadow-black/40">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Overall progress
              </p>
              <div className="mt-3 flex items-baseline justify-between">
                <p className="text-3xl font-semibold">24%</p>
                <p className="text-xs text-slate-400">
                  Target: exam-ready by <span className="font-medium">June</span>
                </p>
              </div>
              {/* Progress bar */}
              <div className="mt-4 h-2 rounded-full bg-slate-800">
                <div className="h-2 w-[24%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
              </div>
              <div className="mt-3 flex justify-between text-xs text-slate-400">
                <span>Chapters covered: 6 / 25</span>
                <span>Questions answered: 180</span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <MiniStat
                label="Timed exam sessions"
                value="3"
                hint="Last one: 32/50 correct"
              />
              <MiniStat
                label="Flashcard drills"
                value="5"
                hint="Great for glossary terms"
              />
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
              Study modes
            </h3>
            <p className="text-xs text-slate-500">
              Mix practice types to remember more and stay engaged.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <ModeCard
              title="Study by Topic"
              description="Work through Supply Management Core domains with shorter, focused sets."
              tag="Recommended"
              color="from-violet-500/90 via-indigo-500 to-sky-500"
            />
            <ModeCard
              title="Timed Practice Exam"
              description="Simulate the real exam with a timer, score, and exam-style interface."
              tag="Exam mode"
              color="from-rose-500/90 via-orange-500 to-amber-400"
            />
            <ModeCard
              title="Review My Mistakes"
              description="Go back to questions you missed and see explanations until they stick."
              tag="Master your weak spots"
              color="from-emerald-500/90 via-teal-500 to-cyan-400"
            />
            <ModeCard
              title="Glossary & Definitions"
              description="Drill key CPSM / CPSD terms using flashcards and quick-hit quizzes."
              tag="Flashcards"
              color="from-sky-500/90 via-cyan-400 to-emerald-400"
            />
          </div>
        </section>

        {/* Bottom helper strip */}
        <section className="mt-4 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-xs text-slate-300 md:flex md:items-center md:justify-between">
          <p>
            Tip: Keep sessions short and focused. 25–40 minutes of practice +
            quick review is better than cramming.
          </p>
          <button className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-[11px] font-medium text-slate-100 transition hover:bg-slate-700 md:mt-0">
            View suggested study plan
          </button>
        </section>
      </div>
    </main>
  );
}

// Small helper components

type MiniStatProps = {
  label: string;
  value: string;
  hint: string;
};

function MiniStat({ label, value, hint }: MiniStatProps) {
  return (
    <div className="rounded-2xl bg-slate-900/80 p-4 shadow-md shadow-black/30">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </div>
  );
}

type ModeCardProps = {
  title: string;
  description: string;
  tag: string;
  color: string; // Tailwind gradient classes
};

function ModeCard({ title, description, tag, color }: ModeCardProps) {
  return (
    <button className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-[1px] text-left shadow-md shadow-black/40 transition hover:-translate-y-[2px] hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 blur-xl transition group-hover:opacity-60" />
      <div className="relative flex h-full flex-col justify-between rounded-[1.4rem] bg-slate-950/90 p-4">
        <div>
          <span
            className={`inline-flex items-center rounded-full bg-gradient-to-r ${color} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-950`}
          >
            {tag}
          </span>
          <h4 className="mt-3 text-base font-semibold text-slate-50">
            {title}
          </h4>
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>
        <p className="mt-3 text-xs font-medium text-sky-300">
          Start session →
        </p>
      </div>
    </button>
  );
}
