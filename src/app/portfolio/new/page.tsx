'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NewPortfolioPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [cash, setCash] = useState(0);
  const [holdings, setHoldings] = useState([{ ticker: '', quantity: 0 }]);

  const addHolding = () => {
    setHoldings([...holdings, { ticker: '', quantity: 0 }]);
  };

  const updateHolding = (index: number, field: string, value: string | number) => {
    const newHoldings = [...holdings];
    newHoldings[index][field] = field === 'quantity' ? parseFloat(value as string) : value;
    setHoldings(newHoldings);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, cash, holdings }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('Failed to create portfolio');
    }
  };

  if (!session) return <p>You must be logged in</p>;

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Create Portfolio</h1>

      <input
        type="text"
        placeholder="Portfolio name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Cash balance"
        value={cash}
        onChange={(e) => setCash(parseFloat(e.target.value))}
        className="w-full p-2 border rounded"
      />

      <div className="space-y-2">
        <p className="font-semibold">Holdings:</p>
        {holdings.map((h, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              placeholder="Ticker"
              value={h.ticker}
              onChange={(e) => updateHolding(i, 'ticker', e.target.value)}
              className="p-2 border rounded w-1/2"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={h.quantity}
              onChange={(e) => updateHolding(i, 'quantity', e.target.value)}
              className="p-2 border rounded w-1/2"
            />
          </div>
        ))}
        <button type="button" onClick={addHolding} className="text-blue-600 text-sm">
          + Add Holding
        </button>
      </div>

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Create Portfolio
      </button>
    </form>
  );
}

