import type { FC } from 'hono/jsx'
import { ServiceItem } from './ServiceItem'
import type { Service } from '../../models/schemas'

interface ServiceListProps {
  title: string;
  services: Service[];
  favoriteIds?: number[];
  backTo?: string;
}

const WRAPPER_STYLE = "animate-in fade-in slide-in-from-bottom-2 duration-300"
const BACK_BUTTON_CONTAINER = "mx-4 mt-2 mb-4"
const BACK_BUTTON_STYLE = "text-sm font-semibold text-primary flex items-center gap-1.5 px-3 py-2 border border-primary/20 rounded-lg hover:bg-primary/5 active:bg-primary/10 transition-all cursor-pointer shadow-sm"
const SECTION_STYLE = "mb-6"
const HEADING_STYLE = "mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
const LIST_CONTAINER_STYLE = "mx-4 overflow-hidden rounded-xl border border-border divide-y divide-border bg-card shadow-sm"
const EMPTY_STATE_STYLE = "px-4 py-12 text-center text-muted-foreground"

export const ServiceList: FC<ServiceListProps> = ({ title, services, favoriteIds = [], backTo = '/' }) => {
  return (
    <div class={WRAPPER_STYLE}>
      <div class={BACK_BUTTON_CONTAINER}>
        <button 
          hx-get="/api/categories" 
          hx-target="#main-content" 
          hx-push-url="/" 
          class={BACK_BUTTON_STYLE}
        >
          <span class="text-lg leading-none">←</span>
          <span>Back to Categories</span>
        </button>
      </div>
      <section class={SECTION_STYLE}>
        <h2 class={HEADING_STYLE}>
          {title} ({services.length})
        </h2>
        <div class={LIST_CONTAINER_STYLE}>
          {services.length > 0 ? (
            services.map((service, index) => (
              <ServiceItem 
                id={service.id}
                name={service.name}
                description={service.description}
                url={service.url}
                isFavorite={favoriteIds.includes(service.id)}
                isFirst={index === 0}
                isLast={index === services.length - 1}
              />
            ))
          ) : (
            <div class={EMPTY_STATE_STYLE}>
              No services found in this section.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
