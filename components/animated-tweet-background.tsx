"use client";

import React from "react";

interface MockTweet {
  text: string;
  username: string;
  handle: string;
  verified?: boolean;
}

const mockTweets: MockTweet[] = [
  { text: "Just launched our new product! 🚀 Can't wait to hear what you all think!", username: "TechStartup", handle: "techstartup", verified: true },
  { text: "Coffee first, adulting second ☕️", username: "Morning Person", handle: "morningperson" },
  { text: "The secret to success? Consistency over intensity. Keep showing up.", username: "MotivationDaily", handle: "motivationdaily", verified: true },
  { text: "Pro tip: Always backup your code before making major changes 💾", username: "DevTips", handle: "devtips" },
  { text: "Excited to announce I'll be speaking at TechCon 2025! See you there! 🎤", username: "Sarah Chen", handle: "sarahchen", verified: true },
  { text: "Weekend vibes 🌴☀️", username: "Travel Junkie", handle: "traveljunkie" },
  { text: "New blog post: 10 ways to improve your productivity without burning out", username: "ProductivityPro", handle: "productivitypro", verified: true },
  { text: "Sometimes the best code is the code you delete 🗑️", username: "CodeWisdom", handle: "codewisdom" },
  { text: "Just finished reading an amazing book. Highly recommend! 📚", username: "BookLover", handle: "booklover" },
  { text: "Remember: Progress over perfection ✨", username: "MindsetMatters", handle: "mindsetmatters" },
  { text: "Beta testing going great! Thanks to everyone who's providing feedback 🙌", username: "StartupLife", handle: "startuplife", verified: true },
  { text: "The future of AI is here, and it's incredible 🤖", username: "AI Enthusiast", handle: "aienthusiast", verified: true },
  { text: "Nothing beats a good workout to start the day 💪", username: "FitLife", handle: "fitlife" },
  { text: "Design is not just what it looks like. Design is how it works. - Steve Jobs", username: "DesignQuotes", handle: "designquotes" },
  { text: "Grateful for this amazing community 💙", username: "Community First", handle: "communityfirst" },
  { text: "Working on something exciting. Stay tuned! 👀", username: "Innovation Lab", handle: "innovationlab", verified: true },
  { text: "Life is too short to write boring code", username: "Creative Coder", handle: "creativecoder" },
  { text: "Just hit 10k followers! Thank you all so much! 🎉", username: "Growing Creator", handle: "growingcreator" },
  { text: "The best investment you can make is in yourself 📈", username: "FinanceGuru", handle: "financeguru", verified: true },
  { text: "Debugging is like being a detective in a crime movie where you're also the murderer", username: "Dev Humor", handle: "devhumor" },
  { text: "Sunset views never get old 🌅", username: "Nature Lover", handle: "naturelover" },
  { text: "Shipping features faster with the new CI/CD pipeline! ⚡", username: "DevOps Pro", handle: "devopspro", verified: true },
  { text: "Important: Always prioritize your mental health", username: "Wellness Coach", handle: "wellnesscoach" },
  { text: "Building in public is scary but incredibly rewarding", username: "Indie Maker", handle: "indiemaker" },
];

function TweetCard({ tweet, delay }: { tweet: MockTweet; delay: number }) {
  return (
    <div 
      className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 p-3 mb-4 shadow-sm hover:shadow-md transition-shadow"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
            {tweet.username.charAt(0)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 mb-1">
            <span className="font-bold text-xs text-gray-900 truncate">
              {tweet.username}
            </span>
            {tweet.verified && (
              <svg className="w-3 h-3 text-[#1d9bf0] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
              </svg>
            )}
          </div>
          <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">
            {tweet.text}
          </p>
        </div>
      </div>
    </div>
  );
}

function TweetColumn({ tweets, direction, delay }: { tweets: MockTweet[]; direction: "up" | "down"; delay: number }) {
  return (
    <div className="relative h-full overflow-hidden">
      <div 
        className={`space-y-4 ${direction === "up" ? "animate-scroll-up" : "animate-scroll-down"}`}
        style={{ animationDelay: `${delay}s` }}
      >
        {tweets.map((tweet, index) => (
          <TweetCard key={`${tweet.handle}-${index}`} tweet={tweet} delay={delay} />
        ))}
        {/* Duplicate for infinite scroll */}
        {tweets.map((tweet, index) => (
          <TweetCard key={`${tweet.handle}-${index}-dup`} tweet={tweet} delay={delay} />
        ))}
      </div>
    </div>
  );
}

export function AnimatedTweetBackground() {
  // Create 6 columns with different tweet sets
  const columns = React.useMemo(() => {
    const shuffled = [...mockTweets].sort(() => Math.random() - 0.5);
    const columnCount = 6;
    const tweetsPerColumn = Math.ceil(shuffled.length / columnCount);
    
    return Array.from({ length: columnCount }, (_, i) => {
      const start = i * tweetsPerColumn;
      const columnTweets = shuffled.slice(start, start + tweetsPerColumn);
      // Pad with random tweets if needed
      while (columnTweets.length < 6) {
        columnTweets.push(shuffled[Math.floor(Math.random() * shuffled.length)]);
      }
      return {
        tweets: columnTweets,
        direction: (i % 2 === 0 ? "up" : "down") as "up" | "down",
        delay: i * 0.5,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f7f9fa] via-transparent to-[#f7f9fa] z-10" />
      <div className="flex gap-4 h-full px-4 pt-20">
        {columns.map((column, index) => (
          <div key={index} className="flex-1 min-w-[180px] max-w-[220px]">
            <TweetColumn {...column} />
          </div>
        ))}
      </div>
    </div>
  );
}

