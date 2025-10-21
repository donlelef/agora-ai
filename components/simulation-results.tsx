"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { TwitterPost } from "./twitter-post";
import { TwitterReply } from "./twitter-reply";
import type { SimulationResult } from "@/core/types";

interface SimulationResultsProps {
  results: SimulationResult;
}

export function SimulationResults({ results }: SimulationResultsProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    results.bestVariantIndex
  );
  const [showAllReplies, setShowAllReplies] = useState(false);

  const currentVariant = results.variants[selectedVariant];

  const getNPSColor = (nps: number) => {
    if (nps >= 50) return "success";
    if (nps >= 0) return "info";
    if (nps >= -50) return "warning";
    return "danger";
  };

  const getSentimentCounts = () => {
    const positive = currentVariant.replies.filter(
      (r) => r.sentiment === "positive"
    ).length;
    const neutral = currentVariant.replies.filter(
      (r) => r.sentiment === "neutral"
    ).length;
    const negative = currentVariant.replies.filter(
      (r) => r.sentiment === "negative"
    ).length;
    return { positive, neutral, negative };
  };

  const sentimentCounts = getSentimentCounts();
  const totalReplies = currentVariant.replies.length;
  const visibleReplies = showAllReplies ? currentVariant.replies : currentVariant.replies.slice(0, 10);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Winner Announcement */}
      <div className="bg-gradient-to-r from-[#1d9bf0] to-[#1a8cd8] rounded-2xl p-6 text-white shadow-lg">
        <div className="text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="text-2xl font-bold mb-2">
            Best Performing Variant
          </h2>
          <p className="text-lg opacity-90 mb-4">
            Variant #{results.bestVariantIndex + 1} scored the highest with an NPS of{" "}
            <span className="font-bold text-2xl">{results.variants[results.bestVariantIndex].nps}</span>
          </p>
        </div>
      </div>

      {/* Variant Selector Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">
            All Variants
          </h3>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {results.variants.map((variant, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedVariant(index);
                  setShowAllReplies(false);
                }}
                className={`relative px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedVariant === index
                    ? "bg-[#1d9bf0] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>Variant {index + 1}</span>
                  {index === results.bestVariantIndex && (
                    <span className="text-yellow-300">🏆</span>
                  )}
                  <Badge
                    variant={getNPSColor(variant.nps)}
                    className={selectedVariant === index ? "bg-white/20 border-white/30 text-white" : ""}
                  >
                    {variant.nps}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sentiment Overview */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Sentiment Overview
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <div className="text-4xl font-bold text-green-600">
              {sentimentCounts.positive}
            </div>
            <div className="text-sm text-green-700 mt-1 font-medium">😍 Positive</div>
            <div className="text-xs text-green-600 mt-1">
              {Math.round((sentimentCounts.positive / totalReplies) * 100)}%
            </div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <div className="text-4xl font-bold text-gray-600">
              {sentimentCounts.neutral}
            </div>
            <div className="text-sm text-gray-700 mt-1 font-medium">😐 Neutral</div>
            <div className="text-xs text-gray-600 mt-1">
              {Math.round((sentimentCounts.neutral / totalReplies) * 100)}%
            </div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
            <div className="text-4xl font-bold text-red-600">
              {sentimentCounts.negative}
            </div>
            <div className="text-sm text-red-700 mt-1 font-medium">😞 Negative</div>
            <div className="text-xs text-red-600 mt-1">
              {Math.round((sentimentCounts.negative / totalReplies) * 100)}%
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="space-y-3">
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-green-800 mb-1">
                  What's Working
                </div>
                <p className="text-sm text-gray-700">
                  {currentVariant.highlights.positive}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                ○
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-800 mb-1">
                  Neutral Ground
                </div>
                <p className="text-sm text-gray-700">
                  {currentVariant.highlights.neutral}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                ✗
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-red-800 mb-1">
                  Areas for Improvement
                </div>
                <p className="text-sm text-gray-700">
                  {currentVariant.highlights.negative}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Twitter-like Post and Replies */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">
            Post Preview
          </h3>
        </div>
        
        {/* Main Post */}
        <div className="p-4 border-b-8 border-gray-100">
          <TwitterPost text={currentVariant.text} verified={true} />
        </div>

        {/* Replies Section */}
        <div>
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-bold text-gray-700">
              Replies ({totalReplies})
            </h4>
          </div>
          <div className="divide-y divide-gray-200">
            {visibleReplies.map((reply, idx) => (
              <TwitterReply
                key={idx}
                text={reply.reply}
                personaDescription={reply.personaDescription}
                sentiment={reply.sentiment}
                timestamp={`${Math.floor(Math.random() * 60) + 1}m`}
              />
            ))}
          </div>
          
          {!showAllReplies && totalReplies > 10 && (
            <div className="p-4 text-center border-t border-gray-200">
              <button
                onClick={() => setShowAllReplies(true)}
                className="text-[#1d9bf0] hover:text-[#1a8cd8] font-semibold text-sm transition-colors"
              >
                Show all {totalReplies} replies
              </button>
            </div>
          )}
          
          {showAllReplies && (
            <div className="p-4 text-center border-t border-gray-200">
              <button
                onClick={() => setShowAllReplies(false)}
                className="text-[#1d9bf0] hover:text-[#1a8cd8] font-semibold text-sm transition-colors"
              >
                Show less
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

