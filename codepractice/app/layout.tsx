import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalPomodoro from "@/components/GlobalPomodoro";
import { ThemeProvider } from "@/components/ThemeProvider";
import CommandPalette from "@/components/CommandPalette";
import { Code } from "lucide-react";

const mono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono",
});

const sans = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CodePractice - Company LeetCode Questions & Tracker",
  description: "Practice interview questions asked by specific companies, track what you solve, and plan your study schedule.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${mono.variable} ${sans.variable} font-sans min-h-screen bg-background text-foreground flex flex-col antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <main className="flex-1 pt-20 sm:pt-22">
            {children}
          </main>
          <Footer />
          <GlobalPomodoro />
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
