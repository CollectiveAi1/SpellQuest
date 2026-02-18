import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET - Fetch user's writing challenges
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const challenges = await prisma.writingChallenge.findMany({
      where: { userId },
      orderBy: { unlockedAt: "desc" },
    });

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
}

// POST - Save/update a writing challenge
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { challengeId, content, wordCount, status } = body;

    const challenge = await prisma.writingChallenge.update({
      where: { id: challengeId },
      data: {
        content,
        wordCount,
        status,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });

    // Update creative word count if completed
    if (status === "COMPLETED") {
      const userProgress = await prisma.userProgress.findUnique({
        where: { userId: challenge.userId },
      });

      if (userProgress) {
        await prisma.userProgress.update({
          where: { userId: challenge.userId },
          data: {
            creativeWordCount: (userProgress.creativeWordCount ?? 0) + wordCount,
          },
        });
      }
    }

    return NextResponse.json({ success: true, challenge });
  } catch (error) {
    console.error("Challenge save error:", error);
    return NextResponse.json(
      { error: "Failed to save challenge" },
      { status: 500 }
    );
  }
}
