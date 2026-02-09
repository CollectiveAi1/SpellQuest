import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, segmentId, phaseNumber } = body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find or create today's activity
    let activity = await prisma.dailyActivity.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    if (activity) {
      // Update existing activity
      activity = await prisma.dailyActivity.update({
        where: { id: activity.id },
        data: {
          visualCompleted: segmentId === "visual" ? true : activity.visualCompleted,
          auditoryCompleted: segmentId === "auditory" ? true : activity.auditoryCompleted,
          kinestheticCompleted: segmentId === "kinesthetic" ? true : activity.kinestheticCompleted,
          totalMinutes: activity.totalMinutes + 10,
        },
      });
    } else {
      // Create new activity
      activity = await prisma.dailyActivity.create({
        data: {
          userId,
          phaseNumber,
          dayOfWeek: days[today.getDay()],
          visualCompleted: segmentId === "visual",
          auditoryCompleted: segmentId === "auditory",
          kinestheticCompleted: segmentId === "kinesthetic",
          totalMinutes: 10,
        },
      });
    }

    // Update user progress
    const userProgress = await prisma.userProgress.findUnique({
      where: { userId },
    });

    // Update streak logic
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayActivity = await prisma.dailyActivity.findFirst({
      where: {
        userId,
        date: {
          gte: yesterday,
          lt: today,
        },
        visualCompleted: true,
        auditoryCompleted: true,
        kinestheticCompleted: true,
      },
    });

    let newStreak = userProgress?.currentStreak ?? 0;
    const lastActivity = userProgress?.lastActivityDate;

    if (lastActivity) {
      const lastDate = new Date(lastActivity);
      lastDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day, keep streak
      } else if (diffDays === 1 || yesterdayActivity) {
        // Consecutive day or yesterday was completed
        newStreak += 1;
      } else {
        // Streak broken
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    await prisma.userProgress.update({
      where: { userId },
      data: {
        totalStudyMinutes: (userProgress?.totalStudyMinutes ?? 0) + 10,
        lastActivityDate: new Date(),
        currentStreak: newStreak,
        longestStreak: Math.max(userProgress?.longestStreak ?? 0, newStreak),
      },
    });

    // Check for first session achievement
    if (!userProgress?.lastActivityDate) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: "first_session",
          },
        },
        update: {},
        create: {
          userId,
          achievementId: "first_session",
        },
      });
    }

    // Check streak achievements
    if (newStreak >= 3) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: "week_streak_3",
          },
        },
        update: {},
        create: {
          userId,
          achievementId: "week_streak_3",
        },
      });
    }

    if (newStreak >= 7) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: "week_streak_7",
          },
        },
        update: {},
        create: {
          userId,
          achievementId: "week_streak_7",
        },
      });
    }

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error("Daily activity error:", error);
    return NextResponse.json(
      { error: "Failed to save activity" },
      { status: 500 }
    );
  }
}
