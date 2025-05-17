import { TokenTracker } from '@/lib/components/TokenTracker';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function SharedPortfolioPage({
  params,
}: {
  params: { token: string };
}) {
  const shared = await prisma.sharedPortfolioAccess.findUnique({
    where: { token: params.token },
    include: {
      portfolio: {
        include: {
          holdings: true,
          insights: true,
        },
      },
    },
  });

  if (!shared || shared.revoked) return notFound();

  const { portfolio } = shared;

  return (
    <>
      <TokenTracker token={params.token} />
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-2">{portfolio.name}</h1>
        <p className="text-gray-600 mb-4">Shared Portfolio View</p>
        <ul className="list-disc list-inside">
          {portfolio.holdings.map((h) => (
            <li key={h.id}>
              {h.ticker}: {h.quantity}
            </li>
          ))}
        </ul>
        {portfolio.insights ? (
          <div className="bg-gray-100 p-4 rounded mt-4">
            <h2 className="text-xl font-semibold mb-2">AI Insights</h2>
            <p><strong>Summary:</strong> {portfolio.insights.summary}</p>
            <p><strong>Diversification:</strong> {portfolio.insights.diversificationAnalysis}</p>
            <p><strong>Sector Exposure:</strong> {portfolio.insights.sectorExposure}</p>
            <p><strong>One-liner Thesis:</strong> <em>{portfolio.insights.oneLinerThesis}</em></p>
          </div>
        ) : (
          <p className="text-gray-500 italic">No AI insights generated yet.</p>
        )}
      </div>
    </>
  );
}

