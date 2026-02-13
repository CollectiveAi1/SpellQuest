import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import ResourcesClient from "./_components/resources-client";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const userProgress = await prisma.userProgress.findUnique({
    where: { userId },
  });

  const bookmarks = await prisma.resourceBookmark.findMany({
    where: { userId },
  });

  return (
    <ResourcesClient
      userId={userId}
      currentPhase={userProgress?.currentPhase ?? 1}
      bookmarks={bookmarks}
    />
  );
}
