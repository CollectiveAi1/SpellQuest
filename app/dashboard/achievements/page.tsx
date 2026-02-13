import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import AchievementsClient from "./_components/achievements-client";

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
  });

  const userProgress = await prisma.userProgress.findUnique({
    where: { userId },
  });

  return (
    <AchievementsClient
      userAchievements={userAchievements}
      userProgress={userProgress}
    />
  );
}
