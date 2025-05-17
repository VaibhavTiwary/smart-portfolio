import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const portfolioId = params.id;

  // Check ownership
  const portfolio = await prisma.portfolio.findUnique({
    where: { id: portfolioId },
  });

  if (!portfolio || portfolio.ownerId !== session.user.id) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  const token = nanoid(24);

  const shared = await prisma.sharedPortfolioAccess.create({
    data: {
      token,
      portfolioId,
      createdBy: session.user.id,
    },
  });

  return NextResponse.json({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/shared/${token}`,
  });
}
