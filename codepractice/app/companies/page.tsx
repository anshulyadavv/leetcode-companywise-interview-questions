"use client";

import { useState, useEffect, useMemo, useDeferredValue } from "react";
import { useDataStore } from "@/lib/data-store";
import { LayoutGrid, Search, ArrowRight, Boxes, ChevronDown, Check, Zap, Globe, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { CompanyLogo } from "@/components/CompanyLogo";
import { cn } from "@/lib/utils";

type CompanySortMode = "volume_desc" | "volume_asc" | "alpha_asc" | "alpha_desc";
type FilterType = "all" | "trending" | "enterprise";

export default function CompaniesPage() {
  const { companies, initData, questions } = useDataStore();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [sortMode, setSortMode] = useState<CompanySortMode>("volume_desc");
  const [filter, setFilter] = useState<FilterType>("all");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    initData();
  }, [initData]);

  // Live Stats Calculation
  const companyStats = useMemo(() => {
    const stats: Record<string, { total: number, Easy: number, Medium: number, Hard: number }> = {};
    questions.forEach(q => {
      q.companies.forEach(c => {
        if (!stats[c]) stats[c] = { total: 0, Easy: 0, Medium: 0, Hard: 0 };
        stats[c].total++;
        stats[c][q.difficulty]++;
      });
    });
    return stats;
  }, [questions]);

  const filteredAndSorted = useMemo(() => {
    let result = companies.map(c => ({
      ...c,
      liveCount: companyStats[c.slug]?.total || 0,
      difficulty: companyStats[c.slug] || { Easy: 0, Medium: 0, Hard: 0 }
    }));

    if (deferredSearch) {
      result = result.filter(c => 
        c.displayName.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        c.slug.toLowerCase().includes(deferredSearch.toLowerCase())
      );
    }

    if (filter === "trending") result = result.filter(c => c.liveCount > 40);
    else if (filter === "enterprise") result = result.filter(c => c.liveCount > 100);

    return result.sort((a, b) => {
      switch (sortMode) {
        case "volume_desc": return b.liveCount - a.liveCount;
        case "volume_asc": return a.liveCount - b.liveCount;
        case "alpha_asc": return a.displayName.localeCompare(b.displayName);
        case "alpha_desc": return b.displayName.localeCompare(a.displayName);
        default: return 0;
      }
    });
  }, [companies, companyStats, deferredSearch, sortMode, filter]);

  useEffect(() => { setPage(1); }, [deferredSearch, filter, sortMode]);

  const totalQuestions = questions.length;
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginated = filteredAndSorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const startItem = filteredAndSorted.length === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, filteredAndSorted.length);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8 pb-20">
      {/* Header */}
      <header className="space-y-2 pb-6 border-b border-border">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Companies
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
          Browse {companies.length} tech companies with real interview questions and difficulty breakdowns.
        </p>
      </header>

      {/* Control Bar (Apple Toolbar) */}
      <div className="flex flex-wrap gap-3 items-center bg-card p-3 rounded-2xl border border-border">
        {/* Search Input */}
        <div className="relative group w-full md:w-80 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search companies by name or tag..."
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

        {/* Filter Segmented Control */}
        <div className="segmented-track">
          <button
            onClick={() => setFilter("all")}
            className={cn("segmented-item", filter === "all" && "segmented-item-active")}
          >
            All Companies
          </button>
          <button
            onClick={() => setFilter("trending")}
            className={cn("segmented-item", filter === "trending" && "segmented-item-active")}
          >
            Trending (&gt;40)
          </button>
          <button
            onClick={() => setFilter("enterprise")}
            className={cn("segmented-item", filter === "enterprise" && "segmented-item-active")}
          >
            Enterprise (&gt;100)
          </button>
        </div>

        {/* Sort Popover */}
        <div className="relative ml-auto">
          <button 
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="h-9 px-3.5 flex items-center gap-2 bg-secondary/80 hover:bg-secondary border border-border rounded-xl text-xs font-semibold text-foreground transition-all"
          >
            <span className="text-muted-foreground font-normal">Sort:</span>
            <span>
              {sortMode === "volume_desc" ? "Most Questions" : sortMode === "volume_asc" ? "Least Questions" : sortMode === "alpha_asc" ? "A to Z" : "Z to A"}
            </span>
            <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform shrink-0", showSortMenu && "rotate-180")} />
          </button>
          
          {showSortMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-48 apple-card shadow-2xl z-50 p-1">
                {[
                  { id: "volume_desc", label: "Questions: High to Low" },
                  { id: "volume_asc", label: "Questions: Low to High" },
                  { id: "alpha_asc", label: "Alphabetical: A → Z" },
                  { id: "alpha_desc", label: "Alphabetical: Z → A" }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setSortMode(opt.id as CompanySortMode); setShowSortMenu(false); }}
                    className={cn(
                      "w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center justify-between transition-colors",
                      sortMode === opt.id ? "bg-primary/10 text-primary font-semibold" : "hover:bg-secondary text-foreground"
                    )}
                  >
                    <span>{opt.label}</span>
                    {sortMode === opt.id && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Results Header info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1">
        <span>
          {filteredAndSorted.length === 0
            ? "No companies found"
            : <>Showing <span className="text-foreground font-bold font-tabular">{startItem} to {endItem}</span> of <span className="text-foreground font-bold font-tabular">{filteredAndSorted.length}</span> companies</>}
        </span>
        {(deferredSearch || filter !== "all") && (
          <button
            onClick={() => { setSearch(""); setFilter("all"); }}
            className="text-primary hover:underline text-xs font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginated.map((company) => {
          const stats = company.difficulty;
          const percentage = ((company.liveCount / (totalQuestions || 1)) * 100).toPrecision(2);
          
          return (
            <Link 
              key={company.slug}
              href={`/company/${company.slug}`} 
              className="apple-card p-5 flex flex-col justify-between group hover:border-border-hover transition-all"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="h-11 w-11 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground overflow-hidden">
                    <CompanyLogo 
                      slug={company.slug} 
                      name={company.displayName} 
                      className="h-6 w-6 transition-transform group-hover:scale-105"
                      fallbackClassName="transition-transform group-hover:scale-105" 
                    />
                  </div>
                  <span className="text-xs font-bold font-tabular text-muted-foreground px-2 py-0.5 rounded-md bg-secondary border border-border">
                    {percentage}%
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {company.displayName}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    <DifficultyDot count={stats.Easy} dotClass="bg-signal-easy" label="Easy" />
                    <DifficultyDot count={stats.Medium} dotClass="bg-signal-medium" label="Med" />
                    <DifficultyDot count={stats.Hard} dotClass="bg-signal-hard" label="Hard" />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="font-semibold font-tabular text-foreground">
                  {company.liveCount} <span className="font-medium text-muted-foreground">questions</span>
                </span>
                <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  View <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredAndSorted.length === 0 && (
        <div className="py-20 text-center apple-card border-dashed flex flex-col items-center gap-3">
          <Boxes className="h-8 w-8 text-muted-foreground/30" />
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-foreground">No companies found</h2>
            <p className="text-muted-foreground text-xs">
              Try adjusting your search query or reset the filter.
            </p>
          </div>
          <button 
            onClick={() => { setSearch(""); setFilter("all"); }}
            className="btn-secondary text-xs mt-2"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground mr-1">Page size:</span>
            <div className="segmented-track">
              {[12, 24, 48, 96].map((size) => (
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
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 px-3 rounded-lg text-xs font-medium border border-border bg-card hover:bg-secondary transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>

            <span className="text-xs text-muted-foreground font-medium font-tabular">
              Page <span className="text-foreground font-bold">{page}</span> of {totalPages}
            </span>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-8 px-3 rounded-lg text-xs font-medium border border-border bg-card hover:bg-secondary transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DifficultyDot({ count, dotClass, label }: { count: number, dotClass: string, label: string }) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-secondary rounded-md border border-border text-[11px] font-medium text-muted-foreground">
      <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotClass)} />
      <span className="font-tabular">{count} {label}</span>
    </div>
  );
}
