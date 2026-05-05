import type { FC } from 'hono/jsx'
import { Icons } from './Icons'

interface ServiceItemProps {
  id: string | number
  name: string
  description?: string | null
  url: string
  status?: string | null
  isFavorite?: boolean
  isFirst?: boolean
  isLast?: boolean
}

const SERVICE_ITEM_WRAPPER = "relative flex items-center group bg-card transition-colors hover:bg-secondary/30 border-border"
const SERVICE_LINK_STYLE = "flex flex-1 items-center gap-4 px-4 py-3 min-w-0"
const FAVORITE_BUTTON_STYLE = "p-4 text-muted-foreground hover:text-yellow-500 transition-all active:scale-125 z-10"
const FAVORITE_STAR_STYLE = "h-5 w-5"
const FAVORITE_STAR_FILLED_STYLE = "h-5 w-5 text-yellow-400 fill-yellow-400"
const ICON_CONTAINER_STYLE = "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"
const ICON_STYLE = "h-5 w-5 text-primary"
const CONTENT_CONTAINER_STYLE = "flex flex-1 flex-col min-w-0"
const TITLE_CONTAINER_STYLE = "flex items-center gap-2"
const NAME_STYLE = "font-medium text-card-foreground truncate"
const STATUS_BADGE_BASE = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
const STATUS_NEW_STYLE = `${STATUS_BADGE_BASE} bg-accent text-accent-foreground`
const STATUS_MAINTENANCE_STYLE = `${STATUS_BADGE_BASE} bg-amber-100 text-amber-700`
const DESCRIPTION_STYLE = "text-sm text-muted-foreground truncate"
const CHEVRON_STYLE = "h-5 w-5 shrink-0 text-muted-foreground pr-4"

export const ServiceItem: FC<ServiceItemProps> = ({ id, name, description, url, status, isFavorite, isFirst, isLast }) => {
  return (
    <div class={`${SERVICE_ITEM_WRAPPER} ${isFirst ? 'rounded-t-xl' : ''} ${isLast ? 'rounded-b-xl' : ''}`}>
      <button
        hx-post={`/api/favorite/${id}`}
        hx-swap="outerHTML"
        hx-target="closest .relative"
        class={FAVORITE_BUTTON_STYLE}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? (
          <Icons.StarFilled class={FAVORITE_STAR_FILLED_STYLE} />
        ) : (
          <Icons.Star class={FAVORITE_STAR_STYLE} />
        )}
      </button>

      <a
        href={`/api/go/${id}`}
        class={SERVICE_LINK_STYLE}
      >
        <div class={CONTENT_CONTAINER_STYLE}>
          <div class={TITLE_CONTAINER_STYLE}>
            <span class={NAME_STYLE}>
              {name}
            </span>
            {status === "new" && (
              <span class={STATUS_NEW_STYLE}>
                New
              </span>
            )}
            {status === "maintenance" && (
              <span class={STATUS_MAINTENANCE_STYLE}>
                Maintenance
              </span>
            )}
          </div>
          <span class={DESCRIPTION_STYLE} title={description || ""}>
            {description}
          </span>
        </div>

        <Icons.ChevronRight class={CHEVRON_STYLE} />
      </a>
    </div>
  )
}
