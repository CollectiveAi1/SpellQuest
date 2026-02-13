import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { diagnosticSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = diagnosticSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
    }

    const {
      totalScore,
      partAScore,
      partBScore,
      partCScore,
      partDScore,
      recommendedPhase,
      errorPatterns,
      answers,
    } = result.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;

    // Create diagnostic result
    await prisma.diagnosticResult.create({
      data: {
        userId,
        totalScore,
        partAScore,
        partBScore,
        partCScore,
        partDScore,
        recommendedPhase,
        errorPatterns: errorPatterns || [],
        answers,
      },
    });

    // Update user progress
    await prisma.userProgress.upsert({
      where: { userId },
      update: {
        diagnosticCompleted: true,
        diagnosticScore: totalScore,
        recommendedPhase,
        currentPhase: recommendedPhase,
      },
      create: {
        userId,
        diagnosticCompleted: true,
        diagnosticScore: totalScore,
        recommendedPhase,
        currentPhase: recommendedPhase,
      },
    });

    // Initialize phase progress
    await prisma.phaseProgress.upsert({
      where: {
        userId_phaseNumber: {
          userId,
          phaseNumber: recommendedPhase,
        },
      },
      update: {},
      create: {
        userId,
        phaseNumber: recommendedPhase,
      },
    });

    // Award diagnostic achievement
    await prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId: "diagnostic_complete",
        },
      },
      update: {},
      create: {
        userId,
        achievementId: "diagnostic_complete",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Diagnostic error:", error);
    return NextResponse.json(
      { error: "Failed to save diagnostic results" },
      { status: 500 }
    );
  }
}
