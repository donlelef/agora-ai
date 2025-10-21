import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agora AI - Social Media Post Simulator",
  description:
    "Simulate, analyze, and optimize your social media posts before you publish. Test your ideas against custom AI audiences.",
  keywords: [
    "social media",
    "AI",
    "simulation",
    "content optimization",
    "Twitter",
    "X",
    "audience testing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

