"use client";

import { useState } from "react";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  slug: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export function CompanyLogo({ slug, name, className, fallbackClassName }: CompanyLogoProps) {
  const [error, setError] = useState(false);

  if (error) {
    return <LayoutGrid className={cn("h-5 w-5", fallbackClassName)} />;
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${slug}.com&sz=128`}
      alt={`${name} logo`}
      className={cn("object-contain rounded-md", className)}
      onError={() => setError(true)}
    />
  );
}
