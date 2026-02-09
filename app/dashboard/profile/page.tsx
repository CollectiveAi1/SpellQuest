import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import ProfileClient from "./_components/profile-client";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      progress: true,
      achievements: {
        orderBy: { earnedAt: "desc" },
      },
      exerciseResults: {
        take: 10,
        orderBy: { completedAt: "desc" },
      },
      writingProjects: {
        where: { status: "COMPLETED" },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Get all achievements from database
  const allAchievements = await prisma.achievement.findMany();

  return (
    <ProfileClient
      user={{
        id: user.id,
        name: user.name || "Spelling Champion",
        email: user.email,
        avatarId: user.avatarId,
        themeColor: user.themeColor,
        title: user.title,
        bio: user.bio,
        createdAt: user.createdAt.toISOString(),
      }}
      progress={user.progress}
      userAchievements={user.achievements}
      allAchievements={allAchievements}
      stats={{
        exercisesCompleted: user.exerciseResults.length,
        writingProjectsCompleted: user.writingProjects.length,
        totalStudyMinutes: user.progress?.totalStudyMinutes || 0,
        currentStreak: user.progress?.currentStreak || 0,
        longestStreak: user.progress?.longestStreak || 0,
        wordsMastered: user.progress?.wordsMastered || 0,
      }}
    />
  );
}
