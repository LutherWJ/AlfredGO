import type { FC } from 'hono/jsx'
import type { Service } from '../../models/schemas'
import { Icons } from './Icons'

const LIST_CONTAINER = "flex flex-col gap-6"
const SECTION_STYLE = "flex flex-col gap-2"
const SECTION_TITLE = "text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-2"
const ITEM_STYLE = "flex items-center justify-between p-4 bg-white rounded-xl border border-border shadow-sm group hover:border-primary/30 transition-all"
const INFO_STYLE = "flex flex-col overflow-hidden"
const NAME_STYLE = "font-semibold text-foreground group-hover:text-primary transition-colors truncate"
const URL_STYLE = "text-xs text-muted-foreground truncate"
const ACTIONS_STYLE = "flex items-center gap-2"
const EDIT_BUTTON = "p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 active:bg-primary/10 rounded-lg transition-all"
const DELETE_BUTTON = "p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 active:bg-destructive/10 rounded-lg transition-all"
const ADD_BUTTON = "mb-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-semibold shadow-sm hover:bg-primary/90 active:brightness-90 transition-all cursor-pointer"

interface AdminServiceListProps {
  services: Service[]
  categories: { id: number, name: string }[]
}

export const AdminServiceList: FC<AdminServiceListProps> = ({ services, categories }) => {
  // Group services by category
  const grouped = services.reduce((acc, service) => {
    const catId = service.category_id || 0
    if (!acc[catId]) acc[catId] = []
    acc[catId].push(service)
    return acc
  }, {} as Record<number, Service[]>)

  return (
    <div class="animate-in fade-in duration-300">
      <button 
        hx-get="/api/admin/services/new" 
        hx-target="#admin-content"
        class={ADD_BUTTON}
      >
        <Icons.Plus class="h-5 w-5" />
        <span>Add New Service</span>
      </button>

      <div class={LIST_CONTAINER}>
        {categories.map(cat => grouped[cat.id] && (
          <div class={SECTION_STYLE}>
            <h3 class={SECTION_TITLE}>{cat.name}</h3>
            <div class="flex flex-col gap-2">
              {(grouped[cat.id] || []).map(service => (
                <div class={ITEM_STYLE}>
                  <div class={INFO_STYLE}>
                    <span class={NAME_STYLE}>{service.name}</span>
                    <span class={URL_STYLE}>{service.url}</span>
                  </div>
                  <div class={ACTIONS_STYLE}>
                    <button 
                      hx-get={`/api/admin/services/${service.id}/edit`}
                      hx-target="#admin-content"
                      class={EDIT_BUTTON}
                    >
                      <Icons.Edit class="h-5 w-5" />
                    </button>
                    <button 
                      hx-delete={`/api/admin/services/${service.id}`}
                      hx-confirm={`Are you sure you want to delete "${service.name}"?`}
                      hx-target="#admin-content"
                      class={DELETE_BUTTON}
                    >
                      <Icons.Trash class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {grouped[0] && (
          <div class={SECTION_STYLE}>
            <h3 class={SECTION_TITLE}>Uncategorized</h3>
            <div class="flex flex-col gap-2">
              {grouped[0].map(service => (
                <div class={ITEM_STYLE}>
                  <div class={INFO_STYLE}>
                    <span class={NAME_STYLE}>{service.name}</span>
                    <span class={URL_STYLE}>{service.url}</span>
                  </div>
                  <div class={ACTIONS_STYLE}>
                    <button 
                      hx-get={`/api/admin/services/${service.id}/edit`}
                      hx-target="#admin-content"
                      class={EDIT_BUTTON}
                    >
                      <Icons.Edit class="h-5 w-5" />
                    </button>
                    <button 
                      hx-delete={`/api/admin/services/${service.id}`}
                      hx-confirm={`Are you sure you want to delete "${service.name}"?`}
                      hx-target="#admin-content"
                      class={DELETE_BUTTON}
                    >
                      <Icons.Trash class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
