import React from "react";

interface TwitterReplyProps {
  text: string;
  personaDescription: string;
  sentiment: "positive" | "neutral" | "negative";
  timestamp?: string;
  className?: string;
}

export function TwitterReply({
  text,
  personaDescription,
  sentiment,
  timestamp = "2m",
  className = "",
}: TwitterReplyProps) {
  // Generate a consistent color for the avatar based on the persona description
  const getAvatarColor = (str: string) => {
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
    const hash = str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getSentimentIcon = () => {
    switch (sentiment) {
      case "positive":
        return (
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      case "negative":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
    }
  };

  // Extract a short name from the persona description
  const getDisplayName = (description: string) => {
    const words = description.split(" ");
    if (words.length >= 2) {
      return `${words[0]} ${words[1]}`;
    }
    return words[0] || "User";
  };

  const getHandle = (description: string) => {
    const name = getDisplayName(description);
    return name.toLowerCase().replace(/[^a-z0-9]/g, "");
  };

  const displayName = getDisplayName(personaDescription);
  const handle = getHandle(personaDescription);
  const initial = displayName.charAt(0).toUpperCase();
  const avatarColor = getAvatarColor(personaDescription);

  return (
    <div className={`bg-white border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors ${className}`}>
      <div className="flex items-start space-x-3">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-sm`}
          >
            {initial}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* User Info */}
          <div className="flex items-center flex-wrap gap-x-1 mb-0.5">
            <span className="font-bold text-[15px] text-gray-900 hover:underline cursor-pointer">
              {displayName}
            </span>
            <span className="text-[15px] text-gray-500">@{handle}</span>
            <span className="text-gray-500">·</span>
            <span className="text-[15px] text-gray-500">{timestamp}</span>
          </div>

          {/* Bio/Description */}
          <div className="text-[13px] text-gray-500 mb-1 line-clamp-1">
            {personaDescription}
          </div>

          {/* Reply Text */}
          <div className="text-[15px] text-gray-900 whitespace-pre-wrap break-words leading-5 mb-2">
            {text}
          </div>

          {/* Engagement Buttons */}
          <div className="flex items-center space-x-12 mt-2">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-[#1d9bf0] transition-colors group">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors group">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              className={`flex items-center space-x-2 transition-colors group ${
                sentiment === "positive" ? "text-pink-600" : "text-gray-500 hover:text-pink-600"
              }`}
            >
              {getSentimentIcon()}
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-[#1d9bf0] transition-colors group">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

