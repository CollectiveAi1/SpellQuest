import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import ScheduleClient from "./_components/schedule-client";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const userProgress = await prisma.userProgress.findUnique({
    where: { userId },
  });

  // Get today's activity if exists
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayActivity = await prisma.dailyActivity.findFirst({
    where: {
      userId,
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  // Get weekly activities
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const weeklyActivities = await prisma.dailyActivity.findMany({
    where: {
      userId,
      date: {
        gte: weekStart,
      },
    },
    orderBy: { date: "asc" },
  });

  return (
    <ScheduleClient
      userId={userId}
      currentPhase={userProgress?.currentPhase ?? 1}
      todayActivity={todayActivity}
      weeklyActivities={weeklyActivities}
      currentStreak={userProgress?.currentStreak ?? 0}
    />
  );
}
