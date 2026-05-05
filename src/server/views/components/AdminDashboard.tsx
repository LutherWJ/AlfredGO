import type { FC } from 'hono/jsx'
import { Icons } from './Icons'

const WRAPPER_STYLE = "animate-in fade-in slide-in-from-bottom-2 duration-300"
const BACK_BUTTON_CONTAINER = "mx-4 mt-2 mb-4"
const BACK_BUTTON_STYLE = "text-sm font-semibold text-primary flex items-center gap-1.5 px-3 py-2 border border-primary/20 rounded-lg hover:bg-primary/5 active:bg-primary/10 transition-all cursor-pointer shadow-sm"
const SECTION_STYLE = "mb-6"
const HEADING_STYLE = "mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
const CONTENT_CONTAINER = "mx-4 p-6 bg-card rounded-xl border border-border shadow-sm"
const WELCOME_TEXT_STYLE = "text-muted-foreground mb-6"
const GRID_STYLE = "grid grid-cols-1 gap-4"
const BUTTON_STYLE = "flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-semibold shadow-sm hover:bg-primary/90 active:brightness-90 transition-all text-center cursor-pointer";

export const AdminDashboard: FC = () => {
  return (
    <div class={WRAPPER_STYLE}>
      <div class={BACK_BUTTON_CONTAINER}>
        <button hx-get="/api/categories" hx-target="#main-content" hx-push-url="/" class={BACK_BUTTON_STYLE}>
          <Icons.ArrowLeft class="h-4 w-4 stroke-[2.5]" />
          <span>Back to Categories</span>
        </button>
      </div>
      <section class={SECTION_STYLE}>
        <h2 class={HEADING_STYLE}>
          Admin Panel
        </h2>
        <div class={CONTENT_CONTAINER} id="admin-content">
          <p class={WELCOME_TEXT_STYLE}>Welcome to the Administrator dashboard. Manage your campus directory below.</p>
          <div class={GRID_STYLE}>
            <button 
              hx-get="/api/admin/services" 
              hx-target="#admin-content" 
              class={BUTTON_STYLE}
            >
              <Icons.Service class="h-5 w-5" />
              <span>Manage Services</span>
            </button>
            <button 
              hx-get="/api/admin/categories" 
              hx-target="#admin-content" 
              class={BUTTON_STYLE}
            >
              <Icons.Plus class="h-5 w-5" />
              <span>Manage Categories</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
