"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Questions", href: "/explore" },
  { name: "Companies", href: "/companies" },
  { name: "Planner",   href: "/planner" },
];

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

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 mx-auto z-50 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] max-w-6xl transition-all">
      <nav className="h-13 sm:h-14 px-3 sm:px-4 flex items-center justify-between rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white/85 dark:bg-[#18181b]/85 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-colors">
        {/* Left: Brand + Nav links immediately adjacent */}
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
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors select-none",
                    isActive
                      ? "text-foreground font-semibold bg-black/[0.05] dark:bg-white/[0.08]"
                      : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
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
