import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      totalScore,
      partAScore,
      partBScore,
      partCScore,
      partDScore,
      recommendedPhase,
      errorPatterns,
      answers,
    } = body;

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
        errorPatterns,
        answers,
      },
    });

    // Update user progress
    await prisma.userProgress.update({
      where: { userId },
      data: {
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
