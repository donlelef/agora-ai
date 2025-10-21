"use client";

import React from "react";

interface NPSGaugeProps {
  score: number;
}

export function NPSGauge({ score }: NPSGaugeProps) {
  // NPS ranges from -100 to 100, normalize to 0-100 for visualization
  const normalizedScore = ((score + 100) / 200) * 100;
  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Determine color and label based on NPS score
  const getScoreInfo = () => {
    if (score >= 70) return { color: "#22c55e", label: "Excellent", textColor: "text-green-600" };
    if (score >= 50) return { color: "#84cc16", label: "Great", textColor: "text-lime-600" };
    if (score >= 30) return { color: "#eab308", label: "Good", textColor: "text-yellow-600" };
    if (score >= 0) return { color: "#f59e0b", label: "Acceptable", textColor: "text-orange-600" };
    if (score >= -30) return { color: "#f97316", label: "Fair", textColor: "text-orange-600" };
    if (score >= -50) return { color: "#ef4444", label: "Poor", textColor: "text-red-600" };
    return { color: "#dc2626", label: "Critical", textColor: "text-red-700" };
  };

  const scoreInfo = getScoreInfo();

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Net Promoter Score</h3>
      
      <div className="relative w-64 h-64">
        {/* Background circle */}
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="128"
            cy="128"
            r="90"
            stroke="#e5e7eb"
            strokeWidth="20"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="128"
            cy="128"
            r="90"
            stroke={scoreInfo.color}
            strokeWidth="20"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-6xl font-bold ${scoreInfo.textColor}`}>
            {score}
          </div>
          <div className="text-gray-600 text-lg mt-2 font-medium">
            {scoreInfo.label}
          </div>
        </div>
      </div>

      {/* Score scale */}
      <div className="w-full max-w-sm mt-6 text-sm text-gray-600 font-medium">
        <div className="flex justify-between">
          <span>-100 (Detractors)</span>
          <span>0 (Passive)</span>
          <span>100 (Promoters)</span>
        </div>
      </div>
    </div>
  );
}

