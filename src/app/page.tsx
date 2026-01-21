"use client";

import { useState } from "react";
import ResumeUpload from "@/components/resume/fileUpload";
import ResumeSummary from "@/components/resume/ResumeSummary";
import ResumeInsights from "@/components/resume/ResumeInsights";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);

    setTimeout(() => {
      setSummary(
        "The candidate has 3+ years of experience in frontend development, specializing in React and Next.js."
      );
      setSkills(["React", "Next.js", "TypeScript", "Tailwind CSS"]);
      setLoading(false);
    }, 1500);
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
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
                  }}
                />
                
                {fileName && (
                  <div className="mt-4 flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-900 truncate">{fileName}</p>
                      <p className="text-xs text-green-700">Successfully uploaded</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Total Resumes</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{fileName ? 1 : 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Analyzed</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{summary ? 1 : 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights Section */}
            <ResumeInsights 
              resumeText={resumeText} 
              isAnalyzed={isAnalyzed} 
            />
          </div>

          {/* RIGHT COLUMN - Analysis */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 overflow-hidden lg:sticky lg:top-24 lg:self-start">
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
                resumeId={1}
                onAnalysisComplete={() => setIsAnalyzed(true)} // This will set it to true
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}