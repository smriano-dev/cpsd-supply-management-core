// app/api/study-plan/route.ts

import { getServerSession } from "next-auth";
import {
  coreQuestions,
  diversityQuestions,
  coreTopics,
  diversityTopics,
} from "@/app/lib/questions";
import { NextResponse } from "next/server";

type TopicAnalysis = {
  id: string;
  label: string;
  exam: string;
  bestScore: number;
  attemptCount: number;
  priority: "high" | "medium" | "low";
  recommendedMinutesPerDay: number;
  questionsToReview: number;
};

type StudyPlan = {
  generatedAt: string;
  totalWeakAreas: number;
  estimatedWeeksToCompletion: number;
  dailyStudyMinutes: number;
  topicAnalysis: TopicAnalysis[];
  schedule: {
    week: number;
    focusTopics: string[];
    goals: string[];
  }[];
};

export async function POST() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // --------------------------------------------------
  // NO DATABASE VERSION
  // --------------------------------------------------
  // We no longer load quiz history from Prisma.
  // Instead, we assume the user is starting fresh:
  // - no previous attempts
  // - all topics treated as "high" priority initially
  // If later you re-introduce a DB, you can plug
  // real attempt data back into this structure.
  // --------------------------------------------------

  // Empty map – left here so the rest of the logic still compiles.
  const topicScores = new Map<
    string,
    {
      exam: string;
      scores: number[];
      totalQuestions: number;
    }
  >();

  const topicAnalysis: TopicAnalysis[] = [];

  const allTopics = [...coreTopics, ...diversityTopics];

  allTopics.forEach((topic) => {
    const stats = topicScores.get(topic.id);
    const attemptCount = stats ? stats.scores.length : 0;
    const bestScore = stats
      ? Math.round(
          (stats.scores.filter((s) => s === 1).length / stats.scores.length) *
            100,
        )
      : 0;

    // Determine priority based on score and attempt count
    // With no history, this defaults to "high".
    let priority: "high" | "medium" | "low" = "low";
    if (bestScore < 60 || attemptCount === 0) {
      priority = "high";
    } else if (bestScore < 80) {
      priority = "medium";
    }

    // Calculate recommended review questions
    const availableQuestions =
      topic.exam === "core"
        ? coreQuestions.filter((q) => q.topicId === topic.id).length
        : diversityQuestions.filter((q) => q.topicId === topic.id).length;

    const questionsToReview = Math.max(
      3,
      Math.ceil(
        availableQuestions *
          (priority === "high" ? 0.4 : priority === "medium" ? 0.25 : 0.1),
      ),
    );

    topicAnalysis.push({
      id: topic.id,
      label: topic.label,
      exam: topic.exam,
      bestScore,
      attemptCount,
      priority,
      recommendedMinutesPerDay:
        priority === "high" ? 15 : priority === "medium" ? 10 : 5,
      questionsToReview,
    });
  });

  // Sort by priority
  topicAnalysis.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Build study schedule (4-week plan focusing on weak areas)
  const highPriorityTopics = topicAnalysis.filter(
    (t) => t.priority === "high",
  );
  const mediumPriorityTopics = topicAnalysis.filter(
    (t) => t.priority === "medium",
  );
  const lowPriorityTopics = topicAnalysis.filter((t) => t.priority === "low");

  const weeks: { week: number; focusTopics: string[]; goals: string[] }[] = [];

  // Week 1: Focus on highest priority topics
  weeks.push({
    week: 1,
    focusTopics: highPriorityTopics.slice(0, 3).map((t) => t.label),
    goals: [
      "Build foundational understanding of key topics",
      "Complete 3–5 practice questions per weak topic",
      "Identify knowledge gaps",
    ],
  });

  // Week 2: Continue high priority + introduce medium
  weeks.push({
    week: 2,
    focusTopics: [
      ...highPriorityTopics.slice(3, 6).map((t) => t.label),
      ...mediumPriorityTopics.slice(0, 2).map((t) => t.label),
    ],
    goals: [
      "Strengthen understanding of challenging concepts",
      "Review previous week topics to reinforce learning",
      "Practice mixed-topic quizzes",
    ],
  });

  // Week 3: Medium priority focus + reinforcement
  weeks.push({
    week: 3,
    focusTopics: [
      ...mediumPriorityTopics.slice(2, 5).map((t) => t.label),
      ...lowPriorityTopics.slice(0, 2).map((t) => t.label),
    ],
    goals: [
      "Improve scores in medium-difficulty areas",
      "Maintain high-priority topic knowledge",
      "Attempt full-length mock exam mid-week",
    ],
  });

  // Week 4: Final review and mock exam
  weeks.push({
    week: 4,
    focusTopics: topicAnalysis.map((t) => t.label),
    goals: [
      "Final review of all weak areas",
      "Take full mock exam to assess readiness",
      "Focus on improving any remaining low scores",
    ],
  });

  // Calculate totals
  const totalWeakAreas = topicAnalysis.filter((t) => t.priority !== "low")
    .length;
  const totalDailyMinutes = topicAnalysis.reduce(
    (sum, t) => sum + t.recommendedMinutesPerDay,
    0,
  );
  const estimatedWeeksToCompletion = Math.ceil(totalWeakAreas / 2) + 2; // Minimum 4 weeks

  const plan: StudyPlan = {
    generatedAt: new Date().toISOString(),
    totalWeakAreas,
    estimatedWeeksToCompletion,
    dailyStudyMinutes: Math.min(120, Math.max(30, totalDailyMinutes)),
    topicAnalysis,
    schedule: weeks,
  };

  // No DB save here – just return the plan.
  return NextResponse.json(plan);
}
