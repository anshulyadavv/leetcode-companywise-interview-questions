"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

function GithubIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const roadmapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close roadmap popover on route change
  useEffect(() => {
    setShowRoadmap(false);
  }, [pathname]);

  // Robust document-level click outside & escape listener
  useEffect(() => {
    if (!showRoadmap) return;

    function handlePointerDown(e: MouseEvent | TouchEvent) {
      if (roadmapRef.current && !roadmapRef.current.contains(e.target as Node)) {
        setShowRoadmap(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowRoadmap(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showRoadmap]);

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 mx-auto z-50 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] max-w-6xl transition-all">
      <nav className="h-13 sm:h-14 px-3 sm:px-4 flex items-center justify-between rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white/85 dark:bg-[#18181b]/85 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-colors">
        {/* Left: Brand + Nav links */}
        <div className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2.5 transition-opacity hover:opacity-85 shrink-0"
          >
            <div className="bg-foreground text-background p-1.5 rounded-xl flex items-center justify-center shadow-xs">
              <Code className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">
              CodePractice
            </span>
          </Link>

          <div className="ml-4 sm:ml-7 flex items-center gap-0.5 sm:gap-1.5">
            <Link
              href="/explore"
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors select-none",
                pathname === "/explore"
                  ? "text-foreground font-semibold bg-black/[0.05] dark:bg-white/[0.08]"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
              )}
            >
              Questions
            </Link>

            {/* Roadmap element next to Questions */}
            <div ref={roadmapRef} className="relative">
              <button
                onClick={() => setShowRoadmap(v => !v)}
                className={cn(
                  "px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors select-none flex items-center gap-1.5 cursor-pointer",
                  showRoadmap || pathname === "/roadmap"
                    ? "text-foreground font-semibold bg-black/[0.05] dark:bg-white/[0.08]"
                    : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                )}
                title="Roadmap (under development)"
                aria-label="Roadmap (under development)"
                aria-expanded={showRoadmap}
              >
                <span>Roadmap</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-secondary border border-border text-muted-foreground hidden sm:inline">
                  Soon
                </span>
              </button>

              {showRoadmap && (
                <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 apple-card p-4 shadow-2xl border border-border z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-signal-medium animate-pulse" />
                        <span className="text-xs font-bold text-foreground">Roadmap</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border">
                          In progress
                        </span>
                        <button
                          onClick={() => setShowRoadmap(false)}
                          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          aria-label="Close roadmap dialog"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-foreground">
                      Under development, more updates to come
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We are working on dedicated practice modules for system design and computer science fundamentals.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/companies"
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors select-none",
                pathname.startsWith("/companies") || pathname.startsWith("/company")
                  ? "text-foreground font-semibold bg-black/[0.05] dark:bg-white/[0.08]"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
              )}
            >
              Companies
            </Link>

            <Link
              href="/planner"
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors select-none",
                pathname.startsWith("/planner")
                  ? "text-foreground font-semibold bg-black/[0.05] dark:bg-white/[0.08]"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
              )}
            >
              Planner
            </Link>
          </div>
        </div>

        {/* Right: GitHub + Theme Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* GitHub Pill Button */}
          <a
            href="https://github.com/anshulyadavv/leetcode-companywise-interview-questions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/70 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            aria-label="GitHub repository"
          >
            <GithubIcon className="h-3.5 w-3.5 text-foreground" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-8 w-8 rounded-xl border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && theme === 'dark' ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
