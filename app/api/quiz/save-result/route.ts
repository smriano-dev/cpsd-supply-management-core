// app/api/quiz/save-result/route.ts

import { getServerSession } from "next-auth";
import { checkBadges, updateStreakCount } from "@/app/lib/badges";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const {
      examId,
      topicId,
      isMockExam,
      totalQuestions,
      correctAnswers,
      timeSpent,
      results, // Array of { questionId, userAnswerIndex, isCorrect }
    } = body;

    // Validate input
    if (
      !examId ||
      totalQuestions === undefined ||
      correctAnswers === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Calculate score percentage
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // In no-DB mode, we don't persist the attempt.
    // We just construct an object to return to the client.
    const attempt = {
      examId,
      topicId: topicId ?? null,
      isMockExam: Boolean(isMockExam),
      totalQuestions,
      correctAnswers,
      timeSpent: timeSpent ?? null,
      score,
      results: Array.isArray(results) ? results : [],
    };

    // XP (not stored anywhere, just returned)
    const xpGained = correctAnswers * 10;

    // Streak and badges helpers now work without DB.
    const currentStreak = await updateStreakCount("dummy-user-id");

    const newBadges = await checkBadges("dummy-user-id", {
      score,
      isMockExam: Boolean(isMockExam),
      topicId: topicId ?? null,
    });

    return NextResponse.json({
      success: true,
      attempt,
      xpGained,
      badgesAwarded: newBadges,
      streak: currentStreak,
      newTotal: xpGained,
    });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
