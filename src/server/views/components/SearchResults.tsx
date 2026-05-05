import type { FC } from 'hono/jsx'
import { ServiceItem } from './ServiceItem'
import type { Service } from '../../models/schemas'

interface SearchResultsProps {
  query: string;
  results: Service[];
  favoriteIds?: number[];
}

const EMPTY_STATE_STYLE = "px-4 py-8 text-center text-muted-foreground animate-in fade-in"
const SECTION_STYLE = "mb-6 animate-in fade-in slide-in-from-top-2 duration-200"
const HEADING_STYLE = "mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
const RESULTS_CONTAINER = "mx-4 overflow-hidden rounded-xl border border-border divide-y divide-border bg-card shadow-sm"

export const SearchResults: FC<SearchResultsProps> = ({ query, results, favoriteIds = [] }) => {
  if (results.length === 0) {
    return <div class={EMPTY_STATE_STYLE}>No services found for "{query}"</div>
  }

  return (
    <section class={SECTION_STYLE}>
      <h2 class={HEADING_STYLE}>
        Search Results ({results.length})
      </h2>
      <div class={RESULTS_CONTAINER}>
        {results.map((service, index) => (
          <ServiceItem 
            id={service.id}
            name={service.name}
            description={service.description}
            url={service.url}
            isFavorite={favoriteIds.includes(service.id)}
            isFirst={index === 0}
            isLast={index === results.length - 1}
          />
        ))}
      </div>
    </section>
  )
}
