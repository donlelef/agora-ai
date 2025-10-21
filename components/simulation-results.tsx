"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import type { SimulationResult } from "@/core/types";

interface SimulationResultsProps {
  results: SimulationResult;
}

export function SimulationResults({ results }: SimulationResultsProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    results.bestVariantIndex
  );

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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Winner Announcement */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300">
        <CardContent className="py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🏆 Best Performing Variant
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Variant #{results.bestVariantIndex + 1} scored the highest with an
              NPS of {results.variants[results.bestVariantIndex].nps}
            </p>
            <div className="bg-white rounded-lg p-4 max-w-2xl mx-auto shadow-sm">
              <p className="text-base text-gray-900">
                {results.variants[results.bestVariantIndex].text}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variant Selector */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold text-gray-900">
            All Variants - Click to Explore
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.variants.map((variant, index) => (
              <button
                key={index}
                onClick={() => setSelectedVariant(index)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  selectedVariant === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-gray-900">
                    Variant #{index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    {index === results.bestVariantIndex && (
                      <Badge variant="success">Winner</Badge>
                    )}
                    <Badge variant={getNPSColor(variant.nps)}>
                      NPS: {variant.nps}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {variant.text}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis for Selected Variant */}
      <Card>
        <CardHeader className="bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Variant #{selectedVariant + 1} - Detailed Analysis
            </h3>
            <Badge variant={getNPSColor(currentVariant.nps)} className="text-base px-3 py-1">
              NPS: {currentVariant.nps}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Post Text */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Post</h4>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-base text-gray-900">{currentVariant.text}</p>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Sentiment Distribution (50 personas)
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-3xl font-bold text-green-700">
                  {sentimentCounts.positive}
                </div>
                <div className="text-sm text-green-600 mt-1">Positive</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-gray-700">
                  {sentimentCounts.neutral}
                </div>
                <div className="text-sm text-gray-600 mt-1">Neutral</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-3xl font-bold text-red-700">
                  {sentimentCounts.negative}
                </div>
                <div className="text-sm text-red-600 mt-1">Negative</div>
              </div>
            </div>
          </div>

          {/* Key Highlights */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Key Insights
            </h4>
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start">
                  <span className="text-green-600 font-semibold mr-2">✓</span>
                  <div>
                    <div className="text-xs font-semibold text-green-700 uppercase mb-1">
                      Positive
                    </div>
                    <p className="text-sm text-gray-700">
                      {currentVariant.highlights.positive}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <span className="text-gray-600 font-semibold mr-2">○</span>
                  <div>
                    <div className="text-xs font-semibold text-gray-700 uppercase mb-1">
                      Neutral
                    </div>
                    <p className="text-sm text-gray-700">
                      {currentVariant.highlights.neutral}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start">
                  <span className="text-red-600 font-semibold mr-2">✗</span>
                  <div>
                    <div className="text-xs font-semibold text-red-700 uppercase mb-1">
                      Negative
                    </div>
                    <p className="text-sm text-gray-700">
                      {currentVariant.highlights.negative}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Replies */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Sample Replies (showing 10 of 50)
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {currentVariant.replies.slice(0, 10).map((reply, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">
                      {reply.personaDescription}
                    </span>
                    <Badge
                      variant={
                        reply.sentiment === "positive"
                          ? "success"
                          : reply.sentiment === "negative"
                          ? "danger"
                          : "default"
                      }
                      className="ml-2"
                    >
                      {reply.sentiment}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-800">{reply.reply}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

