import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { exerciseResultSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = exerciseResultSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
    }

    const {
      exerciseType,
      phaseNumber,
      score,
      totalQuestions,
      wordsAttempted,
      incorrectWords,
      timeSpent,
    } = result.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;
    const accuracy = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

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
    const userProgress = await prisma.userProgress.upsert({
      where: { userId },
      update: {},
      create: { userId },
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
      allResults.length > 0
        ? allResults.reduce((sum: number, r: { accuracy: number }) => sum + r.accuracy, 0) / allResults.length
        : 0;

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

    const achievements = [
      { id: "words_25", threshold: 25 },
      { id: "words_50", threshold: 50 },
      { id: "words_100", threshold: 100 },
    ];

    for (const achievement of achievements) {
      if (totalWordsMastered >= achievement.threshold) {
        await prisma.userAchievement.upsert({
          where: {
            userId_achievementId: {
              userId,
              achievementId: achievement.id,
            },
          },
          update: {},
          create: {
            userId,
            achievementId: achievement.id,
          },
        });
      }
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
