import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Dashboard from "@/components/Dashboard";
import { CompanyLogo } from "@/components/CompanyLogo";
import fs from "fs";
import path from "path";

export async function generateStaticParams() {
  const dataPath = path.resolve(process.cwd(), "public/data/questions.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  return data.companies.map((company: any) => ({
    slug: company.slug,
  }));
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const dataPath = path.resolve(process.cwd(), "public/data/questions.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  
  const company = data.companies.find((c: any) => c.slug === slug);

  if (!company) return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="apple-card p-10 text-center space-y-5 max-w-md w-full">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Company Not Found</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We could not find a company matching <span className="text-foreground font-mono font-semibold bg-secondary px-1.5 py-0.5 rounded border border-border">{slug}</span>.
        </p>
        <Link href="/companies" className="btn-primary justify-center w-full">
          Return to Companies
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8 pb-20">
      {/* Header */}
      <header className="space-y-4 pb-6 border-b border-border">
        <Link 
          href="/companies" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>All Companies</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-secondary border border-border flex items-center justify-center overflow-hidden shrink-0">
              <CompanyLogo 
                slug={company.slug} 
                name={company.displayName} 
                className="h-7 w-7"
                fallbackClassName="h-6 w-6 text-foreground" 
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {company.displayName}
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Questions frequently asked in {company.displayName} technical interviews.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1 bg-secondary rounded-lg border border-border text-xs font-mono text-muted-foreground">
            <span>ID:</span>
            <span className="font-semibold text-foreground uppercase">{company.slug}</span>
          </div>
        </div>
      </header>

      {/* Main Questions View */}
      <section>
        <Dashboard initialCompany={slug} />
      </section>
    </div>
  );
}
