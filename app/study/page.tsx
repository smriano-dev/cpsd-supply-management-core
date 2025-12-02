"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { getTopicsForExam } from "../lib/questions";

const EXAMS = [
  { id: "core", label: "Supply Management Core" },
  { id: "diversity", label: "Supplier Diversity Module" },
] as const;

type ExamId = (typeof EXAMS)[number]["id"];

function getExamFromParams(searchParams: ReturnType<typeof useSearchParams>): ExamId {
  const value = searchParams.get("exam");
  if (value === "diversity") return "diversity";
  return "core";
}

export default function StudyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentExam = getExamFromParams(searchParams);
  const topics = getTopicsForExam(currentExam);

  function handleExamChange(e: ChangeEvent<HTMLSelectElement>) {
    const nextExam = e.target.value as ExamId;
    const params = new URLSearchParams(searchParams.toString());
    params.set("exam", nextExam);
    router.push(`/study?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-500">
              Study mode
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Study by Topic</h1>
            <p className="text-sm text-slate-400">
              Choose a topic and practise focused questions for the{" "}
              {currentExam === "core"
                ? "Supply Management Core exam."
                : "Supplier Diversity module."}
            </p>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="exam-select"
              className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400"
            >
              Exam
            </label>
            <select
              id="exam-select"
              value={currentExam}
              onChange={handleExamChange}
              className="w-full rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              {EXAMS.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Topic list */}
        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {topics.map((topic) => (
              <a
                key={topic.id}
                href={`/study/topic/${topic.id}?exam=${currentExam}`}
                className="group block rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-sky-500 hover:bg-sky-500/10 transition"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 group-hover:text-sky-300">
                  {topic.section}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-slate-50 group-hover:text-sky-50">
                  {topic.title}
                </h2>
                {topic.description && (
                  <p className="mt-1 text-sm text-slate-400">{topic.description}</p>
                )}
                <p className="mt-3 text-xs font-medium text-sky-400 group-hover:text-sky-300">
                  Start questions →
                </p>
              </a>
            ))}
          </div>

          {topics.length === 0 && (
            <p className="text-sm text-slate-400">
              No topics found for this exam yet. Double-check that{" "}
              <code className="rounded bg-slate-900 px-1 py-0.5 text-xs text-sky-300">
                getTopicsForExam
              </code>{" "}
              in <code className="rounded bg-slate-900 px-1 py-0.5 text-xs">app/lib/questions.ts</code>{" "}
              has entries for this exam.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
