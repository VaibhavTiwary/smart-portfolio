"use client";

import { SharedPortfolioAccess } from "@/generated/prisma";
import { useRouter } from "next/navigation";

export default function SharedLinks({ sharedLinks }: { sharedLinks: SharedPortfolioAccess[] }) {
    const router = useRouter();
    return (
        <>
            {sharedLinks.length > 0 && (
                <h3 className="font-medium text-sm text-gray-700 mt-2">
                    Shared Links:
                </h3>
            )}
            {sharedLinks.map((link) => (
                <div key={link.id} className="text-sm">
                    <div className="flex items-center gap-2">
                        <code className="text-xs truncate">{link.token}</code>
                        {link.revoked ? (
                            <span className="text-red-500">Revoked</span>
                        ) : (
                            <button
                                style={{ cursor: "pointer" }}
                                onClick={async () => {
                                    await fetch(`/api/portfolio/revoke-link/${link.token}`, {
                                        method: "PATCH",
                                    });
                                    router.refresh();
                                }}
                                className="text-red-600 underline text-xs"
                            >
                                Revoke
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}
