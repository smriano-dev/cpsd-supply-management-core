import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { coreQuestions, diversityQuestions, getTopicsForExam } from "@/app/lib/questions";
import Link from "next/link";

type Props = {
  params: Promise<{ attemptId: string }>;
};

export default async function QuizReviewPage({ params }: Props) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/api/auth/signin");
  }

  const { attemptId } = await params;

  // Get the quiz attempt with results
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: { results: true },
  });

  if (!attempt || attempt.userId !== user.id) {
    redirect("/quiz-history");
  }

  // Get all questions for this exam
  const allQuestions = attempt.examId === "diversity" ? diversityQuestions : coreQuestions;

  // Get results indexed by question ID
  const resultsByQuestion = new Map(attempt.results.map((r) => [r.questionId, r]));

  // Get the attempted questions in order
  const attemptedQuestions = attempt.results
    .map((result) => {
      const question = allQuestions.find((q) => q.id === result.questionId);
      return question ? { ...question, result } : null;
    })
    .filter((q) => q !== null);

  // Calculate stats by topic
  const topicStats = new Map<
    string,
    {
      correct: number;
      total: number;
      questions: any[];
    }
  >();

  attemptedQuestions.forEach((item) => {
    const topic = item.topicId;
    if (!topicStats.has(topic)) {
      topicStats.set(topic, { correct: 0, total: 0, questions: [] });
    }
    const stats = topicStats.get(topic)!;
    stats.total += 1;
    if (item.result.isCorrect) stats.correct += 1;
    stats.questions.push(item);
  });

  // Sort topics by performance (worst first)
  const sortedTopics = Array.from(topicStats.entries())
    .map(([topic, stats]) => ({
      topic,
      ...stats,
      percentage: Math.round((stats.correct / stats.total) * 100),
    }))
    .sort((a, b) => a.percentage - b.percentage);

  const date = new Date(attempt.createdAt);
  const dateStr = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {attempt.isMockExam ? "Mock Exam" : `Topic: ${attempt.topicId}`}
            </h1>
            <p className="text-slate-400 mt-1">{dateStr}</p>
          </div>
          <Link
            href="/quiz-history"
            className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:border-sky-500 transition"
          >
            Back to History
          </Link>
        </div>

        {/* Score Summary */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-4">
          <div className={`text-6xl font-bold ${
            (attempt.score || 0) >= 80
              ? "text-green-400"
              : (attempt.score || 0) >= 70
              ? "text-amber-400"
              : "text-red-400"
          }`}>
            {attempt.score || "—"}%
          </div>
          <div>
            <p className="text-xl text-slate-300">
              {attempt.correctAnswers} of {attempt.totalQuestions} correct
            </p>
            {attempt.timeSpent && (
              <p className="text-sm text-slate-400 mt-2">
                ⏱️ Time spent: {Math.floor(attempt.timeSpent / 60)} minutes
              </p>
            )}
          </div>
        </div>

        {/* Performance by Topic */}
        {sortedTopics.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
            <h2 className="text-2xl font-semibold">Performance by Topic</h2>
            {sortedTopics.map(({ topic, correct, total, percentage }) => (
              <div key={topic} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200">{topic}</span>
                  <span
                    className={`text-sm font-bold ${
                      percentage >= 80
                        ? "text-green-400"
                        : percentage >= 70
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}
                  >
                    {correct}/{total} ({percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      percentage >= 80
                        ? "bg-green-600"
                        : percentage >= 70
                        ? "bg-amber-600"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Questions Review */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Review Questions</h2>

          {attemptedQuestions.map((item, idx) => {
            const result = item.result;
            const isCorrect = result.isCorrect;

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-6 space-y-4 ${
                  isCorrect
                    ? "border-green-700 bg-green-900/20"
                    : "border-red-700 bg-red-900/20"
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start gap-3">
                  <div
                    className={`text-2xl font-bold rounded-full w-8 h-8 flex items-center justify-center ${
                      isCorrect
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {isCorrect ? "✓" : "✗"}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-200">Question {idx + 1}</p>
                    <p className="text-sm text-slate-400 mt-1">{item.topicId}</p>
                  </div>
                </div>

                {/* Question Stem */}
                <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-700">
                  <p className="text-slate-100">{item.stem}</p>
                </div>

                {/* Answer Options */}
                <div className="space-y-2">
                  {item.options.map((opt, optIdx) => {
                    const isUserAnswer = result.userAnswerIndex === optIdx;
                    const isCorrectAnswer = item.answerIndex === optIdx;

                    let bgColor = "bg-slate-800/40";
                    let borderColor = "border-slate-700";
                    let textColor = "text-slate-200";

                    if (isCorrectAnswer) {
                      bgColor = "bg-green-900/40";
                      borderColor = "border-green-600";
                      textColor = "text-green-200";
                    } else if (isUserAnswer && !isCorrect) {
                      bgColor = "bg-red-900/40";
                      borderColor = "border-red-600";
                      textColor = "text-red-200";
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`rounded-lg border p-4 ${bgColor} ${borderColor}`}
                      >
                        <div className="flex gap-3">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                            isCorrectAnswer
                              ? "bg-green-600 text-white"
                              : isUserAnswer && !isCorrect
                              ? "bg-red-600 text-white"
                              : "bg-slate-700 text-slate-400"
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <div className="flex-1">
                            <p className={`${textColor}`}>{opt}</p>
                            <div className="flex gap-2 mt-1 text-xs">
                              {isCorrectAnswer && (
                                <span className="text-green-400 font-semibold">✓ Correct Answer</span>
                              )}
                              {isUserAnswer && !isCorrect && (
                                <span className="text-red-400 font-semibold">✗ Your Answer</span>
                              )}
                              {isUserAnswer && isCorrect && (
                                <span className="text-green-400 font-semibold">✓ Your Answer</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {!isCorrect && (
                  <div className="rounded-lg border border-sky-700 bg-sky-900/20 p-4 space-y-2">
                    <p className="text-sm font-semibold text-sky-300">💡 Explanation</p>
                    <p className="text-sm text-sky-100">{item.explanation}</p>
                  </div>
                )}

                {isCorrect && (
                  <div className="rounded-lg border border-green-700 bg-green-900/20 p-4">
                    <p className="text-sm text-green-300">{item.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-800">
          <Link
            href="/study"
            className="flex-1 rounded-md bg-sky-600 hover:bg-sky-700 text-white py-3 font-medium text-center transition"
          >
            Back to Study
          </Link>
          {attempt.isMockExam && (
            <Link
              href="/study/mock-exam"
              className="flex-1 rounded-md border border-sky-600 bg-sky-900/20 hover:bg-sky-900/40 text-sky-300 py-3 font-medium text-center transition"
            >
              Take Another Mock Exam
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
