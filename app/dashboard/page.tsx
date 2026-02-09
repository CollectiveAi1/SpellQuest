import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import DashboardClient from "./_components/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Fetch user progress
  const userProgress = await prisma.userProgress.findUnique({
    where: { userId },
  });

  // Fetch recent activities
  const recentActivities = await prisma.dailyActivity.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 7,
  });

  // Fetch achievements
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
  });

  // Fetch phase progress
  const phaseProgress = await prisma.phaseProgress.findMany({
    where: { userId },
    orderBy: { phaseNumber: "asc" },
  });

  // Fetch writing projects count
  const writingProjectsCount = await prisma.writingProject.count({
    where: { userId, status: "COMPLETED" },
  });

  // Fetch recent exercise results
  const recentExercises = await prisma.exerciseResult.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
    take: 10,
  });

  return (
    <DashboardClient
      user={session.user}
      progress={userProgress}
      recentActivities={recentActivities}
      achievements={userAchievements}
      phaseProgress={phaseProgress}
      writingProjectsCount={writingProjectsCount}
      recentExercises={recentExercises}
    />
  );
}
