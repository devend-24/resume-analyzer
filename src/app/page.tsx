"use client";

import { useState } from "react";
import ResumeUpload from "@/components/resume/fileUpload";
import ResumeSummary from "@/components/resume/ResumeSummary";
import ResumeInsights from "@/components/resume/ResumeInsights";
import toast from "react-hot-toast";
import { saveResumeAnalysis } from "@/actions/save-resume";
import { analyzeResume } from "@/actions/analyze-resume";

type AnalysisResult = {
  summary: string;
  skills: string[];
  experienceYears: number | null;
};

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    if (!resumeText) return;

    setLoading(true);
    setError(null);

    try {
      // Call AI server action
      const result = await analyzeResume(resumeText);
      setAnalysis(result);
      setIsAnalyzed(true); // ← Add this!

      // Save to database
      await saveResumeAnalysis({
        fullName: result.fullName ?? "Unknown",
        email: result.email ?? "",
        fileName,
        resumeText,
        summary: result.summary,
        skills: result.skills,
        experienceYears:
          result.experienceYears === null
            ? undefined
      : result.experienceYears,
      });

      toast.success('Resume analyzed and saved successfully!');
      
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || "Failed to generate summary");
      toast.error('Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ResumeAI
                </h1>
                <p className="text-xs text-slate-500">Intelligent Analysis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                Stage 1
              </span>
              <span className="text-slate-400">→</span>
              <span className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-full">
                Stage 2
              </span>
              <span className="text-slate-400">→</span>
              <span className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-full">
                Stage 3
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Resume Analysis</h2>
          <p className="text-slate-600 mt-2">Upload a resume and get AI-powered insights instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* LEFT COLUMN */}
          <div className="flex flex-col h-full space-y-6">
            {/* Upload Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 rounded-t-2xl">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Resume
                </h3>
              </div>
              
              <div className="p-6">
                <ResumeUpload
                  onSuccess={(text: string, name: string) => {
                    setResumeText(text);
                    setFileName(name);
                    toast.success(`${name} uploaded successfully!`, {
                      duration: 4000,
                      icon: '✅',
                    });
                  }}
                />
              </div>
            </div>

            {/* Insights Section */}
            <div className="flex-1">
              <ResumeInsights 
                resumeText={resumeText} 
                isAnalyzed={isAnalyzed} 
              />
            </div>
          </div>

          {/* RIGHT COLUMN - Analysis */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Analysis
              </h3>
            </div>
            
            <div className="p-6">
              <ResumeSummary
                resumeText={resumeText}
                analysis={analysis}
                loading={loading}
                error={error}
                onGenerate={handleGenerateSummary}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}