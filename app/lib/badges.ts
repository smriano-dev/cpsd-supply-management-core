// app/lib/badges.ts

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

/**
 * TEMPORARY NO-DB VERSION
 * -----------------------
 * We don't read or write from a database anymore.
 * This helper just computes potential badges from the context.
 * You can plug a real DB back in later if you want persistence.
 */
export async function checkBadges(
  _userId: string,
  context: {
    score: number;
    isMockExam: boolean;
    topicId?: string | null;
  }
): Promise<BadgeName[]> {
  const newBadges: BadgeName[] = [];

  // Module Mastery: ≥90% on any topic
  if (context.topicId && context.score >= 90) {
    newBadges.push("Module Mastery");
  }

  // Exam Ready: ≥80% on a mock exam
  if (context.isMockExam && context.score >= 80) {
    newBadges.push("Exam Ready");
  }

  // Consistency requires real date history, which we are not tracking
  // without a database, so we skip it for now.

  return newBadges;
}

/**
 * Pure helper – keeps working without a database.
 */
export function calculateStreak(lastStudyDate: Date | null): number {
  if (!lastStudyDate) return 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = new Date(lastStudyDate);
  lastDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0 || diffDays === 1) {
    // In a future DB-backed version you could compute real streaks.
    return -1;
  }

  return 0;
}

/**
 * TEMPORARY NO-DB STUB
 * --------------------
 * Without a database, we can't update a stored streak.
 * We just return 0 so callers don't break.
 */
export async function updateStreakCount(_userId: string): Promise<number> {
  return 0;
}
