import { Suspense } from "react";

import {
  getRandomQuestionsForTopic,
  getTopicsForExam,
  shuffleOptionsForQuestions,
} from "../../../lib/questions";

import TopicPageClient from "./client";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ exam?: string }>;
};

export default async function TopicPage({ params, searchParams }: Props) {
  const { id: topicId } = await params;
  const { exam: examParam } = await searchParams;
  const exam = (examParam === "diversity" ? "diversity" : "core") as any;

  const topics = getTopicsForExam(exam);
  const topic = topics.find((t) => t.id === topicId);

  // Use the new helper here: limit to 50 random questions
  const baseQuestions = getRandomQuestionsForTopic(exam, topicId, 50);
const questions = shuffleOptionsForQuestions(baseQuestions);

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <TopicPageClient
        topicId={topicId}
        exam={exam}
        topic={topic}
        questions={questions}
      />
    </Suspense>
  );
}
