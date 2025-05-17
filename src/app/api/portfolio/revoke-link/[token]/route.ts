import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { token: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = params;

  const sharedLink = await prisma.sharedPortfolioAccess.findUnique({
    where: { token },
    include: { portfolio: true },
  });

  if (!sharedLink || sharedLink.portfolio.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.sharedPortfolioAccess.update({
    where: { token },
    data: { revoked: true },
  });

  return NextResponse.json({ success: true, revoked: updated.revoked });
}

