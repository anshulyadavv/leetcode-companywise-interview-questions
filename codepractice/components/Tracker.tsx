"use client";

import { useMemo, useState, useEffect } from "react";
import { useDataStore } from "@/lib/data-store";
import { cn } from "@/lib/utils";

export default function Tracker() {
  const { todoLists, questions, completedQuestions, completionDates } = useDataStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    const solvedCount = completedQuestions.length;

    const difficultyDist = completedQuestions.reduce((acc, slug) => {
      const q = questions.find(q => q.slug === slug);
      if (q) acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
      return acc;
    }, { Easy: 0, Medium: 0, Hard: 0 } as Record<string, number>);

    return { solvedCount, difficultyDist };
  }, [completedQuestions, questions]);

  const heatmapDates = useMemo(() => {
    const dates: Date[] = [];
    
    const allItems = todoLists.flatMap(l => l.items);
    allItems.forEach(i => {
      if (i.completed && i.completedAt) dates.push(new Date(i.completedAt));
    });

    Object.values(completionDates || {}).forEach(iso => {
      if (iso) dates.push(new Date(iso));
    });

    return dates;
  }, [todoLists, completionDates]);

  const maxDiff = Math.max(stats.difficultyDist.Easy, stats.difficultyDist.Medium, stats.difficultyDist.Hard, 1);

  if (!mounted) {
    return <div className="h-[360px] w-full animate-pulse bg-secondary/40 rounded-2xl" />;
  }

  return (
    <div className="space-y-6">
      {/* Stat Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatShard label="Total solved" value={stats.solvedCount.toString()} signal="primary" />
        <StatShard label="Easy" value={stats.difficultyDist.Easy.toString()} signal="easy" />
        <StatShard label="Medium" value={stats.difficultyDist.Medium.toString()} signal="medium" />
        <StatShard label="Hard" value={stats.difficultyDist.Hard.toString()} signal="hard" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Heatmap */}
        <div className="lg:col-span-2 apple-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Activity graph
            </h3>
            <div className="flex gap-1.5 items-center">
              <span className="text-xs font-medium text-muted-foreground mr-1">Intensity</span>
              {[0.12, 0.35, 0.6, 0.85, 1].map(opacity => (
                <div 
                  key={opacity} 
                  className="h-3 w-3 rounded-[3px] bg-primary" 
                  style={{ opacity }} 
                />
              ))}
            </div>
          </div>
          <div className="overflow-hidden">
            <ContributionHeatmap dates={heatmapDates} />
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="apple-card p-6 space-y-5">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Difficulty breakdown
          </h3>
          <div className="space-y-4">
            <DifficultyBar 
              label="Easy" 
              count={stats.difficultyDist.Easy} 
              max={maxDiff} 
              barClass="bg-signal-easy" 
            />
            <DifficultyBar 
              label="Medium" 
              count={stats.difficultyDist.Medium} 
              max={maxDiff} 
              barClass="bg-signal-medium" 
            />
            <DifficultyBar 
              label="Hard" 
              count={stats.difficultyDist.Hard} 
              max={maxDiff} 
              barClass="bg-signal-hard" 
            />
          </div>

          {stats.solvedCount === 0 && (
            <div className="pt-3 text-center border-t border-border">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Solve a question from the list to start building your activity graph.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatShard({ 
  label, 
  value, 
  signal 
}: { 
  label: string; 
  value: string; 
  signal: "primary" | "easy" | "medium" | "hard";
}) {
  const signalDots = {
    primary: "bg-primary",
    easy: "bg-signal-easy",
    medium: "bg-signal-medium",
    hard: "bg-signal-hard",
  };

  return (
    <div className="apple-card p-5 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span className={cn("h-2 w-2 rounded-full", signalDots[signal])} />
      </div>
      <div className="mt-4 text-3xl font-bold text-foreground font-tabular tracking-tight">
        {value}
      </div>
    </div>
  );
}

function DifficultyBar({ 
  label, 
  count, 
  max, 
  barClass 
}: { 
  label: string; 
  count: number; 
  max: number; 
  barClass: string;
}) {
  const percentage = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-semibold text-muted-foreground font-tabular">{count} solved</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border/50">
        <div 
          className={cn("h-full transition-all duration-500 ease-out rounded-full", barClass)} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
}

function ContributionHeatmap({ dates }: { dates: Date[] }) {
  const weeks = useMemo(() => {
    const dateCounts = new Map<string, number>();
    dates.forEach(d => {
      const ds = d.toDateString();
      dateCounts.set(ds, (dateCounts.get(ds) || 0) + 1);
    });

    const result = [];
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    
    for (let c = 51; c >= 0; c--) {
      const weekCol = [];
      for (let r = 0; r < 7; r++) {
        const daysAgo = (51 - c) * 7 + (currentDayOfWeek - r);
        
        if (daysAgo < 0) {
          weekCol.push({ count: -1, dateLabel: "", date: null });
        } else {
          const d = new Date(today);
          d.setDate(today.getDate() - daysAgo);
          const count = dateCounts.get(d.toDateString()) || 0;
          const dateLabel = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
          weekCol.push({ count, dateLabel, date: d });
        }
      }
      result.push(weekCol);
    }
    return result;
  }, [dates]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; colIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((weekCols, c) => {
      const validDay = weekCols.find(d => d.date);
      if (validDay && validDay.date) {
        const m = validDay.date.getMonth();
        if (m !== lastMonth) {
          labels.push({ label: validDay.date.toLocaleDateString(undefined, { month: 'short' }), colIndex: c });
          lastMonth = m;
        }
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="flex flex-col w-full overflow-x-auto pb-2">
      {/* Months axis */}
      <div className="flex relative h-5 mb-1.5 text-xs text-muted-foreground font-medium">
        <div className="w-8 shrink-0" />
        <div className="flex-1 relative">
          {monthLabels.map((m, i) => (
            <span 
              key={i} 
              className="absolute"
              style={{ left: `${(m.colIndex / 52) * 100}%` }}
            >
              {m.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Days axis */}
        <div className="flex flex-col gap-[3px] text-[11px] text-muted-foreground font-medium pr-2 shrink-0 pt-0.5">
          <div className="h-3 leading-3 opacity-0">Sun</div>
          <div className="h-[14px] leading-[14px]">Mon</div>
          <div className="h-[14px] leading-[14px] opacity-0">Tue</div>
          <div className="h-[14px] leading-[14px]">Wed</div>
          <div className="h-[14px] leading-[14px] opacity-0">Thu</div>
          <div className="h-[14px] leading-[14px]">Fri</div>
          <div className="h-3 leading-3 opacity-0">Sat</div>
        </div>

        {/* The Grid */}
        <div className="flex gap-[3px] flex-1">
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-[3px] shrink-0 flex-1">
              {week.map((day, j) => (
                <div 
                  key={j}
                  className={cn(
                    "flex-1 aspect-square min-w-[10px] rounded-[2px] transition-all cursor-default",
                    day.count === -1 ? "bg-transparent" :
                    day.count === 0 ? "bg-secondary border border-border" :
                    day.count === 1 ? "bg-primary/30" :
                    day.count === 2 ? "bg-primary/55" :
                    day.count === 3 ? "bg-primary/80" : "bg-primary"
                  )}
                  title={day.count >= 0 ? `${day.dateLabel}: ${day.count > 0 ? `${day.count} solved` : 'No activity'}` : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
