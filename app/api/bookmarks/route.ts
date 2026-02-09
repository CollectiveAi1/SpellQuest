import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, resourceTitle, resourceCategory, action } = body;

    if (action === "add") {
      await prisma.resourceBookmark.upsert({
        where: {
          userId_resourceTitle: {
            userId,
            resourceTitle,
          },
        },
        update: {},
        create: {
          userId,
          resourceTitle,
          resourceCategory,
        },
      });
    } else {
      await prisma.resourceBookmark.deleteMany({
        where: {
          userId,
          resourceTitle,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bookmark error:", error);
    return NextResponse.json(
      { error: "Failed to update bookmark" },
      { status: 500 }
    );
  }
}
