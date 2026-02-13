import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import ExercisesClient from "./_components/exercises-client";
import { User } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ExercisesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const userProgress = await prisma.userProgress.findUnique({
    where: { userId },
  });

  const recentResults = await prisma.exerciseResult.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
    take: 20,
  });

  return (
    <ExercisesClient
      userId={userId}
      currentPhase={userProgress?.currentPhase ?? 1}
      recentResults={recentResults}
    />
  );
}
