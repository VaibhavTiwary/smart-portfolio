"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "react-hot-toast";


export default function ShareBtn({ id }: { id: string }) {
    const [generatingLinkId, setGeneratingLinkId] = useState<string | null>(null);

    const generateShareLink = async (portfolioId: string) => {
        try {
            setGeneratingLinkId(portfolioId);
            const res = await fetch(`/api/portfolio/${portfolioId}/share`, {
                method: "POST",
            });
            const data = await res.json();

            if (res.ok) {
                await navigator.clipboard.writeText(data.url);
                toast.success("Link copied to clipboard!");
            } else {
                toast.error(data.error || "Failed to generate link");
            }
        } catch (err) {
            toast.error("Error sharing portfolio");
        } finally {
            setGeneratingLinkId(null);
        }
    };

    return (

        <button
            onClick={() => generateShareLink(id)}
            className="text-sm text-green-700 hover:underline flex items-center gap-1"
            disabled={generatingLinkId === id}
        >
            <Copy className="w-4 h-4" />
            {generatingLinkId === id ? "Copying..." : "Smart Share"}
        </button>
    );
}
