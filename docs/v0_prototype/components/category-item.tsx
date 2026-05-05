"use client"

import { ChevronRight } from "lucide-react"
import type { ServiceCategory } from "@/lib/campus-directory-data"
import { cn } from "@/lib/utils"

interface CategoryItemProps {
  category: ServiceCategory
  onClick: () => void
  isFirst: boolean
  isLast: boolean
}

export function CategoryItem({ category, onClick, isFirst, isLast }: CategoryItemProps) {
  // Use the first service's icon as the category icon
  const Icon = category.services[0]?.icon

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 px-4 py-3.5 bg-card transition-colors hover:bg-secondary/50 active:bg-secondary/70 text-left",
        isFirst && "rounded-t-xl",
        isLast && "rounded-b-xl"
      )}
    >
      {/* Icon Container */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col min-w-0">
        <span className="font-medium text-card-foreground">
          {category.name}
        </span>
        <span className="text-sm text-muted-foreground">
          {category.services.length} {category.services.length === 1 ? 'service' : 'services'}
        </span>
      </div>

      {/* Chevron */}
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </button>
  )
}
