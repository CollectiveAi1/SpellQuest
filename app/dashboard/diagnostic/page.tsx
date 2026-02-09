import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import DiagnosticClient from "./_components/diagnostic-client";

export const dynamic = "force-dynamic";

export default async function DiagnosticPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const userProgress = await prisma.userProgress.findUnique({
    where: { userId },
  });

  const previousResults = await prisma.diagnosticResult.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
    take: 1,
  });

  return (
    <DiagnosticClient
      userId={userId}
      diagnosticCompleted={userProgress?.diagnosticCompleted ?? false}
      previousResult={previousResults?.[0] ?? null}
    />
  );
}
