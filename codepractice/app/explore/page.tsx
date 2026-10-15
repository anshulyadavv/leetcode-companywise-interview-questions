"use client";

import Dashboard from "@/components/Dashboard";

export default function ExplorePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8 pb-20">
      {/* Header */}
      <header className="space-y-1.5 pb-6 border-b border-border">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          All Questions
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
          Browse questions by company, topic, or difficulty, and check them off as you solve them.
        </p>
      </header>

      {/* Main View: Question Tracker alongside Activity Heatmap, filters, and questions table */}
      <Dashboard showHeatmap />
    </div>
  );
}
