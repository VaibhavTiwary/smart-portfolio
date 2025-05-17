import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You're a financial analyst. Given a portfolio of stocks and cash, generate insights in this format:

{
  "summary": "...",
  "diversificationAnalysis": "...",
  "sectorExposure": "...",
  "oneLinerThesis": "..."
}

Keep it brief and beginner-friendly.`;

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const portfolioId = params.id;

  // 1. Get portfolio and holdings
  const portfolio = await prisma.portfolio.findUnique({
    where: { id: portfolioId },
    include: { holdings: true },
  });

  if (!portfolio) {
    return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
  }

  const prompt = [
    `Portfolio Name: ${portfolio.name}`,
    `Cash: $${portfolio.cash?.toFixed(2)}`,
    `Holdings:\n${portfolio.holdings
      .map((h) => `- ${h.ticker}: ${h.quantity} shares`)
      .join("\n")}`,
  ].join("\n");

  try {
    // 2. OpenAI call
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const raw = chatResponse.choices[0]?.message?.content ?? "";
    const insights = JSON.parse(raw);

    // 3. Save or update insights
    await prisma.aIInsights.upsert({
      where: { portfolioId: portfolio.id },
      update: insights,
      create: {
        ...insights,
        portfolioId: portfolio.id,
      },
    });

    return NextResponse.json({ success: true, insights });
  } catch (err: any) {
    console.error("AI generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate insights", details: err.message },
      { status: 500 }
    );
  }
}

