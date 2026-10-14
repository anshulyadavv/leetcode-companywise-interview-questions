"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Compass, Calendar as CalendarIcon, Building2, Sun, Moon, Plus, CornerDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useDataStore } from "@/lib/data-store";

type Command = {
  id: string;
  title: string;
  category: "Navigation" | "Theme" | "Planner";
  icon: any;
  action: () => void;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMac, setIsMac] = useState(false);

  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { addPlannerTask } = useDataStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const taskInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const platform = (navigator as any)?.userAgentData?.platform || navigator?.platform || "";
      setIsMac(/mac/i.test(platform));
    }
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Handles both Ctrl+K on Windows/Linux and Cmd+K on macOS
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") {
        if (isCreatingTask) {
          setIsCreatingTask(false);
          setTimeout(() => inputRef.current?.focus(), 50);
        } else {
          setOpen(false);
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isCreatingTask]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIsCreatingTask(false);
      setTaskTitle("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const commands: Command[] = [
    {
      id: "nav-explore",
      title: "View all questions",
      category: "Navigation",
      icon: Compass,
      action: () => router.push("/explore")
    },
    {
      id: "nav-companies",
      title: "Browse companies",
      category: "Navigation",
      icon: Building2,
      action: () => router.push("/companies")
    },
    {
      id: "nav-planner",
      title: "Open planner",
      category: "Navigation",
      icon: CalendarIcon,
      action: () => router.push("/planner")
    },
    {
      id: "theme-toggle",
      title: theme === "dark" ? "Use light theme" : "Use dark theme",
      category: "Theme",
      icon: theme === "dark" ? Sun : Moon,
      action: () => setTheme(theme === "dark" ? "light" : "dark")
    },
    {
      id: "create-task",
      title: "Add a task for today",
      category: "Planner",
      icon: Plus,
      action: () => {
        setIsCreatingTask(true);
        setTimeout(() => taskInputRef.current?.focus(), 50);
      }
    }
  ];

  const filteredCommands = query
    ? commands.filter(cmd => cmd.title.toLowerCase().includes(query.toLowerCase()) || cmd.category.toLowerCase().includes(query.toLowerCase()))
    : commands;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const runCommand = (cmd: Command) => {
    cmd.action();
    if (cmd.id !== "create-task") {
      setOpen(false);
    }
  };

  const handleCreateTask = () => {
    if (!taskTitle.trim()) return;
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    addPlannerTask(dateKey, taskTitle.trim());
    setIsCreatingTask(false);
    setOpen(false);
  };

  if (!open) return null;

  const shortcutLabel = isMac ? "⌘K" : "Ctrl + K";

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setOpen(false)}
      />
      
      {/* Command Window */}
      <div className="relative w-full max-w-lg liquid-glass rounded-2xl shadow-2xl overflow-hidden ring-1 ring-border transition-all">
        {!isCreatingTask ? (
          <>
            <div className="flex items-center px-4 py-3 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground"
                placeholder="Search pages or run an action..."
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedIndex(i => Math.min(filteredCommands.length - 1, i + 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedIndex(i => Math.max(0, i - 1));
                  } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
                    runCommand(filteredCommands[selectedIndex]);
                  }
                }}
              />
              <span className="text-[11px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border">
                ESC
              </span>
            </div>

            <div className="max-h-[300px] overflow-y-auto p-1.5 space-y-0.5">
              {filteredCommands.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No matching commands.
                </div>
              ) : (
                filteredCommands.map((cmd, i) => {
                  const Icon = cmd.icon;
                  const isSelected = i === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => runCommand(cmd)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                        isSelected 
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs" 
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                        <span>{cmd.title}</span>
                      </div>
                      <span className={`text-[10px] uppercase tracking-wider font-semibold ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {cmd.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-semibold text-foreground">Add task to today</span>
              <button 
                onClick={() => setIsCreatingTask(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Back
              </button>
            </div>
            <div className="space-y-3">
              <input
                ref={taskInputRef}
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="What do you want to practice?"
                className="input-apple text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateTask();
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsCreatingTask(false)}
                  className="btn-secondary px-3 py-1.5 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTask}
                  disabled={!taskTitle.trim()}
                  className="btn-primary px-3 py-1.5 text-xs disabled:opacity-40"
                >
                  Save task <CornerDownLeft className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="px-3.5 py-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground bg-secondary/30">
          <span>{shortcutLabel} to toggle</span>
          <div className="flex items-center gap-2">
            <span>Navigate: <kbd className="px-1 py-0.5 bg-secondary border border-border rounded text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 bg-secondary border border-border rounded text-[10px]">↓</kbd></span>
            <span>Select: <kbd className="px-1 py-0.5 bg-secondary border border-border rounded text-[10px]">↵</kbd></span>
          </div>
        </div>
      </div>
    </div>
  );
}
