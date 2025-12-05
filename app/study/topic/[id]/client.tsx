"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionCard from "@/app/components/QuestionCard";
import Link from "next/link";
import type { Question, Topic } from "@/app/lib/questions";

type QuestionAnswer = {
  questionId: string;
  userAnswerIndex: number;
  isCorrect: boolean;
};

type Props = {
  topicId: string;
  exam: "core" | "diversity";
  topic: Topic | undefined;
  questions: Question[];
};

export default function TopicPageClient({ topicId, exam, topic, questions }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [answers, setAnswers] = useState<Map<string, QuestionAnswer>>(new Map());

  const handleAnswerSelect = (questionId: string, answerIndex: number, isCorrect: boolean) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, { questionId, userAnswerIndex: answerIndex, isCorrect });
    setAnswers(newAnswers);
  };

  const correctAnswers = Array.from(answers.values()).filter((a) => a.isCorrect).length;
  const unanswered = questions.length - answers.size;
  const allAnswered = unanswered === 0;

  const handleSubmitQuiz = async () => {
    if (!allAnswered) return;

    setSubmitting(true);
    try {
      const results = Array.from(answers.values());
      const response = await fetch("/api/quiz/save-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: exam,
          topicId: topicId,
          isMockExam: false,
          totalQuestions: questions.length,
          correctAnswers: correctAnswers,
          timeSpent: 0,
          results: results,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to save quiz result"}`);
        setSubmitting(false);
        return;
      }

      const data = await response.json();
      setQuizResult(data);
      setShowResults(true);
    } catch (error) {
      alert("Error submitting quiz: " + (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (showResults && quizResult) {
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-4">
            <h2 className="text-3xl font-bold">Quiz Complete!</h2>
            <div className="space-y-2">
              <div className={`text-5xl font-bold ${percentage >= 70 ? "text-green-400" : "text-orange-400"}`}>
                {percentage}%
              </div>
              <p className="text-xl text-slate-300">
                {correctAnswers} of {questions.length} correct
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="rounded-md bg-slate-800/60 p-4">
                <p className="text-sm text-slate-400">XP Earned</p>
                <p className="text-2xl font-bold text-amber-400">+{quizResult.xpGained} XP</p>
              </div>
              {quizResult.badgesAwarded?.length > 0 && (
                <div className="rounded-md bg-slate-800/60 p-4">
                  <p className="text-sm text-slate-400">Badges Earned</p>
                  <p className="text-lg font-bold text-purple-400">{quizResult.badgesAwarded[0]}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 rounded-md bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700 transition"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push(`/study?exam=${exam}`)}
                className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-4 py-2 font-semibold text-slate-100 hover:border-sky-500 transition"
              >
                Back to Topics
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Study — {exam}</p>
            <h1 className="text-2xl font-semibold">
              {topic ? topic.label : topicId}
            </h1>
            {topic?.description && (
              <p className="text-sm text-slate-400">{topic.description}</p>
            )}
          </div>

          <div>
            <Link
              href={`/study?exam=${exam}`}
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 hover:border-sky-500"
            >
              Back to topics
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3">
          <div className="text-sm">
            <span className="text-slate-400">Progress: </span>
            <span className="font-semibold text-slate-100">
              {answers.size} / {questions.length} answered
            </span>
            {unanswered > 0 && <span className="ml-2 text-slate-500">({unanswered} remaining)</span>}
          </div>
          <button
            onClick={handleSubmitQuiz}
            disabled={!allAnswered || submitting}
            className={`rounded-md px-6 py-2 font-semibold transition ${
              allAnswered && !submitting
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>

        <section className="space-y-6">
          {questions.length === 0 ? (
            <p className="text-sm text-slate-400">
              No questions found for this topic. Check `app/lib/questions.ts` to
              ensure questions are defined for this topic.
            </p>
          ) : (
            <div className="space-y-6">
              {questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  selectedAnswer={answers.get(q.id)?.userAnswerIndex}
                  onAnswerSelect={handleAnswerSelect}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
