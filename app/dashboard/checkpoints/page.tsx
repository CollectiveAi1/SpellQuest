import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import CheckpointsClient from "./_components/checkpoints-client";

export const dynamic = "force-dynamic";

export default async function CheckpointsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const userProgress = await prisma.userProgress.findUnique({
    where: { userId },
  });

  const checkpointResults = await prisma.checkpointResult.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
  });

  const phaseProgress = await prisma.phaseProgress.findMany({
    where: { userId },
  });

  return (
    <CheckpointsClient
      userId={userId}
      currentPhase={userProgress?.currentPhase ?? 1}
      checkpointResults={checkpointResults}
      phaseProgress={phaseProgress}
    />
  );
}
