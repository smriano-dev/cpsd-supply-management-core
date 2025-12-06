// app/study/page.tsx

import { getServerSession } from "next-auth";
import { getTopicMasteryForUser } from "@/app/lib/progress";
import StudyPageClient from "./client";

export default async function StudyPage() {
  // We still check the session, but topicProgress no longer depends on the DB.
  const session = await getServerSession();

  // NO-DB VERSION
  // -------------
  // getTopicMasteryForUser no longer uses the actual userId, so we can pass
  // a dummy value. This keeps the API compatible with the client component.
  const topicProgress = await getTopicMasteryForUser("dummy-user-id");}

 
