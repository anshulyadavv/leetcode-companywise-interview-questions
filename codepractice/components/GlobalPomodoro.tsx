"use client";

import { useEffect, useState } from "react";
import { useDataStore } from "@/lib/data-store";
import { usePathname } from "next/navigation";
import { Play, Pause, Square, RefreshCw, Minimize, Maximize, Pen, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function PomodoroWidget({ isFloating = false }: { isFloating?: boolean }) {
  const { pomodoro, setPomodoro } = useDataStore();
  const [editingCustom, setEditingCustom] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const overrideMap: Record<string, number> = {
    focus: pomodoro.customFocusMin ? pomodoro.customFocusMin * 60 : 25 * 60,
    shortBreak: pomodoro.customShortMin ? pomodoro.customShortMin * 60 : 5 * 60,
    longBreak: pomodoro.customLongMin ? pomodoro.customLongMin * 60 : 15 * 60,
  };
  const effectiveTotal = overrideMap[pomodoro.mode];
  const progress = pomodoro.timeLeft / effectiveTotal;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  function setMode(mode: "focus" | "shortBreak" | "longBreak") {
    const t = overrideMap[mode];
    setPomodoro({ mode, timeLeft: t, isRunning: false });
  }

  function applyCustom() {
    const mins = parseInt(customInput);
    if (!isNaN(mins) && mins > 0 && mins <= 120) {
      const key = pomodoro.mode === "focus" ? "customFocusMin" :
                  pomodoro.mode === "shortBreak" ? "customShortMin" : "customLongMin";
      setPomodoro({ [key]: mins, timeLeft: mins * 60, isRunning: false } as any);
    }
    setEditingCustom(false);
    setCustomInput("");
  }

  const modeLabel = pomodoro.mode === "focus" ? "Focus" : pomodoro.mode === "shortBreak" ? "Short break" : "Long break";

  return (
    <div className={cn(
      "flex flex-col transition-all",
      isFloating 
        ? "w-64 liquid-glass rounded-2xl shadow-xl p-5 border border-border space-y-4" 
        : "apple-card p-5 w-full space-y-4"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          Timer
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setEditingCustom(v => !v); setCustomInput(""); }}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Custom minutes"
            aria-label="Custom minutes"
          >
            <Pen className="h-3.5 w-3.5" />
          </button>
          {isFloating ? (
            <button
              onClick={() => setPomodoro({ isDocked: true })}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              title="Dock timer"
              aria-label="Dock timer"
            >
              <Maximize className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setPomodoro({ isDocked: false })}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              title="Pop out timer"
              aria-label="Pop out timer"
            >
              <Minimize className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Custom time input */}
      {editingCustom && (
        <div className="flex items-center gap-2 p-2 bg-secondary rounded-xl border border-border">
          <span className="text-xs text-muted-foreground flex-1">Minutes:</span>
          <input
            type="number"
            min={1} max={120}
            className="w-14 bg-background border border-border rounded-lg px-2 py-1 text-xs text-center font-bold focus:outline-none focus:ring-1 focus:ring-primary font-tabular"
            placeholder="25"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") applyCustom(); if (e.key === "Escape") setEditingCustom(false); }}
            autoFocus
          />
          <button 
            onClick={applyCustom} 
            className="h-6 w-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-hover transition-colors"
          >
            <Check className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Symmetrical Segmented Mode Track: 3 equal columns */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-secondary rounded-xl border border-border/60 w-full">
        {([
          { id: "focus", label: "Focus" },
          { id: "shortBreak", label: "5m" },
          { id: "longBreak", label: "15m" },
        ] as const).map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "py-1.5 text-xs font-semibold rounded-lg transition-all text-center whitespace-nowrap",
              pomodoro.mode === m.id 
                ? "bg-white dark:bg-[#2c2c2e] text-foreground shadow-xs font-bold" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Perfectly Centered Circular Ring */}
      <div className="flex items-center justify-center py-1">
        <div className="relative w-[136px] h-[136px] flex items-center justify-center">
          <svg width="136" height="136" className="-rotate-90">
            <circle
              cx="68"
              cy="68"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-secondary"
              strokeWidth="6"
            />
            <circle
              cx="68"
              cy="68"
              r={radius}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
              {modeLabel}
            </span>
            <span className="text-2xl font-bold font-tabular tracking-tight text-foreground">
              {formatTime(pomodoro.timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Perfectly Symmetrical Control Actions */}
      <div className="flex items-center justify-center gap-4 pt-1">
        <button
          onClick={() => setPomodoro({ timeLeft: effectiveTotal, isRunning: false })}
          className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          title="Reset timer"
          aria-label="Reset timer"
        >
          <RefreshCw className="h-4 w-4" />
        </button>

        <button
          onClick={() => setPomodoro({ isRunning: !pomodoro.isRunning })}
          className="h-11 w-11 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover flex items-center justify-center shadow-xs transition-all active:scale-95"
          title={pomodoro.isRunning ? "Pause" : "Start"}
          aria-label={pomodoro.isRunning ? "Pause" : "Start"}
        >
          {pomodoro.isRunning
            ? <Pause className="h-4 w-4" fill="currentColor" />
            : <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
          }
        </button>

        <button
          onClick={() => setPomodoro({ isRunning: false, timeLeft: effectiveTotal })}
          className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-signal-hard hover:bg-secondary transition-all"
          title="Stop timer"
          aria-label="Stop timer"
        >
          <Square className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function GlobalPomodoro() {
  const { pomodoro, setPomodoro } = useDataStore();

  useEffect(() => {
    if (!pomodoro.isRunning) return;
    const interval = setInterval(() => {
      setPomodoro({
        timeLeft: Math.max(0, pomodoro.timeLeft - 1),
        isRunning: pomodoro.timeLeft - 1 > 0,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [pomodoro.isRunning, pomodoro.timeLeft, setPomodoro]);

  useEffect(() => {
    if (pomodoro.isRunning) {
      const m = Math.floor(pomodoro.timeLeft / 60);
      const s = pomodoro.timeLeft % 60;
      const label = pomodoro.mode === "focus" ? "Focus" : "Break";
      document.title = `(${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}) ${label} - CodePractice`;
    } else {
      document.title = "CodePractice";
    }
  }, [pomodoro.isRunning, pomodoro.timeLeft, pomodoro.mode]);

  if (pomodoro.isDocked) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-200">
      <PomodoroWidget isFloating={true} />
    </div>
  );
}
