"use server";

import { groq } from "@/lib/groq";

type ResumeAnalysis = {
  summary: string;
  skills: string[];
  experienceYears: number | null;
};

/**
 * Strips markdown code blocks from AI response
 * Handles: ```json ... ```, ```...```, or just plain text
 */
function cleanAIResponse(content: string): string {
  return content
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();
}

/**
 * Extracts JSON from text that might contain extra content
 * Looks for the first { ... } block
 */
function extractJSON(text: string): string {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : text;
}

export async function analyzeResume(
  resumeText: string
): Promise<ResumeAnalysis> {
  if (!resumeText) {
    throw new Error("Resume text is empty");
  }

  const prompt = `You are an expert recruiter and resume analyzer.

Analyze the following resume text and return ONLY a raw JSON object (no markdown code blocks, no explanations, no additional text).

Required JSON structure:
{
  "summary": "A short professional summary (2-3 sentences highlighting key expertise and experience)",
  "skills": ["skill1", "skill2", "skill3"],
  "experienceYears": number
}

Rules:
- Return ONLY the JSON object, nothing else
- Do NOT wrap the response in markdown code blocks
- Skills should be an array of the most important technical skills (limit to 15-20)
- experienceYears should be the total years of professional experience (use 0 for fresh graduates)
- Summary should be professional and concise

Resume:
${resumeText}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a JSON-only API. Return only valid JSON without markdown formatting or explanations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2, // Lower temperature for more consistent JSON output
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Clean the response
    let cleanedContent = cleanAIResponse(content);
    
    // Try to extract JSON if there's extra text
    cleanedContent = extractJSON(cleanedContent);

    // Parse JSON
    let analysis: ResumeAnalysis;
    try {
      const parsed = JSON.parse(cleanedContent);

      // Validate the structure
      analysis = {
        summary: parsed.summary || "No summary available",
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        experienceYears:
          typeof parsed.experienceYears === "number"
            ? parsed.experienceYears
            : null,
      };
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Cleaned content:", cleanedContent);
      
      // Fallback: return raw content as summary
      analysis = {
        summary: cleanedContent.substring(0, 500), // Limit length
        skills: [],
        experienceYears: null,
      };
    }

    return analysis;
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error(
      error instanceof Error
        ? `Failed to analyze resume: ${error.message}`
        : "Failed to analyze resume"
    );
  }
}