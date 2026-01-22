"use server";

import { db } from "@/db/drizzle";
import {
  candidatesTable,
  resumesTable,
  resumeAnalysisTable,
} from "@/db/schema";

export async function saveResumeAnalysis(data: {
  fullName: string;
  email: string;
  fileName: string;
  resumeText: string;
  summary: string;
  skills: string[];
  experienceYears?: number;
}) {
  // 1️⃣ Candidate
  const [candidate] = await db
    .insert(candidatesTable)
    .values({
      fullName: data.fullName,
      email: data.email,
    })
    .returning();

  // 2️⃣ Resume
  const [resume] = await db
    .insert(resumesTable)
    .values({
      candidateId: candidate.id,
      fileName: data.fileName,
      extractedText: data.resumeText,
      status: "analyzed",
    })
    .returning();

  // 3️⃣ Analysis
  await db.insert(resumeAnalysisTable).values({
    resumeId: resume.id,
    summary: data.summary,
    skills: data.skills,
    experienceYears: data.experienceYears,
  });

  return { success: true };
}
