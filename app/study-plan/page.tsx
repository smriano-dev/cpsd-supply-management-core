// app/study-plan/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  coreQuestions,
  diversityQuestions,
  coreTopics,
  diversityTopics,
} from "@/app/lib/questions";

type StudyPlan = {
  generatedAt: string;
  totalWeakAreas: number;
  estimatedWeeksToCompletion: number;
  dailyStudyMinutes: number;
  topicAnalysis: {
    id: string;
    label: string;
    exam: string;
    bestScore: number;
    attemptCount: number;
    priority: "high" | "medium" | "low";
    recommendedMinutesPerDay: number;
    questionsToReview: number;
  }[];
  schedule: {
    week: number;
    focusTopics: string[];
    goals: string[];
  }[];
};

function getPriorityColor(priority: "high" | "medium" | "low") {
  switch (priority) {
    case "high":
      return "bg-red-900/20 border-red-700";
    case "medium":
      return "bg-amber-900/20 border-amber-700";
    case "low":
      return "bg-green-900/20 border-green-700";
  }
}

function getPriorityBadgeColor(priority: "high" | "medium" | "low") {
  switch (priority) {
    case "high":
      return "bg-red-600 text-white";
    case "medium":
      return "bg-amber-600 text-white";
    case "low":
      return "bg-green-600 text-white";
  }
}

// NO-DB VERSION
// -------------
// We generate a plan directly from topics and questions,
// assuming no stored quiz history (all topics start as "high" priority).
async function generateStudyPlan(): Promise<StudyPlan> {
  type TopicAnalysisItem = {
    id: string;
    label: string;
    exam: string;
    bestScore: number;
    attemptCount: number;
    priority: "high" | "medium" | "low";
    recommendedMinutesPerDay: number;
    questionsToReview: number;
  };

  const topicAnalysis: TopicAnalysisItem[] = [];

  const allTopics = [...coreTopics, ...diversityTopics];

  allTopics.forEach((topic) => {
    // No stored stats, so:
    const attemptCount = 0;
    const bestScore = 0;

    let priority: "high" | "medium" | "low" = "low";
    if (bestScore < 60 || attemptCount === 0) {
      priority = "high";
    } else if (bestScore < 80) {
      priority = "medium";
    }

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

  // Sort by priority (high → medium → low)
  topicAnalysis.sort((a, b) => {
    const priorityOrder: Record<"high" | "medium" | "low", number> = {
      high: 0,
      medium: 1,
      low: 2,
    };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

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

  const totalWeakAreas = topicAnalysis.filter(
    (t) => t.priority !== "low",
  ).length;

  const totalDailyMinutes = topicAnalysis.reduce(
    (sum, t) => sum + t.recommendedMinutesPerDay,
    0,
  );

  const estimatedWeeksToCompletion = Math.ceil(totalWeakAreas / 2) + 2;
  const dailyStudyMinutes = Math.min(
    120,
    Math.max(30, totalDailyMinutes),
  );

  const plan: StudyPlan = {
    generatedAt: new Date().toISOString(),
    totalWeakAreas,
    estimatedWeeksToCompletion,
    dailyStudyMinutes,
    topicAnalysis,
    schedule: weeks,
  };

  return plan;
}

export default async function StudyPlanPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const plan = await generateStudyPlan();

  const generatedDate = new Date(plan.generatedAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Study Plan</h1>
            <p className="text-slate-400 mt-1">
              Generated on {generatedDate}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:border-sky-500 transition"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wide">
                Weak Areas
              </p>
              <p className="text-3xl font-bold mt-2 text-red-400">
                {plan.totalWeakAreas}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wide">
                Daily Study Time
              </p>
              <p className="text-3xl font-bold mt-2 text-sky-400">
                {plan.dailyStudyMinutes}m
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wide">
                Est. Completion
              </p>
              <p className="text-3xl font-bold mt-2 text-amber-400">
                {plan.estimatedWeeksToCompletion}w
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wide">
                Topics to Master
              </p>
              <p className="text-3xl font-bold mt-2 text-green-400">
                {plan.topicAnalysis.length}
              </p>
            </div>
          </div>

          {/* Topic Analysis */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 space-y-6">
            <h2 className="text-2xl font-semibold">Topic Analysis</h2>
            <div className="space-y-3">
              {plan.topicAnalysis.map((topic) => (
                <div
                  key={topic.id}
                  className={`rounded-lg border p-4 space-y-3 ${getPriorityColor(
                    topic.priority,
                  )}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-200">
                          {topic.label}
                        </h3>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${getPriorityBadgeColor(
                            topic.priority,
                          )}`}
                        >
                          {topic.priority
                            .charAt(0)
                            .toUpperCase() +
                            topic.priority.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        {topic.exam.charAt(0).toUpperCase() +
                          topic.exam.slice(1)}{" "}
                        Role
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-sky-400">
                        {topic.bestScore}%
                      </p>
                      <p className="text-xs text-slate-400">
                        Best Score
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Attempts</p>
                      <p className="font-semibold">
                        {topic.attemptCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">
                        Review Questions
                      </p>
                      <p className="font-semibold">
                        {topic.questionsToReview}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">
                        Daily Practice
                      </p>
                      <p className="font-semibold">
                        {topic.recommendedMinutesPerDay}m
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/study?exam=${topic.exam}#${topic.id}`}
                    className="block w-full text-center mt-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 text-sm font-medium transition"
                  >
                    Study Topic
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Week Schedule */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 space-y-6">
            <h2 className="text-2xl font-semibold">4-Week Study Schedule</h2>
            <div className="space-y-4">
              {plan.schedule.map((week) => (
                <div
                  key={week.week}
                  className="rounded-lg border border-slate-700 bg-slate-800/40 p-6 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-600 font-bold">
                      {week.week}
                    </div>
                    <h3 className="text-xl font-semibold">
                      Week {week.week}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-400 uppercase tracking-wide mb-2">
                        Focus Topics
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {week.focusTopics.map((topic) => (
                          <span
                            key={topic}
                            className="inline-block rounded-full bg-sky-900/30 border border-sky-700 px-3 py-1 text-sm text-sky-200"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400 uppercase tracking-wide mb-2">
                        Weekly Goals
                      </p>
                      <ul className="space-y-1">
                        {week.goals.map((goal, idx) => (
                          <li
                            key={idx}
                            className="flex gap-2 text-sm text-slate-300"
                          >
                            <span className="text-sky-400 font-bold">
                              •
                            </span>
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <Link
              href="/study"
              className="flex-1 rounded-md bg-sky-600 hover:bg-sky-700 text-white py-3 font-medium text-center transition"
            >
              Start Studying
            </Link>
            <button
              onClick={async () => {
                // Optional: call API, then reload. For now, just reload.
                window.location.reload();
              }}
              className="flex-1 rounded-md border border-sky-600 bg-sky-900/20 hover:bg-sky-900/40 text-sky-300 py-3 font-medium transition"
            >
              Regenerate Plan
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
