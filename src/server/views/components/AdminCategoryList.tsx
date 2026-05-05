import type { FC } from 'hono/jsx'
import type { CategoryWithCount } from '../../models/category'
import { Icons } from './Icons'

const LIST_CONTAINER = "flex flex-col gap-3"
const ITEM_STYLE = "flex items-center justify-between p-4 bg-white rounded-xl border border-border shadow-sm group hover:border-primary/30 transition-all"
const INFO_STYLE = "flex flex-col"
const NAME_STYLE = "font-semibold text-foreground group-hover:text-primary transition-colors"
const COUNT_STYLE = "text-xs text-muted-foreground"
const ACTIONS_STYLE = "flex items-center gap-2"
const EDIT_BUTTON = "p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 active:bg-primary/10 rounded-lg transition-all"
const DELETE_BUTTON = "p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 active:bg-destructive/10 rounded-lg transition-all"
const ADD_BUTTON = "mb-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-semibold shadow-sm hover:bg-primary/90 active:brightness-90 transition-all cursor-pointer"

interface AdminCategoryListProps {
  categories: CategoryWithCount[]
}

export const AdminCategoryList: FC<AdminCategoryListProps> = ({ categories }) => {
  return (
    <div class="animate-in fade-in duration-300">
      <button 
        hx-get="/api/admin/categories/new" 
        hx-target="#admin-content"
        class={ADD_BUTTON}
      >
        <Icons.Plus class="h-5 w-5" />
        <span>Add New Category</span>
      </button>

      <div class={LIST_CONTAINER}>
        {categories.map(category => {
          const Icon = (category.icon_name && (Icons as any)[category.icon_name]) ? (Icons as any)[category.icon_name] : Icons.Service
          
          return (
            <div class={ITEM_STYLE}>
              <div class="flex items-center gap-4">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon class="h-5 w-5 text-primary" />
                </div>
                <div class={INFO_STYLE}>
                  <span class={NAME_STYLE}>{category.name}</span>
                  <span class={COUNT_STYLE}>{category.service_count} Services</span>
                </div>
              </div>
              <div class={ACTIONS_STYLE}>
                <button 
                  hx-get={`/api/admin/categories/${category.id}/edit`}
                  hx-target="#admin-content"
                  class={EDIT_BUTTON}
                  title="Edit Category"
                >
                  <Icons.Edit class="h-5 w-5" />
                </button>
                <button 
                  hx-delete={`/api/admin/categories/${category.id}`}
                  hx-confirm={`Are you sure you want to delete "${category.name}"? This will NOT delete associated services, but they will become uncategorized.`}
                  hx-target="#admin-content"
                  class={DELETE_BUTTON}
                  title="Delete Category"
                >
                  <Icons.Trash class="h-5 w-5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
