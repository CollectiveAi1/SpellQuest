import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { bookmarkSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = bookmarkSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
    }

    const { resourceTitle, resourceCategory, action } = result.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;

    if (action === "add") {
      await prisma.resourceBookmark.upsert({
        where: {
          userId_resourceTitle: {
            userId,
            resourceTitle,
          },
        },
        update: {
          resourceCategory,
        },
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
