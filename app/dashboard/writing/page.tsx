import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import WritingClient from "./_components/writing-client";

export const dynamic = "force-dynamic";

export default async function WritingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const userProgress = await prisma.userProgress.findUnique({
    where: { userId },
  });

  const userProjects = await prisma.writingProject.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <WritingClient
      userId={userId}
      currentPhase={userProgress?.currentPhase ?? 1}
      userProjects={userProjects}
    />
  );
}
