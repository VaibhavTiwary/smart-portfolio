"use client";

import { useState } from "react";

export default function GenerateInsightsButton({ portfolioId }: { portfolioId: string }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function generateInsights() {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/portfolio/generate-insights/${portfolioId}`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Failed to generate insights");
            window.location.reload();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button
                onClick={generateInsights}
                disabled={loading}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Generating..." : "Generate AI Insights"}
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
        </>
    );
}
