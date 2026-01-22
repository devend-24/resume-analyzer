"use client";

import { useState, useEffect } from "react";

type ResumeInsightsProps = {
  resumeText: string;
  isAnalyzed: boolean;
};

type InsightsData = {
  score: number;
  strengths: string[];
  improvements: string[];
  keywordMatch: number;
  readabilityScore: string;
};

export default function ResumeInsights({ resumeText, isAnalyzed }: ResumeInsightsProps) {
  const [insights, setInsights] = useState<InsightsData | null>(null);

  useEffect(() => {
    if (isAnalyzed && resumeText) {
      const calculatedInsights = calculateInsights(resumeText);
      setInsights(calculatedInsights);
    } else {
      setInsights(null);
    }
  }, [isAnalyzed, resumeText]);

  const calculateInsights = (text: string): InsightsData => {
    const wordCount = text.split(/\s+/).length;
    const hasMetrics = /\d+%|\d+ years?|increased|decreased|improved/i.test(text);
    const hasAction = /led|managed|developed|created|designed|implemented/i.test(text);
    const hasEducation = /university|college|degree|bachelor|master/i.test(text);
    const hasCertifications = /certified|certification|license/i.test(text);
    
    let score = 50;
    if (wordCount > 200) score += 10;
    if (wordCount > 400) score += 5;
    if (hasMetrics) score += 15;
    if (hasAction) score += 10;
    if (hasEducation) score += 5;
    if (hasCertifications) score += 5;
    
    const techKeywords = ['react', 'python', 'javascript', 'node', 'sql', 'aws', 'docker', 'git'];
    const keywordCount = techKeywords.filter(kw => 
      text.toLowerCase().includes(kw)
    ).length;
    const keywordMatch = Math.min((keywordCount / techKeywords.length) * 100, 100);

    const avgWordLength = text.replace(/\s+/g, '').length / wordCount;
    const readabilityScore = avgWordLength < 6 ? "Excellent" : avgWordLength < 7 ? "Good" : "Fair";

    const strengths: string[] = [];
    if (hasMetrics) strengths.push("Includes quantifiable achievements");
    if (hasAction) strengths.push("Uses strong action verbs");
    if (hasEducation) strengths.push("Clear educational background");
    if (wordCount > 300) strengths.push("Comprehensive content");
    if (keywordMatch > 50) strengths.push("Good keyword optimization");

    const improvements: string[] = [];
    if (!hasMetrics) improvements.push("Add measurable impact metrics");
    if (!hasAction) improvements.push("Use more action verbs");
    if (wordCount < 200) improvements.push("Expand on experience details");
    if (!hasCertifications) improvements.push("Consider adding certifications");
    if (keywordMatch < 30) improvements.push("Include more industry keywords");

    return {
      score: Math.min(score, 100),
      strengths: strengths.slice(0, 4),
      improvements: improvements.slice(0, 3),
      keywordMatch: Math.round(keywordMatch),
      readabilityScore,
    };
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-full">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Resume Insights
        </h3>
      </div>

      <div className="p-6">
        {!insights && (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-slate-500 mt-4 text-sm">Upload and analyze a resume to see insights</p>
          </div>
        )}

        {insights && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Overall Score</p>
                  <div className="flex items-baseline mt-2">
                    <p className="text-4xl font-bold text-indigo-600">{insights.score}</p>
                    <p className="text-xl text-slate-400 ml-1">/ 100</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {insights.score >= 80 ? "Excellent resume!" : 
                     insights.score >= 60 ? "Good, with room for improvement" : 
                     "Needs significant improvements"}
                  </p>
                </div>
                <div className="w-20 h-20">
                  <svg className="transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e0e7ff"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                      strokeDasharray={`${insights.score}, 100`}
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-blue-900">Keyword Match</p>
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-blue-600">{insights.keywordMatch}%</p>
                <div className="mt-2 bg-blue-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${insights.keywordMatch}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-green-900">Readability</p>
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-green-600">{insights.readabilityScore}</p>
                <p className="text-xs text-green-700 mt-1">Clarity score</p>
              </div>
            </div>

            {insights.strengths.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-slate-800">Strengths</h4>
                </div>
                <ul className="space-y-2">
                  {insights.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-sm text-slate-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {insights.improvements.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-slate-800">Areas for Improvement</h4>
                </div>
                <ul className="space-y-2">
                  {insights.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-sm text-slate-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            
          </div>
        )}
      </div>
    </div>
  );
}