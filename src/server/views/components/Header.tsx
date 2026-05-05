import type { FC } from 'hono/jsx'

const HEADER_STYLE = "sticky top-0 z-50 bg-primary border-b border-primary/80"
const CONTAINER_STYLE = "max-w-lg mx-auto px-4 py-4"
const FLEX_CONTAINER_STYLE = "flex items-center justify-center gap-3"
const LOGO_CONTAINER_STYLE = "flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1"
const LOGO_STYLE = "max-h-full max-w-full"
const TITLE_STYLE = "text-lg font-semibold text-primary-foreground leading-tight"
const SUBTITLE_STYLE = "text-xs text-primary-foreground/70"

export const Header: FC = () => {
  return (
    <header class={HEADER_STYLE}>
      <div class={CONTAINER_STYLE}>
        <div class={FLEX_CONTAINER_STYLE}>
          <div class={LOGO_CONTAINER_STYLE}>
            <img 
              src="/images/Alfred_State_Primary_Logo_250x250.png" 
              alt="Alfred State Logo" 
              class={LOGO_STYLE}
            />
          </div>
          <div>
            <h1 class={TITLE_STYLE}>
              Alfred State
            </h1>
            <p class={SUBTITLE_STYLE}>
              Software & Services
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
