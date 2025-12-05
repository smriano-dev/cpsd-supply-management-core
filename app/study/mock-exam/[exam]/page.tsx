import { Suspense } from "react";
import { getQuestionsForTopic, getTopicsForExam, coreQuestions, diversityQuestions } from "../../../lib/questions";
import MockExamQuizClient from "./client";

type Props = {
  params: Promise<{ exam: string }>;
};

export default async function MockExamQuizPage({ params }: Props) {
  const { exam } = await params;
  const examType = exam === "diversity" ? "diversity" : "core";

  // Get all questions for the exam
  const allQuestions = examType === "diversity" ? diversityQuestions : coreQuestions;

  // Shuffle and select 75 questions
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  const selectedQuestions = shuffled.slice(0, Math.min(75, shuffled.length));

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <MockExamQuizClient
        exam={examType}
        questions={selectedQuestions}
      />
    </Suspense>
  );
}
