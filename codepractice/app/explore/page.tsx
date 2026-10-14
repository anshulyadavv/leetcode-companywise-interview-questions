"use client";

import Tracker from "@/components/Tracker";
import Dashboard from "@/components/Dashboard";

export default function ExplorePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-8 pb-20">
      {/* Header */}
      <header className="space-y-1.5 pb-6 border-b border-border">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          All Questions
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
          Browse questions by company, topic, or difficulty, and check them off as you solve them.
        </p>
      </header>

      {/* Progress Tracking Section */}
      <section className="space-y-3.5">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Your progress
        </h2>
        <Tracker />
      </section>

      {/* Questions Section */}
      <section className="space-y-3.5">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Question list
        </h2>
        <Dashboard />
      </section>
    </div>
  );
}
