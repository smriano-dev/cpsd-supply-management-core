// app/page.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold text-center">
        CPSD Study App – Supply Management Core
      </h1>

      <p className="text-center max-w-xl">
        Practise for the CPSD Supply Management Core exam with timed mock
        exams, study-by-topic questions, and review of your past attempts.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/study/mock-exam"
          className="border px-4 py-2 rounded-md hover:bg-gray-100"
        >
          Start mock exam
        </Link>

        <Link
          href="/study"
          className="border px-4 py-2 rounded-md hover:bg-gray-100"
        >
          Study by topic
        </Link>

        <Link
          href="/quiz-history"
          className="border px-4 py-2 rounded-md hover:bg-gray-100"
        >
          Review attempts
        </Link>
      </div>
    </main>
  );
}
