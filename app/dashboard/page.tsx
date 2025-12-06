// app/dashboard/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTopicMasteryForUser } from "@/app/lib/progress";
import { BADGES } from "@/app/lib/badges";
import Link from "next/link";

type QuizAttempt = {
  id: string;
  examId: string;
  topicId: string | null;
  isMockExam: boolean;
  score: number | null;
  correctAnswers: number;
  totalQuestions: number;
  createdAt: string; // ISO string
};

type DashboardUser = {
  id: string;
  email: string;
  name: string;
  xp: number;
  streakCount: number;
  badges: string; // JSON string
  quizAttempts: QuizAttempt[];
};

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  // Temporary no-DB user object
  const user: DashboardUser = {
    id: "dummy-user-id",
    email: session.user.email!,
    name: session.user.name ?? "",
    xp: 0,
    streakCount: 0,
    badges: "[]", // no badges yet
    quizAttempts: [], // empty history for now
  };

  // Parse badges from JSON string
  const badges = JSON.parse(user.badges || "[]") as string[];

  // Calculate stats
  const totalAttempts = user.quizAttempts.length;
  const averageScore =
    totalAttempts > 0
      ? Math.round(
          user.quizAttempts.reduce(
            (sum, a) => sum + (a.score ?? 0),
            0,
          ) / totalAttempts,
        )
      : 0;

  // Topic progress (no-DB helper should safely return a structure with totals)
  const progress = await getTopicMasteryForUser(user.id);

  const coreCompletion =
    progress.core.total > 0
      ? Math.round((progress.core.mastered / progress.core.total) * 100)
      : 0;

  const diversityCompletion =
    progress.diversity.total > 0
      ? Math.round(
          (progress.diversity.mastered / progress.diversity.total) * 100,
        )
      : 0;

  const coreBarWidth =
    progress.core.total > 0
      ? (progress.core.mastered / progress.core.total) * 100
      : 0;

  const diversityBarWidth =
    progress.diversity.total > 0
      ? (progress.diversity.mastered / progress.diversity.total) * 100
      : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">
                Welcome back, {user.name || "CPSD Student"}!
              </h1>
              <p className="text-slate-400 mt-1">{user.email}</p>
            </div>
            <div className="text-right space-y-2">
              <div>
                <p className="text-5xl font-bold text-sky-400">{user.xp}</p>
                <p className="text-sm text-slate-400">Total XP Earned</p>
              </div>
              <Link
                href="/study-plan"
                className="inline-block rounded-full bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 text-sm font-medium transition"
              >
                📋 Study Plan
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Quiz Attempts */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400 uppercase tracking-wide">
              Quiz Attempts
            </p>
            <p className="text-3xl font-bold mt-2">{totalAttempts}</p>
            <p className="text-xs text-slate-500 mt-1">Total completed</p>
          </div>

          {/* Average Score */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400 uppercase tracking-wide">
              Average Score
            </p>
            <p className="text-3xl font-bold mt-2">{averageScore}%</p>
            <p className="text-xs text-slate-500 mt-1">Across all quizzes</p>
          </div>

          {/* Streak */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400 uppercase tracking-wide">
              {user.streakCount > 0 ? "🔥 Study Streak" : "Study Streak"}
            </p>
            <p className="text-3xl font-bold mt-2">{user.streakCount}</p>
            <p className="text-xs text-slate-500 mt-1">
              {user.streakCount === 0
                ? "Start studying today"
                : user.streakCount === 1
                ? "Day in a row"
                : "Days in a row"}
            </p>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(BADGES).map(([badgeName, badgeInfo]) => {
              const isEarned = badges.includes(badgeName);
              return (
                <div
                  key={badgeName}
                  className={`rounded-xl border p-4 transition ${
                    isEarned
                      ? "border-amber-600 bg-amber-900/30"
                      : "border-slate-700 bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {badgeInfo.emoji}
                    </span>
                    <div>
                      <p
                        className={`font-semibold ${
                          isEarned
                            ? "text-amber-300"
                            : "text-slate-400"
                        }`}
                      >
                        {badgeName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {badgeInfo.description}
                      </p>
                    </div>
                  </div>
                  {isEarned && (
                    <div className="mt-2 text-xs font-bold text-amber-400">
                      ✓ Earned
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Exam Progress */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Module Progress</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Core Progress */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Supply Management Core
                </h3>
                <div className="text-right">
                  <p className="text-2xl font-bold text-sky-400">
                    {progress.core.mastered}/{progress.core.total}
                  </p>
                  <p className="text-xs text-slate-400">
                    Topics mastered
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">
                    Completion
                  </span>
                  <span className="text-sm font-bold text-sky-400">
                    {coreCompletion}%
                  </span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-600 transition-all"
                    style={{ width: `${coreBarWidth}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {progress.core.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between text-sm p-2 rounded bg-slate-800/40"
                  >
                    <span className="text-slate-300">
                      {topic.label}
                    </span>
                    <span
                      className={
                        topic.isMastered
                          ? "text-green-400 font-bold"
                          : "text-slate-500"
                      }
                    >
                      {topic.isMastered
                        ? "✓ Mastered"
                        : `${topic.bestScore}%`}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/study?exam=core"
                className="block mt-4 text-center rounded-md bg-sky-600 hover:bg-sky-700 text-white py-2 text-sm font-medium transition"
              >
                Study Core
              </Link>
            </div>

            {/* Diversity Progress */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Supplier Diversity
                </h3>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-400">
                    {progress.diversity.mastered}/
                    {progress.diversity.total}
                  </p>
                  <p className="text-xs text-slate-400">
                    Topics mastered
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">
                    Completion
                  </span>
                  <span className="text-sm font-bold text-purple-400">
                    {diversityCompletion}%
                  </span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 transition-all"
                    style={{ width: `${diversityBarWidth}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {progress.diversity.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between text-sm p-2 rounded bg-slate-800/40"
                  >
                    <span className="text-slate-300">
                      {topic.label}
                    </span>
                    <span
                      className={
                        topic.isMastered
                          ? "text-green-400 font-bold"
                          : "text-slate-500"
                      }
                    >
                      {topic.isMastered
                        ? "✓ Mastered"
                        : `${topic.bestScore}%`}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/study?exam=diversity"
                className="block mt-4 text-center rounded-md bg-purple-600 hover:bg-purple-700 text-white py-2 text-sm font-medium transition"
              >
                Study Diversity
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Quiz Attempts */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Recent Quiz Attempts
            </h2>
            <div className="flex gap-4">
              <Link
                href="/quiz-history"
                className="text-sky-400 hover:text-sky-300 text-sm font-medium"
              >
                View All History →
              </Link>
              <Link
                href="/study"
                className="text-slate-400 hover:text-slate-300 text-sm font-medium"
              >
                Continue Studying →
              </Link>
            </div>
          </div>

          {user.quizAttempts.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
              <p className="text-slate-400">
                No quiz attempts yet. Start studying to see your progress!
              </p>
              <Link
                href="/study"
                className="inline-block mt-4 rounded-full bg-sky-500 hover:bg-sky-400 text-white px-6 py-2 text-sm font-medium transition"
              >
                Start Studying
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {user.quizAttempts.map((attempt) => {
                const attemptDate = new Date(attempt.createdAt);
                return (
                  <Link
                    key={attempt.id}
                    href={`/quiz-history/${attempt.id}`}
                    className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 flex items-center justify-between hover:border-sky-700 hover:bg-slate-900/60 transition"
                  >
                    <div>
                      <p className="font-medium">
                        {attempt.isMockExam
                          ? "Mock Exam"
                          : `Topic: ${attempt.topicId ?? "N/A"}`}{" "}
                        ({attempt.examId})
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {attemptDate.toLocaleDateString()} at{" "}
                        {attemptDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-sky-400">
                        {attempt.score ?? "—"}%
                      </p>
                      <p className="text-xs text-slate-400">
                        {attempt.correctAnswers}/
                        {attempt.totalQuestions}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
