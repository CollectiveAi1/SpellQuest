import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        progress: true,
        achievements: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarId: user.avatarId,
      themeColor: user.themeColor,
      title: user.title,
      bio: user.bio,
      createdAt: user.createdAt,
      progress: user.progress,
      achievements: user.achievements,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, avatarId, themeColor, title, bio } = body;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(name !== undefined && { name }),
        ...(avatarId !== undefined && { avatarId }),
        ...(themeColor !== undefined && { themeColor }),
        ...(title !== undefined && { title }),
        ...(bio !== undefined && { bio }),
      },
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      avatarId: updatedUser.avatarId,
      themeColor: updatedUser.themeColor,
      title: updatedUser.title,
      bio: updatedUser.bio,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
