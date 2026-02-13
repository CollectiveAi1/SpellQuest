import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { dailyActivitySchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = dailyActivitySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
    }

    const { segmentId, phaseNumber } = result.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });

    // Check previous activity state to calculate minutes to add
    const existingActivity = await prisma.dailyActivity.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    const isNewSegment = !existingActivity ||
      (segmentId === "visual" && !existingActivity.visualCompleted) ||
      (segmentId === "auditory" && !existingActivity.auditoryCompleted) ||
      (segmentId === "kinesthetic" && !existingActivity.kinestheticCompleted);

    const minutesToAdd = isNewSegment ? 10 : 0;

    // Find or create daily activity record
    const activity = await prisma.dailyActivity.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        visualCompleted: segmentId === "visual" ? true : undefined,
        auditoryCompleted: segmentId === "auditory" ? true : undefined,
        kinestheticCompleted: segmentId === "kinesthetic" ? true : undefined,
        totalMinutes: {
          increment: minutesToAdd,
        },
      },
      create: {
        userId,
        date: today,
        phaseNumber,
        dayOfWeek,
        visualCompleted: segmentId === "visual",
        auditoryCompleted: segmentId === "auditory",
        kinestheticCompleted: segmentId === "kinesthetic",
        totalMinutes: 10,
      },
    });

    // Update user progress streaks and total minutes
    const userProgress = await prisma.userProgress.findUnique({
      where: { userId },
    });

    const lastActivity = userProgress?.lastActivityDate;
    let newStreak = userProgress?.currentStreak || 0;

    if (!lastActivity) {
      newStreak = 1;
    } else {
      const lastDate = new Date(lastActivity);
      lastDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor(
        (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      } else if (diffDays === 0) {
        // Already active today, streak remains same
      }
    }

    const updatedProgress = await prisma.userProgress.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, userProgress?.longestStreak || 0),
        lastActivityDate: new Date(),
        totalStudyMinutes: {
          increment: minutesToAdd,
        },
      },
    });

    // Check for achievements
    const achievementsToAward = [];

    // First session
    achievementsToAward.push("first_session");

    // Streaks
    if (newStreak >= 3) achievementsToAward.push("week_streak_3");
    if (newStreak >= 7) achievementsToAward.push("week_streak_7");

    // Time commitment (10 hours = 600 minutes)
    if (updatedProgress.totalStudyMinutes >= 600) {
      achievementsToAward.push("hours_10");
    }

    // Award achievements
    for (const achievementId of achievementsToAward) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId,
          },
        },
        update: {},
        create: {
          userId,
          achievementId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      activity,
      currentStreak: newStreak,
      totalStudyMinutes: updatedProgress.totalStudyMinutes
    });
  } catch (error) {
    console.error("Daily activity error:", error);
    return NextResponse.json(
      { error: "Failed to update daily activity" },
      { status: 500 }
    );
  }
}
