import type { FC } from 'hono/jsx'
import { Icons } from './Icons'

const SEARCH_CONTAINER_STYLE = "relative mx-4 mb-6"
const SEARCH_ICON_CONTAINER = "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
const SEARCH_ICON_STYLE = "h-4 w-4"
const INPUT_STYLE = "w-full rounded-xl border border-border bg-input px-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
const INDICATOR_CONTAINER = "htmx-indicator absolute right-3 top-1/2 -translate-y-1/2"
const SPINNER_STYLE = "animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"

export const SearchInput: FC = () => {
  return (
    <div class={SEARCH_CONTAINER_STYLE}>
      <div class={SEARCH_ICON_CONTAINER}>
        <Icons.Search class={SEARCH_ICON_STYLE} />
      </div>
      <input
        type="text"
        name="q"
        placeholder="Search services..."
        hx-get="/api/search"
        hx-trigger="keyup changed delay:200ms, search"
        hx-target="#search-results"
        hx-indicator="#search-indicator"
        class={INPUT_STYLE}
      />
      <div id="search-indicator" class={INDICATOR_CONTAINER}>
        <div class={SPINNER_STYLE}></div>
      </div>
    </div>
  )
}
