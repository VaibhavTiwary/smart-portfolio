import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = body.token;
  const ip = req.headers.get('x-forwarded-for') || req.ip || null;
  const ua = req.headers.get('user-agent') || null;

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  await prisma.tokenAccessLog.create({
    data: {
      token,
      ip,
      userAgent: ua,
      viewerUserId: session?.user?.id || null,
    },
  });

  return NextResponse.json({ ok: true });
}
