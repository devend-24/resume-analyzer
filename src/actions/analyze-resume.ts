"use server";

import { groq } from "@/lib/groq";

export async function analyzeResume(resumeText: string) {
  if (!resumeText) {
    throw new Error("Resume text is empty");
  }

  const prompt = `
Analyze the following resume and return:
1. A short professional summary
2. A list of key skills
3. Estimated years of experience

Resume:
${resumeText}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No response from AI");
  }

  return {
    summary: content,   // raw summary for now
    skills: [],         // next step: structured parsing
    experienceYears: null,
  };
}
