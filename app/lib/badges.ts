import { prisma } from "./prisma";

export type BadgeName = "Module Mastery" | "Consistency" | "Exam Ready";

export interface BadgeInfo {
  name: BadgeName;
  emoji: string;
  description: string;
}

export const BADGES: Record<BadgeName, BadgeInfo> = {
  "Module Mastery": {
    name: "Module Mastery",
    emoji: "🏆",
    description: "Score ≥90% on a topic",
  },
  Consistency: {
    name: "Consistency",
    emoji: "🔥",
    description: "Study 7 days in a row",
  },
  "Exam Ready": {
    name: "Exam Ready",
    emoji: "⭐",
    description: "Score ≥80% on your first mock exam",
  },
};

export async function checkBadges(userId: string, context: {
  score: number;
  isMockExam: boolean;
  topicId?: string | null;
}): Promise<BadgeName[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { quizAttempts: true },
  });

  if (!user) return [];

  const newBadges: BadgeName[] = [];
  const existingBadges = JSON.parse(user.badges || "[]") as BadgeName[];

  // Module Mastery: ≥90% on any topic
  if (context.topicId && context.score >= 90 && !existingBadges.includes("Module Mastery")) {
    newBadges.push("Module Mastery");
  }

  // Exam Ready: ≥80% on first mock exam
  if (
    context.isMockExam &&
    context.score >= 80 &&
    !existingBadges.includes("Exam Ready")
  ) {
    // Check if this is the first mock exam
    const mockExams = user.quizAttempts.filter((a) => a.isMockExam);
    if (mockExams.length === 1) {
      // This is the first and only mock exam
      newBadges.push("Exam Ready");
    }
  }

  // Consistency: 7-day study streak
  if (!existingBadges.includes("Consistency")) {
    const streak = calculateStreak(user.lastStudyDate);
    if (streak >= 7) {
      newBadges.push("Consistency");
    }
  }

  return newBadges;
}

export function calculateStreak(lastStudyDate: Date | null): number {
  if (!lastStudyDate) return 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = new Date(lastStudyDate);
  lastDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // If study was today, streak continues
  // If study was yesterday, streak is still active (user studying today)
  // If more than 1 day ago, streak is broken
  if (diffDays === 0 || diffDays === 1) {
    return -1; // Signal to check database for actual streak
  }

  return 0; // Streak broken
}

export async function updateStreakCount(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      quizAttempts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) return 0;

  // Get unique study dates (by day, ignoring time)
  const studyDates = new Set<string>();
  user.quizAttempts.forEach((attempt) => {
    const dateStr = attempt.createdAt.toISOString().split("T")[0];
    studyDates.add(dateStr);
  });

  // Sort dates in descending order
  const sortedDates = Array.from(studyDates).sort().reverse();

  // Calculate consecutive streak from most recent
  let streak = 0;
  const today = new Date().toISOString().split("T")[0];

  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedStr = expectedDate.toISOString().split("T")[0];

    if (sortedDates[i] === expectedStr) {
      streak++;
    } else {
      break;
    }
  }

  // Update user's streak
  await prisma.user.update({
    where: { id: userId },
    data: {
      streakCount: streak,
      lastStudyDate: new Date(),
    },
  });

  return streak;
}
