"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Building2, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "explore",
    title: "Question bank",
    description: "Filter questions by difficulty, company, or topic, and check them off as you solve them.",
    icon: Code2,
    ui: (
      <div className="w-full h-full bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        {/* Mock Toolbar */}
        <div className="h-11 border-b border-border bg-secondary/50 flex items-center px-4 gap-3">
          <div className="h-5 w-44 bg-foreground/10 rounded-md"></div>
          <div className="ml-auto flex gap-2">
            <div className="h-5 w-16 bg-foreground/10 rounded-md"></div>
            <div className="h-5 w-16 bg-foreground/10 rounded-md"></div>
          </div>
        </div>
        {/* Mock Metric Cards */}
        <div className="p-4 grid grid-cols-4 gap-3 bg-card">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-14 bg-secondary rounded-lg border border-border"></div>
          ))}
        </div>
        {/* Mock Table Rows */}
        <div className="flex-1 p-4 space-y-2 bg-card overflow-hidden relative">
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent z-10"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-secondary/60 rounded-lg flex items-center px-3 border border-border">
              <div className="h-4 w-4 rounded bg-signal-easy/70 mr-3"></div>
              <div className="h-2.5 w-32 bg-foreground/20 rounded-full"></div>
              <div className="ml-auto h-4 w-14 bg-primary/20 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "companies",
    title: "Company lists",
    description: "See what questions Google, Meta, Amazon, and over 680 other companies ask most often in interviews.",
    icon: Building2,
    ui: (
      <div className="w-full h-full bg-card border border-border rounded-xl overflow-hidden flex flex-col p-5 gap-4">
        <div className="space-y-2">
          <div className="h-6 w-40 bg-foreground/15 rounded-md"></div>
          <div className="h-3 w-64 bg-foreground/10 rounded-full"></div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-1">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-28 bg-secondary/70 rounded-xl border border-border flex flex-col p-3.5 justify-between">
              <div className="flex justify-between items-center">
                <div className="h-8 w-8 bg-foreground/10 rounded-lg"></div>
                <div className="h-3.5 w-10 bg-signal-easy/20 rounded-md"></div>
              </div>
              <div className="h-2.5 w-20 bg-foreground/25 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "planner",
    title: "Planner and timer",
    description: "Schedule questions into your daily plan and use the built-in timer to stay focused during practice.",
    icon: CalendarClock,
    ui: (
      <div className="w-full h-full bg-card border border-border rounded-xl overflow-hidden flex flex-col p-4 gap-3">
        <div className="h-9 border-b border-border flex items-center justify-between">
          <div className="h-3.5 w-28 bg-foreground/20 rounded-full"></div>
          <div className="flex gap-1.5">
            <div className="h-5 w-12 bg-secondary rounded-md border border-border"></div>
            <div className="h-5 w-12 bg-secondary rounded-md border border-border"></div>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-3">
          <div className="col-span-2 space-y-3">
            <div className="h-44 bg-secondary/50 rounded-xl border border-border p-3.5 space-y-2.5">
              <div className="h-3 w-20 bg-primary/40 rounded-full mb-3"></div>
              {[1, 2, 3].map(i => (
                <div key={i} className="h-6 w-full bg-card rounded-md border border-border"></div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-28 bg-secondary/50 rounded-xl border border-border flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-primary/30 flex items-center justify-center">
                <div className="h-2 w-6 bg-foreground/30 rounded-full"></div>
              </div>
            </div>
            <div className="h-14 bg-secondary/50 rounded-xl border border-border"></div>
          </div>
        </div>
      </div>
    )
  }
];

export default function FeatureCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % features.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full apple-card p-4 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[540px] lg:h-[420px]">
        
        {/* Navigation Pane */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-2">
          {features.map((f, i) => {
            const isActive = i === activeIdx;
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setActiveIdx(i)}
                className={cn(
                  "text-left p-3.5 rounded-xl transition-all duration-150 border cursor-pointer",
                  isActive 
                    ? "bg-secondary border-border shadow-xs" 
                    : "border-transparent hover:bg-secondary/50 text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn("p-1.5 rounded-lg border", isActive ? "bg-card border-border text-primary" : "bg-secondary border-border text-muted-foreground")}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className={cn("font-semibold text-sm", isActive ? "text-foreground font-bold" : "text-muted-foreground")}>
                    {f.title}
                  </h3>
                </div>
                {isActive && (
                  <p className="text-xs leading-relaxed text-muted-foreground mt-2.5 pl-8">
                    {f.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Visual Mock Pane */}
        <div className="lg:col-span-8 bg-secondary/50 rounded-xl border border-border relative overflow-hidden flex items-center justify-center p-4 lg:p-6">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeIdx}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full h-full"
            >
              {features[activeIdx].ui}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
