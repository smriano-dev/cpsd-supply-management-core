// app/study/page.tsx

import { getServerSession } from "next-auth";
import { getTopicMasteryForUser } from "@/app/lib/progress";
import StudyPageClient from "./client";

export default async function StudyPage() {
  // Still check the session (even if not used yet)
  const session = await getServerSession();

  // NO-DB VERSION
  // getTopicMasteryForUser no longer needs a real userId
  const topicProgress = await getTopicMasteryForUser("dummy-user-id");

  return <StudyPageClient topicProgress={topicProgress} />;
}
