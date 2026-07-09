"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Calendar, LayoutGrid, Code, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Explore",   href: "/explore",   icon: Globe   },
  { name: "Companies", href: "/companies", icon: LayoutGrid },
  { name: "Planner",   href: "/planner",   icon: Calendar  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const scrollContainer = document.getElementById("main-scroll-container");
    if (!scrollContainer) return;

    const handleScroll = () => {
      const currentScrollY = scrollContainer.scrollTop;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up or at top
      }
      setLastScrollY(currentScrollY);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={cn(
      "fixed left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300",
      isVisible ? "top-5 opacity-100" : "-top-20 opacity-0 pointer-events-none"
    )}>
      <div className="px-3 sm:px-5">
        <div className="flex justify-between h-12 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105 shrink-0">
            <div className="bg-foreground/90 shadow-sm p-1.5 rounded-full flex items-center justify-center">
              <Code className="text-background h-3.5 w-3.5" />
            </div>
            <span className="font-sans font-extrabold text-sm tracking-tight text-foreground/90">
              CodePractice
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative flex items-center px-4 py-1.5 rounded-full text-sm transition-all duration-300",
                    isActive
                      ? "text-foreground font-semibold bg-black/5 dark:bg-white/10 shadow-sm"
                      : "text-muted-foreground font-medium hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10"
                  )}
                >
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="h-6 w-px bg-border max-sm:hidden mx-1" />
            
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-full text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground transition-all"
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
