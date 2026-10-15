"use client";

import { useState, useEffect, useMemo, useDeferredValue } from "react";
import { useDataStore, Question } from "@/lib/data-store";
import { Search, Plus, ExternalLink, ChevronDown, Check, AlertTriangle, Boxes, ChevronLeft, ChevronRight, CheckCircle2, Calendar, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ContributionHeatmap } from "@/components/Tracker";

type SortKey = "id" | "title" | "difficulty" | "acceptance" | "frequency";
type SortOrder = "asc" | "desc" | null;

const DIFFICULTY_ORDER = { "Easy": 1, "Medium": 2, "Hard": 3 };

export default function Dashboard({ initialCompany, showHeatmap }: { initialCompany?: string; showHeatmap?: boolean }) {
  const { questions, initData, addToList, addPlannerTask, todoLists, completedQuestions, toggleQuestionCompletion, completionDates } = useDataStore();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    initData();
  }, [initData]);

  const stats = useMemo(() => {
    if (questions.length === 0) return { total: 0, done: 0, easy: { total: 0, done: 0 }, medium: { total: 0, done: 0 }, hard: { total: 0, done: 0 } };

    const compMatch = initialCompany?.toLowerCase().trim();
    const scopeQuestions = compMatch 
      ? questions.filter(q => q.companies.some(c => c.toLowerCase() === compMatch))
      : questions;

    const total = scopeQuestions.length;
    const done = scopeQuestions.filter(q => completedQuestions.includes(q.slug)).length;
    
    const easy = scopeQuestions.filter(q => q.difficulty === "Easy");
    const medium = scopeQuestions.filter(q => q.difficulty === "Medium");
    const hard = scopeQuestions.filter(q => q.difficulty === "Hard");

    return {
      total,
      done,
      easy: { total: easy.length, done: easy.filter(q => completedQuestions.includes(q.slug)).length },
      medium: { total: medium.length, done: medium.filter(q => completedQuestions.includes(q.slug)).length },
      hard: { total: hard.length, done: hard.filter(q => completedQuestions.includes(q.slug)).length },
    };
  }, [questions, completedQuestions, initialCompany]);

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

  const topics = useMemo(() => {
    const allTopics = new Set(questions.flatMap(q => q.topics));
    return Array.from(allTopics).sort();
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    const compMatch = initialCompany?.toLowerCase().trim();
    return questions.filter((q) => {
      const matchesSearch = q.title.toLowerCase().includes(deferredSearch.toLowerCase()) || 
                            q.slug.toLowerCase().includes(deferredSearch.toLowerCase()) ||
                            q.companies.some(c => c.toLowerCase().includes(deferredSearch.toLowerCase()));
      const matchesDifficulty = selectedDifficulty.length === 0 || selectedDifficulty.includes(q.difficulty);
      const matchesTopics = selectedTopics.length === 0 || selectedTopics.every(t => q.topics.includes(t));
      const matchesCompany = !compMatch || q.companies.some(c => c.toLowerCase() === compMatch);
      return matchesSearch && matchesDifficulty && matchesTopics && matchesCompany;
    });
  }, [questions, deferredSearch, selectedDifficulty, selectedTopics, initialCompany]);

  const sortedQuestions = useMemo(() => {
    if (!sortKey || !sortOrder) return filteredQuestions;

    return [...filteredQuestions].sort((a, b) => {
      let valA: any = a[sortKey as keyof Question];
      let valB: any = b[sortKey as keyof Question];

      if (sortKey === "difficulty") {
        valA = DIFFICULTY_ORDER[a.difficulty as keyof typeof DIFFICULTY_ORDER];
        valB = DIFFICULTY_ORDER[b.difficulty as keyof typeof DIFFICULTY_ORDER];
      } else if (sortKey === "acceptance" || sortKey === "frequency") {
        valA = parseFloat((a as any)[sortKey]) || 0;
        valB = parseFloat((b as any)[sortKey]) || 0;
      } else if (sortKey === "id") {
        valA = parseInt(a.id) || 0;
        valB = parseInt(b.id) || 0;
      } else if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredQuestions, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedQuestions.length / itemsPerPage);
  const paginatedQuestions = sortedQuestions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortOrder === "asc") setSortOrder("desc");
      else if (sortOrder === "desc") setSortOrder(null);
      else setSortOrder("asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards & Activity Heatmap */}
      {showHeatmap ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Activity Heatmap */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <div className="apple-card p-5 sm:p-6 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-3">
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
              <div className="overflow-x-auto pb-1">
                <ContributionHeatmap dates={heatmapDates} />
              </div>
            </div>
          </div>

          {/* Question list tracker cards alongside */}
          <div className="lg:col-span-5 xl:col-span-4 grid grid-cols-2 gap-3 sm:gap-3.5 content-between">
            <StatCard 
              label="Progress" 
              done={stats.done} 
              total={stats.total} 
              signal="primary"
            />
            <StatCard 
              label="Easy" 
              done={stats.easy.done} 
              total={stats.easy.total} 
              signal="easy"
            />
            <StatCard 
              label="Medium" 
              done={stats.medium.done} 
              total={stats.medium.total} 
              signal="medium"
            />
            <StatCard 
              label="Hard" 
              done={stats.hard.done} 
              total={stats.hard.total} 
              signal="hard"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            label="Progress" 
            done={stats.done} 
            total={stats.total} 
            signal="primary"
          />
          <StatCard 
            label="Easy" 
            done={stats.easy.done} 
            total={stats.easy.total} 
            signal="easy"
          />
          <StatCard 
            label="Medium" 
            done={stats.medium.done} 
            total={stats.medium.total} 
            signal="medium"
          />
          <StatCard 
            label="Hard" 
            done={stats.hard.done} 
            total={stats.hard.total} 
            signal="hard"
          />
        </div>
      )}

      {/* Control Bar (Apple Toolbar) */}
      <div className="flex flex-wrap gap-3 items-center bg-card p-3 rounded-2xl border border-border">
        {/* Search Input */}
        <div className="relative group w-full md:w-80 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Search by question title, topic, or company..."
            className="w-full h-9 pl-9 pr-8 text-sm font-medium bg-secondary/80 focus:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground rounded-full"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <FilterDropdown 
          label="Difficulty" 
          options={["Easy", "Medium", "Hard"]} 
          selected={selectedDifficulty}
          onSelect={setSelectedDifficulty}
        />

        <SearchableTopicPicker 
          topics={topics}
          selected={selectedTopics}
          onSelect={setSelectedTopics}
        />

        {/* Sort Segmented Control */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs font-medium text-muted-foreground mr-1.5 hidden lg:inline">Sort:</span>
          <div className="segmented-track">
            {(["id", "title", "difficulty", "frequency"] as const).map((key) => {
              const labels: Record<string, string> = { id: "Number", title: "Name", difficulty: "Difficulty", frequency: "Frequency" };
              const isActive = sortKey === key;
              return (
                <button
                  key={key}
                  onClick={() => toggleSort(key)}
                  className={cn(
                    "segmented-item",
                    isActive && "segmented-item-active"
                  )}
                >
                  <span>{labels[key]}</span>
                  {isActive && (
                    <span className="ml-1 text-[10px] font-bold">
                      {sortOrder === "asc" ? "↑" : sortOrder === "desc" ? "↓" : ""}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1">
        <span>
          Showing <span className="text-foreground font-semibold font-tabular">{paginatedQuestions.length}</span> of <span className="text-foreground font-semibold font-tabular">{sortedQuestions.length}</span> questions
          {(selectedDifficulty.length > 0 || selectedTopics.length > 0 || search) && (
            <button 
              onClick={() => { setSelectedDifficulty([]); setSelectedTopics([]); setSearch(""); setPage(1); }}
              className="ml-2 text-primary hover:underline font-semibold"
            >
              Clear filters
            </button>
          )}
        </span>
      </div>

      {/* Questions Table */}
      <div className="space-y-2">
        {/* Table Column Labels */}
        <div className="hidden md:grid grid-cols-12 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-secondary/50 rounded-xl border border-border/50">
          <div className="col-span-1 pl-9">#</div>
          <div className="col-span-5">Question</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-2">Acceptance</div>
          <div className="col-span-2 text-right pr-9">Frequency</div>
        </div>

        {paginatedQuestions.map((q, idx) => (
          <QuestionRow 
            key={q.slug} 
            index={(page - 1) * itemsPerPage + idx + 1}
            question={q} 
            onAddToTodo={(listId) => {
              addToList(listId, { title: q.title, slug: q.slug, type: 'question' });
              if (listId === 'daily' || listId === 'weekly') {
                const today = new Date();
                const date = listId === 'daily'
                  ? `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
                  : (() => {
                      const d = new Date(today);
                      const day = d.getDay();
                      d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
                      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                    })();
                addPlannerTask(date, q.title);
              }
            }} 
            todoLists={todoLists}
            isCompleted={completedQuestions.includes(q.slug)}
            onToggleComplete={() => toggleQuestionCompletion(q.slug)}
          />
        ))}

        {paginatedQuestions.length === 0 && (
          <div className="py-16 text-center space-y-3 apple-card border-dashed">
            <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground/40" />
            <div className="space-y-1">
              <p className="font-semibold text-sm text-foreground">No questions found</p>
              <p className="text-xs text-muted-foreground">Try clearing your filters or searching for another term.</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground mr-1">Page size:</span>
          <div className="segmented-track">
            {[10, 25, 50, 100].map((size) => (
              <button
                key={size}
                onClick={() => { setItemsPerPage(size); setPage(1); }}
                className={cn(
                  "segmented-item font-tabular",
                  itemsPerPage === size && "segmented-item-active"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground font-medium font-tabular">
            Page <span className="text-foreground font-bold">{page}</span> of {totalPages || 1}
          </p>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none transition-all"
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none transition-all"
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function QuestionRow({ question, index, onAddToTodo, todoLists, isCompleted, onToggleComplete }: { 
  question: Question, 
  index: number,
  onAddToTodo: (listId: string) => void, 
  todoLists: any[],
  isCompleted: boolean,
  onToggleComplete: () => void
}) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <div className={cn(
      "apple-card transition-all duration-150",
      isCompleted 
        ? "bg-secondary/40 border-border/80" 
        : "hover:border-border-hover"
    )}>
      <div className="grid grid-cols-1 md:grid-cols-12 items-center px-4 py-3 gap-3 min-w-0">
        {/* Checkbox + Index */}
        <div className="col-span-1 flex items-center gap-2.5">
          <button 
            onClick={onToggleComplete}
            className={cn(
              "h-7 w-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              isCompleted 
                ? "bg-signal-easy border-signal-easy text-white animate-spring-check" 
                : "border-border hover:border-signal-easy/60 bg-background"
            )}
            title={isCompleted ? "Mark incomplete" : "Mark complete"}
            aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
          >
            <Check className={cn("h-3.5 w-3.5 transition-opacity", isCompleted ? "opacity-100" : "opacity-0")} strokeWidth={3} />
          </button>
          <span className="text-xs font-mono font-medium text-muted-foreground hidden md:block font-tabular">
            #{index}
          </span>
        </div>
        
        {/* Title + Company Pills */}
        <div className="col-span-5 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <a 
              href={question.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                "text-sm font-semibold transition-colors flex items-center gap-1.5 group/link min-w-0 truncate",
                isCompleted ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground hover:text-primary"
              )}
            >
              <span className="truncate">{question.title}</span>
              <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover/link:opacity-60 transition-opacity" />
            </a>
          </div>
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {question.companies.slice(0, 4).map(c => (
              <Link
                key={c}
                href={`/company/${c}`}
                className="text-[11px] font-medium px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md border border-border hover:border-primary/40 hover:text-primary transition-all"
              >
                {c}
              </Link>
            ))}
            {question.companies.length > 4 && (
              <span className="text-[11px] font-medium px-1.5 py-0.5 bg-secondary/60 text-muted-foreground rounded-md border border-border">
                +{question.companies.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Difficulty */}
        <div className="col-span-2">
          <DifficultyBadge difficulty={question.difficulty} />
        </div>

        {/* Acceptance */}
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <div className="flex-grow bg-secondary rounded-full h-1.5 max-w-[64px] overflow-hidden border border-border/40">
              <div 
                className="h-full rounded-full bg-muted-foreground/60 transition-all duration-300"
                style={{ width: question.acceptance }}
              />
            </div>
            <span className="text-xs font-semibold text-muted-foreground font-tabular">{question.acceptance}</span>
          </div>
        </div>

        {/* Frequency & Action */}
        <div className="col-span-2 flex items-center justify-end gap-3">
          <span className="text-xs font-bold font-tabular text-foreground">
            {question.frequency.toFixed(1)}%
          </span>
          <div className="relative">
            <button 
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="h-8 w-8 rounded-lg flex items-center justify-center bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-all"
              title="Add to list"
              aria-label="Add to list"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            {showAddMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
                <div className="absolute right-0 top-full mt-1.5 w-56 apple-card shadow-xl z-50 p-1.5 overflow-hidden">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2.5 py-1.5">
                    Add to list
                  </p>
                  {todoLists.map((list) => (
                    <button
                      key={list.id}
                      onClick={() => { onAddToTodo(list.id); setShowAddMenu(false); }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary rounded-lg transition-all flex items-center gap-2"
                    >
                      <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="flex-1 truncate">{list.name}</span>
                    </button>
                  ))}
                  {todoLists.length === 0 && (
                    <p className="px-2.5 py-1.5 text-xs text-muted-foreground">
                      Visit the <Link href="/planner" className="text-primary hover:underline font-semibold">Planner</Link> to create custom lists.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const styles: Record<string, string> = {
    Easy: "bg-signal-easy-bg text-signal-easy border-signal-easy/20",
    Medium: "bg-signal-medium-bg text-signal-medium border-signal-medium/20",
    Hard: "bg-signal-hard-bg text-signal-hard border-signal-hard/20"
  };
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold tracking-wide border",
      styles[difficulty] || "bg-secondary text-foreground border-border"
    )}>
      {difficulty}
    </span>
  );
}

function SearchableTopicPicker({ topics, selected, onSelect }: { 
  topics: string[], 
  selected: string[], 
  onSelect: (val: string[]) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredTopics = useMemo(() => {
    return topics.filter(t => t.toLowerCase().includes(search.toLowerCase()));
  }, [topics, search]);

  return (
    <div className="relative w-full sm:w-48 shrink-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-9 flex items-center justify-between px-3 text-xs font-medium bg-secondary/80 hover:bg-secondary border border-border rounded-xl transition-all"
      >
        <div className="flex items-center gap-1.5 truncate">
          <Boxes className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="truncate">
            {selected.length > 0 ? `Topics (${selected.length})` : "Topics"}
          </span>
        </div>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-1.5 apple-card shadow-2xl z-50 overflow-hidden">
            <div className="p-2 border-b border-border">
              <input 
                type="text"
                placeholder="Search topics..."
                className="w-full bg-secondary border border-border rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-56 overflow-y-auto p-1 space-y-0.5">
              {filteredTopics.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    const next = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt];
                    onSelect(next);
                  }}
                  className={cn(
                    "w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center justify-between transition-colors",
                    selected.includes(opt) ? "bg-primary/10 text-primary font-semibold" : "hover:bg-secondary text-foreground"
                  )}
                >
                  <span className="truncate">{opt}</span>
                  {selected.includes(opt) && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </button>
              ))}
              {filteredTopics.length === 0 && (
                <p className="p-3 text-center text-xs text-muted-foreground">No topics found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FilterDropdown({ label, options, selected, onSelect }: { 
  label: string, 
  options: string[], 
  selected: string[], 
  onSelect: (val: string[]) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full sm:w-40 shrink-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-9 flex items-center justify-between px-3 text-xs font-medium bg-secondary/80 hover:bg-secondary border border-border rounded-xl transition-all"
      >
        <span className="truncate">{selected.length > 0 ? `${label} (${selected.length})` : label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-1.5 apple-card shadow-2xl z-50 p-1 overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  const next = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt];
                  onSelect(next);
                }}
                className={cn(
                  "w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center justify-between transition-colors",
                  selected.includes(opt) ? "bg-primary/10 text-primary font-semibold" : "hover:bg-secondary text-foreground"
                )}
              >
                <span>{opt}</span>
                {selected.includes(opt) && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ 
  label, 
  done, 
  total, 
  signal 
}: { 
  label: string, 
  done: number, 
  total: number, 
  signal: "primary" | "easy" | "medium" | "hard" 
}) {
  const percentage = total > 0 ? (done / total) * 100 : 0;
  
  const barColors: Record<string, string> = {
    primary: "bg-primary",
    easy: "bg-signal-easy",
    medium: "bg-signal-medium",
    hard: "bg-signal-hard"
  };

  return (
    <div className="apple-card p-4 sm:p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", barColors[signal])} />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
        </div>
        <span className="text-xs font-bold font-tabular text-muted-foreground">
          {percentage.toFixed(0)}%
        </span>
      </div>
      <div>
        <div className="flex items-baseline gap-1.5">
          <h3 className="text-2xl font-bold text-foreground font-tabular">{done}</h3>
          <span className="text-xs font-medium text-muted-foreground font-tabular">/ {total}</span>
        </div>
      </div>
      <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden border border-border/40">
        <div 
          className={cn("h-full rounded-full transition-all duration-700 ease-out", barColors[signal])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
