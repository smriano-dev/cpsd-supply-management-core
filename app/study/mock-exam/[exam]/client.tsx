"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionCard from "@/app/components/QuestionCard";
import type { Question } from "@/app/lib/questions";

const EXAM_DURATION = 120 * 60; // 2 hours in seconds

type QuestionAnswer = {
  questionId: string;
  userAnswerIndex: number;
  isCorrect: boolean;
};

type Props = {
  exam: "core" | "diversity";
  questions: Question[];
};

export default function MockExamQuizClient({ exam, questions }: Props) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, QuestionAnswer>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults]);

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = answers.size;
  const correctCount = Array.from(answers.values()).filter((a) => a.isCorrect).length;
  const isAnswered = answers.has(currentQuestion.id);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number, isCorrect: boolean) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, { questionId, userAnswerIndex: answerIndex, isCorrect });
    setAnswers(newAnswers);
  };

  const handleSubmitExam = async () => {
    setSubmitting(true);
    try {
      const results = Array.from(answers.values());
      const response = await fetch("/api/quiz/save-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: exam,
          topicId: null,
          isMockExam: true,
          totalQuestions: questions.length,
          correctAnswers: correctCount,
          timeSpent: EXAM_DURATION - timeLeft,
          results: results,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to save exam result"}`);
        setSubmitting(false);
        return;
      }

      const data = await response.json();
      setQuizResult(data);
      setShowResults(true);
    } catch (error) {
      alert("Error submitting exam: " + (error as Error).message);
      setSubmitting(false);
    }
  };

  const isTimeWarning = timeLeft < 600; // Less than 10 minutes
  const isTimeCritical = timeLeft < 60; // Less than 1 minute

  if (showResults && quizResult) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    
    // Calculate performance by topic
    const topicPerformance = new Map<string, { correct: number; total: number }>();
    
    answers.forEach((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      if (question) {
        const topic = question.topicId;
        if (!topicPerformance.has(topic)) {
          topicPerformance.set(topic, { correct: 0, total: 0 });
        }
        const stats = topicPerformance.get(topic)!;
        stats.total += 1;
        if (answer.isCorrect) stats.correct += 1;
      }
    });

    const topicStats = Array.from(topicPerformance.entries())
      .map(([topic, { correct, total }]) => ({
        topic,
        correct,
        total,
        percentage: Math.round((correct / total) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return (
      <main className="min-h-screen bg-slate-950 text-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Main Result Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-4">
            <h2 className="text-3xl font-bold">Exam Complete!</h2>
            <div className="space-y-2">
              <div className={`text-6xl font-bold ${percentage >= 80 ? "text-green-400" : percentage >= 70 ? "text-amber-400" : "text-red-400"}`}>
                {percentage}%
              </div>
              <p className="text-xl text-slate-300">
                {correctCount} of {questions.length} correct
              </p>
              {percentage >= 80 && <p className="text-green-400 font-semibold">🎉 Excellent! Ready for the exam!</p>}
              {percentage >= 70 && percentage < 80 && <p className="text-amber-400 font-semibold">⭐ Good score! Review weak areas before exam.</p>}
              {percentage < 70 && <p className="text-red-400 font-semibold">💪 Keep practicing to improve your score.</p>}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="rounded-md bg-slate-800/60 p-4">
                <p className="text-sm text-slate-400">Time Spent</p>
                <p className="text-lg font-bold text-blue-400">{formatTime(EXAM_DURATION - timeLeft)}</p>
              </div>
              <div className="rounded-md bg-slate-800/60 p-4">
                <p className="text-sm text-slate-400">XP Earned</p>
                <p className="text-lg font-bold text-amber-400">+{quizResult.xpGained} XP</p>
              </div>
              {quizResult.badgesAwarded?.length > 0 && (
                <div className="rounded-md bg-slate-800/60 p-4">
                  <p className="text-sm text-slate-400">Badge</p>
                  <p className="text-sm font-bold text-purple-400">{quizResult.badgesAwarded[0]}</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance by Topic */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-xl font-bold mb-4">Performance by Topic</h3>
            <div className="space-y-4">
              {topicStats.map(({ topic, correct, total, percentage: topicPercentage }) => (
                <div key={topic} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-200">{topic}</span>
                    <span className={`text-sm font-bold ${
                      topicPercentage >= 80 ? "text-green-400" : 
                      topicPercentage >= 70 ? "text-amber-400" : 
                      "text-red-400"
                    }`}>
                      {correct}/{total} ({topicPercentage}%)
                    </span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        topicPercentage >= 80 ? "bg-green-600" :
                        topicPercentage >= 70 ? "bg-amber-600" :
                        "bg-red-600"
                      }`}
                      style={{ width: `${topicPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-lg font-bold mb-4">📊 Analysis</h3>
            <div className="space-y-3 text-sm text-slate-300">
              {topicStats.some((t) => t.percentage < 70) && (
                <p>
                  <span className="font-semibold text-red-400">Areas to improve:</span> Focus on{" "}
                  {topicStats
                    .filter((t) => t.percentage < 70)
                    .map((t) => t.topic)
                    .join(", ")}
                </p>
              )}
              {topicStats.some((t) => t.percentage >= 80) && (
                <p>
                  <span className="font-semibold text-green-400">Strong areas:</span>{" "}
                  {topicStats
                    .filter((t) => t.percentage >= 80)
                    .map((t) => t.topic)
                    .join(", ")}
                </p>
              )}
              <p className="pt-2 border-t border-slate-700">
                Take more practice quizzes on weak topics, then retake this mock exam to track improvement.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-md bg-sky-600 px-4 py-3 font-semibold text-white hover:bg-sky-700 transition"
              >
                View Dashboard
              </button>
              <button
                onClick={() => router.push("/study/mock-exam")}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 font-semibold text-slate-100 hover:border-sky-500 transition"
              >
                Take Another Exam
              </button>
            </div>
          </div>
        </main>
      );
    }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">{exam.toUpperCase()} MOCK EXAM</p>
            <h1 className="text-2xl font-bold">Question {currentQuestionIndex + 1} of {questions.length}</h1>
          </div>

          {/* Timer */}
          <div className={`rounded-xl px-6 py-4 font-mono text-xl font-bold text-center ${
            isTimeCritical
              ? "bg-red-900/30 border border-red-600 text-red-400"
              : isTimeWarning
              ? "bg-amber-900/30 border border-amber-600 text-amber-400"
              : "bg-slate-800/60 border border-slate-700 text-slate-100"
          }`}>
            <div className="text-sm text-slate-400 mb-1">Time Remaining</div>
            <div>{formatTime(timeLeft)}</div>
          </div>
        </div>

        {/* Question */}
        <div>
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={answers.get(currentQuestion.id)?.userAnswerIndex}
            onAnswerSelect={handleAnswerSelect}
          />
        </div>

        {/* Navigation and Submit */}
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="rounded-lg bg-slate-800/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Progress</span>
              <span className="text-sm font-semibold text-slate-100">{answeredCount} / {questions.length} answered</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 transition-all"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Navigation */}
          <div>
            <p className="text-sm text-slate-400 mb-3">Jump to question:</p>
            <div className="grid grid-cols-12 gap-2">
              {questions.map((q, idx) => {
                const answered = answers.has(q.id);
                const isCorrect = answered && answers.get(q.id)!.isCorrect;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-10 rounded font-semibold text-xs transition ${
                      idx === currentQuestionIndex
                        ? "ring-2 ring-sky-500 bg-sky-600 text-white"
                        : answered
                        ? isCorrect
                          ? "bg-green-900/60 text-green-200 border border-green-600"
                          : "bg-red-900/60 text-red-200 border border-red-600"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-4 py-3 font-semibold text-slate-100 hover:border-sky-500 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Previous
            </button>

            <button
              onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
              disabled={currentQuestionIndex === questions.length - 1}
              className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-4 py-3 font-semibold text-slate-100 hover:border-sky-500 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>

            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="flex-1 rounded-md bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 transition"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Confirm Submit Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md space-y-4">
              <h3 className="text-xl font-bold">Submit Exam?</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <p>Questions answered: <span className="font-semibold text-slate-100">{answeredCount} / {questions.length}</span></p>
                <p>Time remaining: <span className="font-semibold text-slate-100">{formatTime(timeLeft)}</span></p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 rounded-md border border-slate-700 bg-slate-800 px-4 py-2 font-semibold text-slate-100 hover:bg-slate-700 transition"
                >
                  Continue Exam
                </button>
                <button
                  onClick={handleSubmitExam}
                  disabled={submitting}
                  className="flex-1 rounded-md bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
