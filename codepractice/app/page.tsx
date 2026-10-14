"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FeatureCarousel from "@/components/FeatureCarousel";

export default function LandingPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <header className="relative pt-10 sm:pt-14 pb-10 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/planner"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold text-secondary-foreground transition-colors group"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Planner is now available</span>
            <ArrowRight className="h-3 w-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Practice the questions <br className="hidden sm:inline" />
              companies ask most.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              LeetCode problems sorted by how often they appear in interviews at Google, Meta, Amazon, and over 680 other companies.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/explore" className="btn-primary px-6 py-2.5 text-sm">
              View all questions <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/companies" className="btn-secondary px-6 py-2.5 text-sm">
              Browse companies
            </Link>
          </div>
        </div>
      </header>

      {/* Quick stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="apple-card p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-border">
            {[
              { label: "Companies", value: "684+" },
              { label: "Questions", value: "3,300+" },
              { label: "Accounts required", value: "Zero" },
              { label: "Cost", value: "Free" },
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col justify-center ${i > 0 ? "pt-4 md:pt-0 md:pl-6" : ""}`}>
                <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-tabular">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Everything in one place
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Keep your question lists, progress, and study schedule together without juggling tabs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Questions by company",
              desc: "See which problems come up most often at each company, sorted by interview frequency data.",
            },
            {
              title: "Track your progress",
              desc: "Mark problems as solved, see your breakdown across easy, medium, and hard, and pick up right where you left off.",
            },
            {
              title: "Daily study planner",
              desc: "Add problems to daily or weekly queues and use the built-in timer to stay focused during practice sessions.",
            },
          ].map((feature, i) => (
            <div key={i} className="apple-card p-6 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            How it works
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Pick a company, work through their common questions, and track your practice over time.
          </p>
        </div>
        <FeatureCarousel />
      </section>

      {/* Upcoming updates */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-xs font-semibold text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-medium" />
            <span>Roadmap</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Upcoming updates
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We are expanding CodePractice beyond coding questions to cover the full technical interview loop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="apple-card p-6 sm:p-7 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground tracking-tight">
                  System design
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                  In progress
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Core architectural patterns, scalability trade-offs, and deep dives into real system design interview questions asked at top tech companies.
              </p>
            </div>
          </div>

          <div className="apple-card p-6 sm:p-7 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground tracking-tight">
                  Computer fundamentals
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border">
                  Coming soon
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Curated revision modules and common interview questions for operating systems, networking protocols, databases, and concurrency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="apple-card p-8 sm:p-12 text-center space-y-5 bg-gradient-to-b from-card to-secondary/40">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Start practicing
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            No sign-up or setup needed. Pick a company to practice for, or jump straight into the full list.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/explore" className="btn-primary px-6 py-2.5 text-sm">
              View all questions <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/companies" className="btn-secondary px-6 py-2.5 text-sm">
              Browse companies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
