import Link from "next/link";

export default function MockExamPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Study</p>
            <h1 className="text-3xl font-bold">Mock Exam</h1>
            <p className="text-sm text-slate-400 mt-1">
              Take a full-length practice exam with 75 questions and a 2-hour time limit
            </p>
          </div>

          <div>
            <Link
              href="/study"
              className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:border-sky-500 transition"
            >
              Back to Study
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Core Exam */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 hover:border-sky-600 hover:bg-slate-900/80 transition">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Core Role Mock Exam</h2>
              <p className="text-slate-300">
                Test your knowledge on Core Role competencies including procurement strategy, supplier management, and contract administration.
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-md bg-slate-800/40 p-3">
                  <p className="text-slate-400">Questions</p>
                  <p className="text-lg font-semibold text-amber-400">75</p>
                </div>
                <div className="rounded-md bg-slate-800/40 p-3">
                  <p className="text-slate-400">Time Limit</p>
                  <p className="text-lg font-semibold text-amber-400">2 hours</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/study/mock-exam/core"
                  className="block w-full rounded-md bg-sky-600 px-6 py-3 text-center font-semibold text-white hover:bg-sky-700 transition"
                >
                  Start Core Role Exam
                </Link>
              </div>
            </div>
          </div>

          {/* Diversity Exam */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 hover:border-purple-600 hover:bg-slate-900/80 transition">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Supplier Diversity Mock Exam</h2>
              <p className="text-slate-300">
                Test your knowledge on Supplier Diversity including diversity sourcing, supplier development, and inclusive procurement practices.
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-md bg-slate-800/40 p-3">
                  <p className="text-slate-400">Questions</p>
                  <p className="text-lg font-semibold text-purple-400">75</p>
                </div>
                <div className="rounded-md bg-slate-800/40 p-3">
                  <p className="text-slate-400">Time Limit</p>
                  <p className="text-lg font-semibold text-purple-400">2 hours</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/study/mock-exam/diversity"
                  className="block w-full rounded-md bg-purple-600 px-6 py-3 text-center font-semibold text-white hover:bg-purple-700 transition"
                >
                  Start Diversity Exam
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold mb-4">About Mock Exams</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-3">
              <span className="text-sky-400 font-bold">•</span>
              <span>Random selection of 75 questions from your study topics</span>
            </li>
            <li className="flex gap-3">
              <span className="text-sky-400 font-bold">•</span>
              <span>2-hour time limit with live countdown timer</span>
            </li>
            <li className="flex gap-3">
              <span className="text-sky-400 font-bold">•</span>
              <span>Question navigation: move freely between questions</span>
            </li>
            <li className="flex gap-3">
              <span className="text-sky-400 font-bold">•</span>
              <span>Detailed results showing your score by topic</span>
            </li>
            <li className="flex gap-3">
              <span className="text-sky-400 font-bold">•</span>
              <span>Compare performance across multiple attempts</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
