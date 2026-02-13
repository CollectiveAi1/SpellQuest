import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import AnalyticsClient from "./_components/analytics-client";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const userProgress = await prisma.userProgress.findUnique({
    where: { userId },
  });

  const exerciseResults = await prisma.exerciseResult.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
    take: 50,
  });

  const dailyActivities = await prisma.dailyActivity.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 30,
  });

  const checkpointResults = await prisma.checkpointResult.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
  });

  const achievements = await prisma.userAchievement.findMany({
    where: { userId },
  });

  const writingProjects = await prisma.writingProject.findMany({
    where: { userId },
  });

  const phaseProgress = await prisma.phaseProgress.findMany({
    where: { userId },
    orderBy: { phaseNumber: "asc" },
  });

  return (
    <AnalyticsClient
      userProgress={userProgress}
      exerciseResults={exerciseResults}
      dailyActivities={dailyActivities}
      checkpointResults={checkpointResults}
      achievements={achievements}
      writingProjects={writingProjects}
      phaseProgress={phaseProgress}
    />
  );
}
