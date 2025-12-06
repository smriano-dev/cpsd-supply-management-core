
import { coreTopics, diversityTopics } from "./questions";

export async function getTopicMasteryForUser(userId: string) {
  // Get all quiz attempts for this user
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: { results: true },
  });

  // Calculate best score per topic
  const topicScores = new Map<string, number>();

  attempts.forEach((attempt) => {
    if (attempt.topicId) {
      const score = Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100);
      const current = topicScores.get(attempt.topicId) || 0;
      if (score > current) {
        topicScores.set(attempt.topicId, score);
      }
    }
  });

  // Determine mastery (≥80%)
  const masteredTopics = new Set<string>();
  topicScores.forEach((score, topicId) => {
    if (score >= 80) {
      masteredTopics.add(topicId);
    }
  });

  // Calculate progress per exam
  const coreProgress = {
    exam: "core",
    total: coreTopics.length,
    mastered: coreTopics.filter((t) => masteredTopics.has(t.id)).length,
    topics: coreTopics.map((topic) => ({
      id: topic.id,
      label: topic.label,
      isMastered: masteredTopics.has(topic.id),
      bestScore: topicScores.get(topic.id) || 0,
    })),
  };

  const diversityProgress = {
    exam: "diversity",
    total: diversityTopics.length,
    mastered: diversityTopics.filter((t) => masteredTopics.has(t.id)).length,
    topics: diversityTopics.map((topic) => ({
      id: topic.id,
      label: topic.label,
      isMastered: masteredTopics.has(topic.id),
      bestScore: topicScores.get(topic.id) || 0,
    })),
  };

  return {
    core: coreProgress,
    diversity: diversityProgress,
  };
}
