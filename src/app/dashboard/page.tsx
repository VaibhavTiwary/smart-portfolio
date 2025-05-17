import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ShareBtn from '@/lib/components/ShareBtn';
import SharedLinks from '@/lib/components/SharedLinks';
import GenerateInsightsButton from '@/lib/components/GenerateInsightsBtn';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <p className="p-4">You must be signed in to view your dashboard.</p>;
  }

  const portfolios = await prisma.portfolio.findMany({
    where: { ownerId: session.user.id },
    include: {
      insights: true,
      holdings: true, sharedLinks: {
        include: { _count: { select: { TokenAccessLog: true } } },
      }
    },
    orderBy: { createdAt: 'desc' },
  });


  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Portfolios</h1>

      {portfolios.length === 0 ? (
        <p>
          No portfolios yet.{" "}
          <Link href="/portfolio/new" className="text-blue-600">
            Create one →
          </Link>
        </p>
      ) : (
        <>
          <ul className="space-y-4">
            {portfolios.map((p) => (
              <li
                key={p.id}
                className="border p-4 rounded shadow-sm flex flex-col gap-2"
              >
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <p>Cash: ${p.cash?.toFixed(2)}</p>
                <p>Total Holdings: {p.holdings.length}</p>

                {p.holdings.length > 0 && (
                  <div className="ml-2">
                    <h3 className="font-medium text-sm text-gray-700 mt-2">Holdings:</h3>
                    <ul className="list-disc list-inside text-sm">
                      {p.holdings.map((h) => (
                        <li key={h.id}>
                          {h.ticker}: {h.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-sm text-gray-500">
                  Created: {new Date(p.createdAt).toLocaleString()}
                </p>
                {p.sharedLinks.length > 0 && (
                  <p className="text-sm text-gray-500">
                    👁️ Viewers:{" "}
                    {p.sharedLinks.reduce(
                      (sum, link) => sum + (link._count.TokenAccessLog ?? 0),
                      0
                    )}
                  </p>
                )}
                {p.insights ? (
                  <div className="text-sm text-green-700 bg-green-100 p-2 rounded mt-1">
                    AI Insights Available
                  </div>
                ) : (
                  <GenerateInsightsButton portfolioId={p.id} />
                )}
                <Link
                  href={`/portfolio/${p.id}`}
                  className="text-blue-600 text-sm mt-1"
                >
                  View Portfolio →
                </Link>
                <SharedLinks sharedLinks={p.sharedLinks} />
                <ShareBtn id={p.id} />
              </li>
            ))}
          </ul>
          <Link href="/portfolio/new" className="text-blue-600 pt-4">
            Create More Portfolio →
          </Link>
        </>
      )}
    </div>

  );
}
