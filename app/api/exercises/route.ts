import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      exerciseType,
      phaseNumber,
      score,
      totalQuestions,
      wordsAttempted,
      incorrectWords,
      timeSpent,
    } = body;

    const accuracy = (score / totalQuestions) * 100;

    // Save exercise result
    await prisma.exerciseResult.create({
      data: {
        userId,
        exerciseType,
        phaseNumber,
        score,
        totalQuestions,
        accuracy,
        timeSpent: timeSpent || 0,
        wordsAttempted: wordsAttempted || [],
        incorrectWords: incorrectWords || [],
      },
    });

    // Update user progress
    const userProgress = await prisma.userProgress.findUnique({
      where: { userId },
    });

    // Calculate new words mastered (words with 100% accuracy)
    const correctWords = (wordsAttempted || []).filter(
      (w: string) => !(incorrectWords || []).includes(w)
    );

    // Update spelling accuracy (running average)
    const allResults = await prisma.exerciseResult.findMany({
      where: { userId },
      select: { accuracy: true },
    });
    const avgAccuracy =
      allResults.reduce((sum, r) => sum + r.accuracy, 0) / allResults.length;

    await prisma.userProgress.update({
      where: { userId },
      data: {
        wordsMastered: (userProgress?.wordsMastered || 0) + correctWords.length,
        spellingAccuracy: avgAccuracy,
      },
    });

    // Check for perfect score achievement
    if (accuracy === 100) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: "perfect_score",
          },
        },
        update: {},
        create: {
          userId,
          achievementId: "perfect_score",
        },
      });
    }

    // Check for words mastered achievements
    const totalWordsMastered = (userProgress?.wordsMastered || 0) + correctWords.length;

    if (totalWordsMastered >= 25) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: "words_25",
          },
        },
        update: {},
        create: {
          userId,
          achievementId: "words_25",
        },
      });
    }

    if (totalWordsMastered >= 50) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: "words_50",
          },
        },
        update: {},
        create: {
          userId,
          achievementId: "words_50",
        },
      });
    }

    if (totalWordsMastered >= 100) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: "words_100",
          },
        },
        update: {},
        create: {
          userId,
          achievementId: "words_100",
        },
      });
    }

    // Check accuracy achievement
    if (avgAccuracy >= 90) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: "accuracy_90",
          },
        },
        update: {},
        create: {
          userId,
          achievementId: "accuracy_90",
        },
      });
    }

    return NextResponse.json({ success: true, accuracy });
  } catch (error) {
    console.error("Exercise error:", error);
    return NextResponse.json(
      { error: "Failed to save exercise results" },
      { status: 500 }
    );
  }
}
