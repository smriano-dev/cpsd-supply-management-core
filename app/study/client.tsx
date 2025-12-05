"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { getTopicsForExam } from "../lib/questions";
import type { getTopicMasteryForUser } from "../lib/progress";

const EXAMS = [
  { id: "core", label: "Supply Management Core" },
  { id: "diversity", label: "Supplier Diversity Module" },
] as const;

type ExamId = (typeof EXAMS)[number]["id"];
type TopicProgress = Awaited<ReturnType<typeof getTopicMasteryForUser>> | null;

function getExamFromParams(searchParams: ReturnType<typeof useSearchParams>): ExamId {
  const value = searchParams.get("exam");
  if (value === "diversity") return "diversity";
  return "core";
}

type Props = {
  topicProgress: TopicProgress;
};

export default function StudyPageClient({ topicProgress }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentExam = getExamFromParams(searchParams);
  const topics = getTopicsForExam(currentExam);
  
  const currentProgress = currentExam === "core" ? topicProgress?.core : topicProgress?.diversity;

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

          <div className="flex gap-3">
            <a
              href="/study/mock-exam"
              className="rounded-full border border-purple-700 bg-purple-900/30 px-4 py-2 text-sm text-purple-100 hover:border-purple-500 hover:bg-purple-900/50 transition font-semibold"
            >
              🎯 Mock Exam
            </a>

            <a
              href="/dashboard"
              className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:border-emerald-500 transition"
            >
              Dashboard
            </a>

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
          </div>
        </header>

        {/* Progress Bar */}
        {currentProgress && (
          <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-300">Module Progress</span>
              <span className="text-sm font-bold text-sky-400">
                {currentProgress.mastered}/{currentProgress.total} topics mastered
              </span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 transition-all"
                style={{ width: `${(currentProgress.mastered / currentProgress.total) * 100}%` }}
              />
            </div>
          </section>
        )}

        {/* Topic list */}
        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {topics.map((topic) => {
              const topicInfo = currentProgress?.topics.find((t) => t.id === topic.id);
              const isMastered = topicInfo?.isMastered || false;
              const bestScore = topicInfo?.bestScore || 0;

              return (
                <div
                  key={topic.id}
                  className={`group rounded-2xl border transition cursor-pointer relative overflow-hidden ${
                    isMastered
                      ? "border-green-600 bg-green-900/20 hover:border-green-500 hover:bg-green-900/30"
                      : "border-slate-800 bg-slate-900/70 hover:border-sky-500 hover:bg-sky-500/10"
                  }`}
                >
                  {/* Master badge */}
                  {isMastered && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                      ✓ Mastered
                    </div>
                  )}

                  <a
                    href={`/study/topic/${topic.id}?exam=${currentExam}`}
                    className="block p-4"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 group-hover:text-sky-300">
                      {currentExam === "core" ? "Core Role" : "Supplier Diversity"}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-slate-50 group-hover:text-sky-50">
                      {topic.label}
                    </h2>
                    {topic.description && (
                      <p className="mt-1 text-sm text-slate-400">{topic.description}</p>
                    )}
                    <p className="mt-3 text-xs font-medium text-sky-400 group-hover:text-sky-300">
                      {isMastered ? "Retake for more XP →" : "Start questions →"}
                    </p>
                  </a>

                  {/* Score bar */}
                  {bestScore > 0 && (
                    <div className="px-4 pb-4 border-t border-slate-700/50">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-slate-400">Best score</span>
                        <span className={`font-bold ${
                          isMastered ? "text-green-400" : "text-slate-300"
                        }`}>
                          {bestScore}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            isMastered ? "bg-green-600" : "bg-sky-600"
                          }`}
                          style={{ width: `${bestScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
