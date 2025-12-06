// app/quiz-history/[attemptId]/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

type Props = {
  params: { attemptId: string };
};

export default async function QuizReviewPage({ params }: Props) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const { attemptId } = params;

  // NO-DB VERSION
  // -------------
  // In this version of the app we do not persist quiz attempts,
  // so we cannot load or reconstruct the detailed review for a
  // specific attempt. We keep the route for future compatibility
  // and to avoid broken links, but show an informative message.

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quiz Review</h1>
            <p className="text-slate-400 mt-1 text-sm">
              Attempt ID: <span className="font-mono">{attemptId}</span>
            </p>
          </div>
          <Link
            href="/quiz-history"
            className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:border-sky-500 transition"
          >
            Back to History
          </Link>
        </div>

        {/* Info Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 space-y-4">
          <h2 className="text-2xl font-semibold">Review not available</h2>
          <p className="text-slate-300">
            Detailed quiz review is disabled in the current version of the CPSD
            study app because results are not being saved to a database.
          </p>
          <p className="text-slate-400 text-sm">
            You can still continue practising using mock exams and study-by-topic
            sessions. When you are ready to enable saved history and full reviews
            again, this page can be wired back to a database.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/study"
            className="flex-1 rounded-md bg-sky-600 hover:bg-sky-700 text-white py-3 font-medium text-center transition"
          >
            Back to Study
          </Link>
          <Link
            href="/study/mock-exam"
            className="flex-1 rounded-md border border-sky-600 bg-sky-900/30 hover:bg-sky-900/50 text-sky-300 py-3 font-medium text-center transition"
          >
            Take a Mock Exam
          </Link>
        </div>
      </div>
    </main>
  );
}
