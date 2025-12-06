import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

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

export default async function StudyPlanPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/api/auth/signin");
  }

  let plan: StudyPlan | null = null;

  if (user.studyPlan) {
    plan = JSON.parse(user.studyPlan);
  }

  const generatedDate = plan ? new Date(plan.generatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }) : null;

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-red-900/20 border-red-700";
      case "medium":
        return "bg-amber-900/20 border-amber-700";
      case "low":
        return "bg-green-900/20 border-green-700";
    }
  };

  const getPriorityBadgeColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-red-600 text-white";
      case "medium":
        return "bg-amber-600 text-white";
      case "low":
        return "bg-green-600 text-white";
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Study Plan</h1>
            {generatedDate && (
              <p className="text-slate-400 mt-1">Generated on {generatedDate}</p>
            )}
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:border-sky-500 transition"
          >
            Back to Dashboard
          </Link>
        </div>

        {plan ? (
          <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Weak Areas</p>
                <p className="text-3xl font-bold mt-2 text-red-400">{plan.totalWeakAreas}</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Daily Study Time</p>
                <p className="text-3xl font-bold mt-2 text-sky-400">{plan.dailyStudyMinutes}m</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Est. Completion</p>
                <p className="text-3xl font-bold mt-2 text-amber-400">{plan.estimatedWeeksToCompletion}w</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Topics to Master</p>
                <p className="text-3xl font-bold mt-2 text-green-400">{plan.topicAnalysis.length}</p>
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
                      topic.priority
                    )}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-200">{topic.label}</h3>
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded ${getPriorityBadgeColor(
                              topic.priority
                            )}`}
                          >
                            {topic.priority.charAt(0).toUpperCase() + topic.priority.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">
                          {topic.exam.charAt(0).toUpperCase() + topic.exam.slice(1)} Role
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-sky-400">{topic.bestScore}%</p>
                        <p className="text-xs text-slate-400">Best Score</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-400">Attempts</p>
                        <p className="font-semibold">{topic.attemptCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Review Questions</p>
                        <p className="font-semibold">{topic.questionsToReview}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Daily Practice</p>
                        <p className="font-semibold">{topic.recommendedMinutesPerDay}m</p>
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
                  <div key={week.week} className="rounded-lg border border-slate-700 bg-slate-800/40 p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-600 font-bold">
                        {week.week}
                      </div>
                      <h3 className="text-xl font-semibold">Week {week.week}</h3>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-400 uppercase tracking-wide mb-2">Focus Topics</p>
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
                        <p className="text-sm text-slate-400 uppercase tracking-wide mb-2">Weekly Goals</p>
                        <ul className="space-y-1">
                          {week.goals.map((goal, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-slate-300">
                              <span className="text-sky-400 font-bold">•</span>
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
                  const response = await fetch("/api/study-plan", { method: "POST" });
                  if (response.ok) {
                    window.location.reload();
                  }
                }}
                className="flex-1 rounded-md border border-sky-600 bg-sky-900/20 hover:bg-sky-900/40 text-sky-300 py-3 font-medium transition"
              >
                Regenerate Plan
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center space-y-6">
            <div className="space-y-2">
              <p className="text-xl text-slate-300">No study plan yet</p>
              <p className="text-slate-400">
                Generate a personalized study plan based on your quiz history to get started.
              </p>
            </div>
            <button
              onClick={async () => {
                const response = await fetch("/api/study-plan", { method: "POST" });
                if (response.ok) {
                  window.location.reload();
                }
              }}
              className="inline-block rounded-md bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 font-medium transition"
            >
              Generate Study Plan
            </button>
            <p className="text-sm text-slate-400">
              💡 Tip: Complete a few quizzes first for better recommendations
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
