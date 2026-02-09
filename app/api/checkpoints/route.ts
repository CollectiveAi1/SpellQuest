import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, phaseNumber, score, totalPoints, passed, answers } = body;

    // Get attempt number
    const previousAttempts = await prisma.checkpointResult.count({
      where: { userId, phaseNumber },
    });

    // Save checkpoint result
    await prisma.checkpointResult.create({
      data: {
        userId,
        phaseNumber,
        score,
        totalPoints,
        passed,
        answers,
        attemptNumber: previousAttempts + 1,
      },
    });

    // If passed, update user progress
    if (passed) {
      const userProgress = await prisma.userProgress.findUnique({
        where: { userId },
      });

      // Mark current phase as completed and advance
      await prisma.phaseProgress.update({
        where: {
          userId_phaseNumber: {
            userId,
            phaseNumber,
          },
        },
        data: {
          completionPct: 100,
          completedAt: new Date(),
        },
      });

      // Advance to next phase if not at max
      if (phaseNumber < 6 && userProgress?.currentPhase === phaseNumber) {
        const nextPhase = phaseNumber + 1;

        await prisma.userProgress.update({
          where: { userId },
          data: {
            currentPhase: nextPhase,
            phaseCompletion: 0,
          },
        });

        // Create new phase progress
        await prisma.phaseProgress.upsert({
          where: {
            userId_phaseNumber: {
              userId,
              phaseNumber: nextPhase,
            },
          },
          update: {},
          create: {
            userId,
            phaseNumber: nextPhase,
          },
        });
      }

      // Award phase completion achievements
      const achievementId = `phase_${phaseNumber}_complete`;
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

    return NextResponse.json({ success: true, passed });
  } catch (error) {
    console.error("Checkpoint error:", error);
    return NextResponse.json(
      { error: "Failed to save checkpoint results" },
      { status: 500 }
    );
  }
}
