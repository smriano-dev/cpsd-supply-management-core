import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";
import { checkBadges, updateStreakCount } from "@/app/lib/badges";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
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
    if (!examId || totalQuestions === undefined || correctAnswers === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate score percentage
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Create quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        examId,
        topicId: topicId || null,
        isMockExam: isMockExam || false,
        totalQuestions,
        correctAnswers,
        timeSpent: timeSpent || null,
        score,
        results: {
          create: results.map((r: any) => ({
            questionId: r.questionId,
            userAnswerIndex: r.userAnswerIndex,
            isCorrect: r.isCorrect,
          })),
        },
      },
    });

    // Award XP (10 points per correct answer)
    const xpGained = correctAnswers * 10;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: {
          increment: xpGained,
        },
      },
    });

    // Update streak and get current streak count
    const currentStreak = await updateStreakCount(user.id);

    // Check for badges
    const newBadges = await checkBadges(user.id, {
      score,
      isMockExam: isMockExam || false,
      topicId: topicId || null,
    });

    const existingBadges = JSON.parse(user.badges || "[]");
    const allBadges = [...new Set([...existingBadges, ...newBadges])]; // Deduplicate

    if (newBadges.length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          badges: JSON.stringify(allBadges),
        },
      });
    }

    return NextResponse.json({
      success: true,
      attempt,
      xpGained,
      badgesAwarded: newBadges,
      streak: currentStreak,
      newTotal: user.xp + xpGained,
    });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
