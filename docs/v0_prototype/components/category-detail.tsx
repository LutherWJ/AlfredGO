"use client"

import { ArrowLeft } from "lucide-react"
import type { ServiceCategory } from "@/lib/campus-directory-data"
import { ServiceItem } from "./service-item"

interface CategoryDetailProps {
  category: ServiceCategory
  onBack: () => void
}

export function CategoryDetail({ category, onBack }: CategoryDetailProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <header className="sticky top-0 z-10 bg-primary border-b border-primary/80">
        <div className="max-w-lg mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary-foreground bg-primary-foreground/15 hover:bg-primary-foreground/25 active:bg-primary-foreground/30 rounded-lg px-4 py-2.5 transition-colors mb-3"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-base font-semibold">Back</span>
          </button>
          <h1 className="text-lg font-semibold text-primary-foreground">
            {category.name}
          </h1>
        </div>
      </header>

      {/* Services List */}
      <main className="max-w-lg mx-auto py-6">
        <div className="mx-4 overflow-hidden rounded-xl border border-border divide-y divide-border">
          {category.services.map((service, index) => (
            <ServiceItem
              key={service.id}
              service={service}
              isFirst={index === 0}
              isLast={index === category.services.length - 1}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
