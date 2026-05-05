import type { ServiceCategory } from "@/lib/campus-directory-data"
import { ServiceItem } from "./service-item"

interface ServiceGroupProps {
  category: ServiceCategory
}

export function ServiceGroup({ category }: ServiceGroupProps) {
  return (
    <section className="mb-6">
      {/* Section Header */}
      <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {category.name}
      </h2>

      {/* Inset Group Container */}
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
    </section>
  )
}
