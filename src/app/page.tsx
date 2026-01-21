"use client";

import { analyzeResume } from "@/actions/analyze-resume";
import ResumeUpload from "@/components/resume/fileUpload";
import { useState } from "react";


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);

    // 🔹 TEMP: mock AI response (replace with API later)
    setTimeout(() => {
      setSummary(
        "The candidate has 3+ years of experience in frontend development, specializing in React and Next.js."
      );
      setSkills(["React", "Next.js", "TypeScript", "Tailwind CSS"]);
      setLoading(false);
    }, 1500);
  };

  return (
  <div className="min-h-screen p-8">
    <h1 className="text-2xl font-bold mb-6">Stage 1: Resume Analysis</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-6 h-full min-h-screen">
        
        {/* Upload Section */}
        <div className="border rounded-lg p-6 w-full">
          <h2 className="text-lg font-semibold mb-4">Upload Resume</h2>

          <ResumeUpload
            onSuccess={(text, name) => {
              setResumeText(text);
              setFileName(name);
            }}
          />
        </div>

        {/* Stats Section (NEW) */}
        <div className="border rounded-lg p-6 flex-1">
          <h2 className="text-lg font-semibold mb-4">Resume Insights</h2>

          {!summary && (
            <p className="text-gray-500">
              Analyze a resume to see insights.
            </p>
          )}

          {summary && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Resume Score</p>
                <p className="text-2xl font-bold">78 / 100</p>
              </div>

              <div>
                <p className="font-semibold mb-1">Strengths</p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  <li>Strong React & Next.js experience</li>
                  <li>Clear project descriptions</li>
                  <li>Good technical stack</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-1">Weaknesses</p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  <li>No measurable impact metrics</li>
                  <li>Limited backend exposure</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN – FULL HEIGHT */}
      <div className="border rounded-lg p-6 h-full min-h-screen">
        <h2 className="text-lg font-semibold mb-4">Resume Summary</h2>
        

        <button
          disabled={!resumeText || loading}
          onClick={async () => {
            try {
              setLoading(true);

              //call server action
              const result = await analyzeResume(resumeText!);
              setSummary(result.summary);
              setSkills(result.skills ?? []);
            } catch (error){
              console.error(error);
            } finally {
              setLoading(false);
            }
          }}
          className="mt-4 px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Summary"}
        </button>


        {!summary && (
          <p className="text-gray-500">
            Upload a resume and click analyze to see results.
          </p>
        )}

        {summary && (
          <>
            <p className="mb-6">{summary}</p>

            <h3 className="font-semibold mb-2">Extracted Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-sm border rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  </div>

  );
}
