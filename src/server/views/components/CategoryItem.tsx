import type { FC } from 'hono/jsx'
import { Icons } from './Icons'

interface CategoryItemProps {
  id: string | number
  name: string
  serviceCount: number
  iconName?: string | null
  isFirst?: boolean
  isLast?: boolean
}

const ITEM_BUTTON_STYLE = "flex w-full items-center gap-4 px-4 py-3.5 bg-card transition-colors hover:bg-secondary/50 active:bg-secondary/70 text-left border-border"
const ICON_CONTAINER_STYLE = "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10"
const ICON_STYLE = "h-5 w-5 text-primary"
const TEXT_CONTAINER_STYLE = "flex flex-1 flex-col min-w-0"
const NAME_STYLE = "font-medium text-card-foreground"
const COUNT_STYLE = "text-sm text-muted-foreground"
const CHEVRON_STYLE = "h-5 w-5 shrink-0 text-muted-foreground"

export const CategoryItem: FC<CategoryItemProps> = ({ id, name, serviceCount, iconName, isFirst, isLast }) => {
  const getPushUrl = () => {
    if (id === 'admin') return '/admin'
    if (id === 'favorites') return '/favorites'
    if (id === 'recents') return '/recents'
    return `/category/${id}`
  }

  // Use the icon from the database if it exists in our Icons map, otherwise fallback
  const Icon = (iconName && (Icons as any)[iconName]) ? (Icons as any)[iconName] : Icons.Service

  return (
    <button
      hx-get={`/api/category/${id}`}
      hx-target="#main-content"
      hx-push-url={getPushUrl()}
      class={`${ITEM_BUTTON_STYLE} ${isFirst ? 'rounded-t-xl' : ''} ${isLast ? 'rounded-b-xl' : ''}`}
    >
      <div class={ICON_CONTAINER_STYLE}>
        <Icon class={ICON_STYLE} />
      </div>

      <div class={TEXT_CONTAINER_STYLE}>
        <span class={NAME_STYLE}>
          {name}
        </span>
        <span class={COUNT_STYLE}>
          {serviceCount} {serviceCount === 1 ? 'service' : 'services'}
        </span>
      </div>

      <Icons.ChevronRight class={CHEVRON_STYLE} />
    </button>
  )
}
