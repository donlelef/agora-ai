"use client";

import React, { useMemo } from "react";

interface WordCloudProps {
  replies: Array<{ reply: string; sentiment: "positive" | "neutral" | "negative" }>;
}

interface WordData {
  word: string;
  count: number;
  sentiment: "positive" | "neutral" | "negative";
}

export function WordCloud({ replies }: WordCloudProps) {
  const wordData = useMemo(() => {
    // Common words to exclude
    const stopWords = new Set([
      "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
      "of", "with", "by", "from", "as", "is", "was", "are", "be", "been",
      "being", "have", "has", "had", "do", "does", "did", "will", "would",
      "could", "should", "may", "might", "must", "can", "this", "that",
      "these", "those", "i", "you", "he", "she", "it", "we", "they", "what",
      "which", "who", "when", "where", "why", "how", "all", "each", "every",
      "both", "few", "more", "most", "other", "some", "such", "no", "nor",
      "not", "only", "own", "same", "so", "than", "too", "very", "just",
      "really", "think", "like", "get", "got", "going", "go", "me", "my",
      "your", "their", "its", "our"
    ]);

    // Extract words and their sentiments
    const wordMap = new Map<string, { count: number; sentiments: string[] }>();

    replies.forEach(({ reply, sentiment }) => {
      // Extract words, remove punctuation, convert to lowercase
      const words = reply
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 3 && !stopWords.has(word));

      words.forEach((word) => {
        const existing = wordMap.get(word) || { count: 0, sentiments: [] };
        existing.count += 1;
        existing.sentiments.push(sentiment);
        wordMap.set(word, existing);
      });
    });

    // Convert to array and get dominant sentiment for each word
    const wordsArray: WordData[] = Array.from(wordMap.entries())
      .map(([word, data]) => {
        // Determine dominant sentiment
        const sentimentCounts = {
          positive: data.sentiments.filter((s) => s === "positive").length,
          neutral: data.sentiments.filter((s) => s === "neutral").length,
          negative: data.sentiments.filter((s) => s === "negative").length,
        };

        let dominantSentiment: "positive" | "neutral" | "negative" = "neutral";
        if (sentimentCounts.positive > sentimentCounts.neutral && sentimentCounts.positive > sentimentCounts.negative) {
          dominantSentiment = "positive";
        } else if (sentimentCounts.negative > sentimentCounts.neutral && sentimentCounts.negative > sentimentCounts.positive) {
          dominantSentiment = "negative";
        }

        return {
          word,
          count: data.count,
          sentiment: dominantSentiment,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 30); // Top 30 words

    return wordsArray;
  }, [replies]);

  const getSentimentColor = (sentiment: "positive" | "neutral" | "negative") => {
    switch (sentiment) {
      case "positive":
        return "text-green-500";
      case "negative":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getFontSize = (count: number, maxCount: number) => {
    // Scale font size from 0.75rem to 3rem
    const minSize = 0.75;
    const maxSize = 3;
    const ratio = count / maxCount;
    return minSize + ratio * (maxSize - minSize);
  };

  const maxCount = wordData[0]?.count || 1;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Reaction Keywords</h3>
      
      <div className="w-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 flex items-center justify-center">
        <div className="flex flex-wrap gap-3 justify-center items-center max-w-4xl">
          {wordData.map((item, index) => (
            <span
              key={index}
              className={`font-bold ${getSentimentColor(item.sentiment)} transition-all hover:scale-110 cursor-default inline-block`}
              style={{
                fontSize: `${getFontSize(item.count, maxCount)}rem`,
                opacity: 0.7 + (item.count / maxCount) * 0.3,
              }}
              title={`${item.word} (${item.count} mentions, ${item.sentiment})`}
            >
              {item.word}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Positive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
          <span className="text-gray-600">Neutral</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Negative</span>
        </div>
      </div>
    </div>
  );
}

