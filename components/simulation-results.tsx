"use client";

import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { TwitterPost } from "./twitter-post";
import { NPSGauge } from "./nps-gauge";
import { WordCloud } from "./word-cloud";
import type { SimulationResult } from "@/core/types";

interface SimulationResultsProps {
  results: SimulationResult;
}

export function SimulationResults({ results }: SimulationResultsProps) {
  const [showAllReplies, setShowAllReplies] = useState(false);

  const bestVariant = results.variants[results.bestVariantIndex];
  const otherVariants = results.variants
    .filter((_, idx) => idx !== results.bestVariantIndex)
    .sort((a, b) => b.nps - a.nps); // Sort by NPS descending

  const getNPSColor = (nps: number) => {
    if (nps >= 50) return "success";
    if (nps >= 0) return "info";
    if (nps >= -50) return "warning";
    return "danger";
  };

  const getSentimentIcon = (sentiment: "positive" | "neutral" | "negative") => {
    switch (sentiment) {
      case "positive":
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
        );
      case "negative":
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 20 20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        );
    }
  };

  // Generate consistent avatar initials and color
  const getAvatarInfo = (description: string) => {
    const words = description.split(" ");
    const initials = words.length >= 2 
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0]?.slice(0, 2).toUpperCase() || "U";
    
    const colors = [
      "from-purple-400 to-purple-600",
      "from-pink-400 to-pink-600",
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600",
      "from-yellow-400 to-yellow-600",
      "from-red-400 to-red-600",
      "from-indigo-400 to-indigo-600",
      "from-teal-400 to-teal-600",
    ];
    const hash = description.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = colors[hash % colors.length];
    
    return { initials, color };
  };

  const getDisplayName = (description: string) => {
    const words = description.split(" ");
    if (words.length >= 2) {
      return `${words[0]} ${words[1]}`;
    }
    return words[0] || "User";
  };

  const visibleReplies = showAllReplies ? bestVariant.replies : bestVariant.replies.slice(0, 6);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Winning Tweet */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <TwitterPost text={bestVariant.text} verified={true} />
        </div>
      </div>

      {/* NPS and Word Cloud - Smaller, side by side */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          <div className="p-4">
            <div className="scale-75 origin-top">
              <NPSGauge score={bestVariant.nps} />
            </div>
          </div>
          <div className="p-4">
            <div className="scale-75 origin-top">
              <WordCloud replies={bestVariant.replies} />
            </div>
          </div>
        </div>
      </div>

      {/* Reactions Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">
            Reactions ({bestVariant.replies.length})
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleReplies.map((reply, idx) => {
              const { initials, color } = getAvatarInfo(reply.personaDescription);
              const displayName = getDisplayName(reply.personaDescription);
              
              return (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0`}
                    >
                      {initials}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 text-sm truncate">
                          {displayName}
                        </h4>
                        <div className="flex-shrink-0">
                          {getSentimentIcon(reply.sentiment)}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                        {reply.personaDescription}
                      </p>
                      <p className="text-sm text-gray-900 line-clamp-3">
                        {reply.reply}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {!showAllReplies && bestVariant.replies.length > 6 && (
            <div className="mt-6 text-center">
              <Button
                onClick={() => setShowAllReplies(true)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                View all {bestVariant.replies.length} reactions
              </Button>
            </div>
          )}
          
          {showAllReplies && (
            <div className="mt-6 text-center">
              <Button
                onClick={() => setShowAllReplies(false)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Show less
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Other Variants */}
      {otherVariants.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900">
              Other Variants
            </h3>
          </div>
          
          <div className="p-6 space-y-6">
            {otherVariants.map((variant, idx) => {
              const actualIndex = results.variants.findIndex(v => v === variant);
              return (
                <div key={idx} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">
                      Variant #{actualIndex + 1}
                    </h4>
                    <Badge
                      variant={getNPSColor(variant.nps)}
                      className="text-sm px-3 py-1"
                    >
                      NPS: {variant.nps}
                    </Badge>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <TwitterPost text={variant.text} verified={true} />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="text-2xl font-bold text-green-600">
                        {variant.replies.filter(r => r.sentiment === "positive").length}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-xs text-green-700 mt-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        Positive
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="text-2xl font-bold text-gray-600">
                        {variant.replies.filter(r => r.sentiment === "neutral").length}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-700 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                        </svg>
                        Neutral
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <div className="text-2xl font-bold text-red-600">
                        {variant.replies.filter(r => r.sentiment === "negative").length}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-xs text-red-700 mt-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                        </svg>
                        Negative
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

