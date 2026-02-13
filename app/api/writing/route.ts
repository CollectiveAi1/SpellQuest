import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { writingProjectSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = writingProjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
    }

    const { projectNumber, title, content, wordCount, status } = result.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;

    // Upsert writing project
    const project = await prisma.writingProject.upsert({
      where: {
        userId_projectNumber: {
          userId,
          projectNumber,
        },
      },
      update: {
        content,
        wordCount,
        status,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
      create: {
        userId,
        projectNumber,
        title,
        content,
        wordCount,
        status,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });

    // Update creative word count in progress
    if (status === "COMPLETED") {
      const userProgress = await prisma.userProgress.findUnique({
        where: { userId },
      });

      await prisma.userProgress.update({
        where: { userId },
        data: {
          creativeWordCount: (userProgress?.creativeWordCount ?? 0) + wordCount,
        },
      });

      // Check for writing achievements
      const completedProjects = await prisma.writingProject.count({
        where: { userId, status: "COMPLETED" },
      });

      if (completedProjects >= 1) {
        await prisma.userAchievement.upsert({
          where: {
            userId_achievementId: {
              userId,
              achievementId: "writing_project_1",
            },
          },
          update: {},
          create: {
            userId,
            achievementId: "writing_project_1",
          },
        });
      }

      if (completedProjects >= 5) {
        await prisma.userAchievement.upsert({
          where: {
            userId_achievementId: {
              userId,
              achievementId: "writing_project_5",
            },
          },
          update: {},
          create: {
            userId,
            achievementId: "writing_project_5",
          },
        });
      }
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Writing error:", error);
    return NextResponse.json(
      { error: "Failed to save project" },
      { status: 500 }
    );
  }
}
