import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export default function RoadmapPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 space-y-8">
      {/* Back button */}
      <div>
        <Link 
          href="/explore" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Questions</span>
        </Link>
      </div>

      {/* Main Roadmap Card */}
      <div className="apple-card p-8 sm:p-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-xs font-semibold text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-medium animate-pulse" />
          <span>Roadmap</span>
        </div>

        <div className="space-y-3 max-w-lg mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Under development, more updates to come
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            We are working on dedicated modules for system design and computer science fundamentals. We'll be working on this section in upcoming updates.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <Link href="/explore" className="btn-primary text-sm px-6 py-2.5">
            Browse Questions
          </Link>
        </div>
      </div>
    </div>
  );
}
