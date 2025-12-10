import { Suspense } from "react";
import {
  generateMockExam,
  type ExamId,
} from "../../../lib/questions";
import MockExamQuizClient from "./client";

type Props = {
  params: Promise<{ exam: ExamId }>;
};

export default async function MockExamPage({ params }: Props) {
  const { exam } = await params; // "core" or "diversity"

  const questions = generateMockExam(exam); // 150 Q with correct blueprint for diversity

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <MockExamQuizClient exam={exam} questions={questions} />
    </Suspense>
  );
}
