"use client"

import { ChevronRight } from "lucide-react"
import type { Service } from "@/lib/campus-directory-data"
import { cn } from "@/lib/utils"

interface ServiceItemProps {
  service: Service
  isFirst: boolean
  isLast: boolean
}

export function ServiceItem({ service, isFirst, isLast }: ServiceItemProps) {
  const Icon = service.icon

  return (
    <a
      href={service.url}
      className={cn(
        "flex items-center gap-4 px-4 py-3 bg-card transition-colors hover:bg-secondary/50 active:bg-secondary/70",
        isFirst && "rounded-t-xl",
        isLast && "rounded-b-xl"
      )}
    >
      {/* Icon Container */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-card-foreground truncate">
            {service.name}
          </span>
          {service.status === "new" && (
            <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
              New
            </span>
          )}
          {service.status === "maintenance" && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              Maintenance
            </span>
          )}
        </div>
        <span className="text-sm text-muted-foreground truncate">
          {service.description}
        </span>
      </div>

      {/* Chevron */}
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </a>
  )
}
