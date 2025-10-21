import React from "react";

interface TwitterPostProps {
  text: string;
  username?: string;
  handle?: string;
  verified?: boolean;
  timestamp?: string;
  className?: string;
}

export function TwitterPost({
  text,
  username = "Your Brand",
  handle = "yourbrand",
  verified = false,
  timestamp = "Just now",
  className = "",
}: TwitterPostProps) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors ${className}`}>
      {/* Header */}
      <div className="flex items-start space-x-3">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {username.charAt(0)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* User Info */}
          <div className="flex items-center space-x-1 mb-1">
            <span className="font-bold text-[15px] text-gray-900 hover:underline cursor-pointer">
              {username}
            </span>
            {verified && (
              <svg className="w-5 h-5 text-[#1d9bf0]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
              </svg>
            )}
            <span className="text-[15px] text-gray-500">@{handle}</span>
            <span className="text-gray-500">·</span>
            <span className="text-[15px] text-gray-500">{timestamp}</span>
          </div>

          {/* Post Text */}
          <div className="text-[15px] text-gray-900 whitespace-pre-wrap break-words leading-5">
            {text}
          </div>

          {/* Engagement Buttons */}
          <div className="flex items-center justify-between mt-3 max-w-md">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-[#1d9bf0] transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-pink-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-[#1d9bf0] transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

