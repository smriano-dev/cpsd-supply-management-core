import { getServerSession } from "next-auth";
import { getTopicsForExam } from "../lib/questions";
import { getTopicMasteryForUser } from "../lib/progress";
import { prisma } from "../lib/prisma";
import StudyPageClient from "./client";

export default async function StudyPage() {
  const session = await getServerSession();

  let topicProgress = null;
  
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (user) {
      topicProgress = await getTopicMasteryForUser(user.id);
    }
  }

  return <StudyPageClient topicProgress={topicProgress} />;
}
