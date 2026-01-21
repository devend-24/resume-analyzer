"use client";

import { analyzeResume } from "@/actions/analyze-resume";
import { useState } from "react";

type ResumeSummaryProps = {
  resumeText: string;
  resumeId?: number;
  onAnalysisComplete?: () => void; // Add this prop
};

type AnalysisResult = {
  summary: string;
  skills: string[];
  experienceYears: number | null;
};



export default function ResumeSummary({ resumeText, resumeId, onAnalysisComplete }: ResumeSummaryProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    if (!resumeText) return;

    setLoading(true);
    setError(null);

    try {
      // Call AI server action - it now returns clean, parsed data
      const result = await analyzeResume(resumeText);
      setAnalysis(result);

      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 min-h-screen bg-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Resume Analysis</h2>

      {/* Generate Summary Button */}
      <button
        onClick={handleGenerateSummary}
        disabled={loading || !resumeText}
        className="mb-6 px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? "Analyzing..." : "Generate Summary"}
      </button>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Placeholder */}
      {!analysis && !loading && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-4 text-gray-500">
            Upload a resume and click "Generate Summary" to analyze
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Analysis Output */}
      {analysis && !loading && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 text-lg mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Professional Summary
            </h3>
            <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
          </div>

          {/* Experience */}
          {analysis.experienceYears !== null && (
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 text-lg mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Experience
              </h3>
              <p className="text-gray-700">
                <span className="text-2xl font-bold text-gray-900">
                  {analysis.experienceYears}
                </span>{" "}
                {analysis.experienceYears === 1 ? "year" : "years"} of
                professional experience
              </p>
            </div>
          )}

          {/* Skills */}
          {analysis.skills.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 text-lg mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Skills & Technologies
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({analysis.skills.length})
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm rounded-full font-medium hover:bg-blue-200 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}