// app/lib/progress.ts

import { coreTopics, diversityTopics } from "./questions";

export async function getTopicMasteryForUser(_userId: string) {
  // NO-DB VERSION
  // -------------
  // We are not loading quiz attempts from a database anymore.
  // For now, we:
  // - list all topics for each module,
  // - set bestScore to 0,
  // - mark all as not mastered.
  //
  // Later, if you reintroduce Prisma, you can:
  // - fetch quiz attempts here,
  // - compute topicScores and masteredTopics,
  // - and reuse the original logic.

  const topicScores = new Map<string, number>();
  const masteredTopics = new Set<string>();

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
