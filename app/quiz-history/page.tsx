import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";

export default async function QuizHistoryPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      quizAttempts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/api/auth/signin");
  }

  const attempts = user.quizAttempts;

  // Calculate stats
  const mockExams = attempts.filter((a) => a.isMockExam);
  const topicQuizzes = attempts.filter((a) => !a.isMockExam);

  const avgMockScore =
    mockExams.length > 0
      ? Math.round(mockExams.reduce((sum, a) => sum + (a.score || 0), 0) / mockExams.length)
      : 0;

  const avgTopicScore =
    topicQuizzes.length > 0
      ? Math.round(topicQuizzes.reduce((sum, a) => sum + (a.score || 0), 0) / topicQuizzes.length)
      : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Quiz History</h1>
            <p className="text-slate-400 mt-2">Review all your quiz attempts and track improvement</p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:border-sky-500 transition"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">Total Attempts</p>
            <p className="text-3xl font-bold mt-2">{attempts.length}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">Mock Exams</p>
            <p className="text-3xl font-bold mt-2">{mockExams.length}</p>
            {mockExams.length > 0 && <p className="text-xs text-sky-400 mt-1">Avg: {avgMockScore}%</p>}
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">Topic Quizzes</p>
            <p className="text-3xl font-bold mt-2">{topicQuizzes.length}</p>
            {topicQuizzes.length > 0 && <p className="text-xs text-sky-400 mt-1">Avg: {avgTopicScore}%</p>}
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">Best Score</p>
            <p className="text-3xl font-bold mt-2">
              {attempts.length > 0 ? Math.max(...attempts.map((a) => a.score || 0)) : "—"}%
            </p>
          </div>
        </div>

        {/* Quiz List */}
        {attempts.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
            <p className="text-slate-400 mb-4">No quiz attempts yet. Start studying to see your history!</p>
            <Link
              href="/study"
              className="inline-block rounded-md bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 font-medium transition"
            >
              Go to Study
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">All Attempts</h2>
            <div className="space-y-3">
              {attempts.map((attempt) => {
                const date = new Date(attempt.createdAt);
                const dateStr = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const timeStr = date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const scoreColor =
                  (attempt.score || 0) >= 80
                    ? "text-green-400"
                    : (attempt.score || 0) >= 70
                    ? "text-amber-400"
                    : "text-red-400";

                return (
                  <Link
                    key={attempt.id}
                    href={`/quiz-history/${attempt.id}`}
                    className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:border-sky-600 hover:bg-slate-900/60 p-4 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-semibold">
                            {attempt.isMockExam
                              ? `📋 Mock Exam (${attempt.examId})`
                              : `📚 ${attempt.topicId || "Quiz"} (${attempt.examId})`}
                          </span>
                          <span className="text-xs text-slate-500">
                            {dateStr} at {timeStr}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>
                            {attempt.correctAnswers}/{attempt.totalQuestions} correct
                          </span>
                          {attempt.timeSpent && (
                            <span>
                              ⏱️ {Math.floor(attempt.timeSpent / 60)} min
                              {Math.round(attempt.timeSpent % 60) > 0
                                ? ` ${Math.round(attempt.timeSpent % 60)}s`
                                : ""}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`text-4xl font-bold ${scoreColor}`}>{attempt.score || "—"}%</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {attempt.isMockExam ? "Mock Exam" : "Topic Quiz"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
