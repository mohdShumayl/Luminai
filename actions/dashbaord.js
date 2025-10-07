"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAIInsights = async (industry) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Analyze the ${industry} industry and return ONLY this JSON format:
      {
        "salaryRanges": [ { "role":"string", "min":number, "max":number, "median":number, "location":"string" } ],
        "growthRate": number,
        "demandLevel": "High"|"Medium"|"Low",
        "topSkills": ["skill1","skill2"],
        "marketOutlook": "Positive"|"Neutral"|"Negative",
        "keyTrends": ["trend1","trend2"],
        "recommendedSkills": ["skill1","skill2"]
      }
      Include at least 5 roles, 5 skills, 5 trends.
    `;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    const cleaned = text.replace(/```(?:json)?|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to generate AI insights: ${error.message}`);
  }
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    return await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  return user.industryInsight;
}
