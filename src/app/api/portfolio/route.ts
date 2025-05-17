import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const { name, cash, holdings } = data;

  try {
    const portfolio = await prisma.portfolio.create({
      data: {
        name,
        cash,
        visibility: 'PRIVATE', // default visibility
        owner: { connect: { id: session.user.id } },
        holdings: {
          create: holdings.map((h: any) => ({
            ticker: h.ticker,
            quantity: h.quantity,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, portfolio });
  } catch (err) {
    console.error('[PORTFOLIO CREATE ERROR]', err);
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 });
  }
}
