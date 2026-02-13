import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { checkpointSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = checkpointSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
    }

    const { phaseNumber, score, totalPoints, passed, answers } = result.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;

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
      const userProgress = await prisma.userProgress.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });

      // Mark current phase as completed and advance
      await prisma.phaseProgress.upsert({
        where: {
          userId_phaseNumber: {
            userId,
            phaseNumber: phaseNumber,
          },
        },
        update: {
          completionPct: 100,
          completedAt: new Date(),
        },
        create: {
          userId,
          phaseNumber: phaseNumber,
          completionPct: 100,
          completedAt: new Date(),
        },
      });

      // Advance to next phase if not at max
      if (phaseNumber < 6 && (userProgress.currentPhase === phaseNumber || !userProgress.currentPhase)) {
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
