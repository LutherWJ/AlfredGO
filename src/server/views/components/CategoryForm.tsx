import type { FC } from 'hono/jsx'
import type { Category } from '../../models/schemas'

const FORM_STYLE = "flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300"
const FIELD_GROUP = "flex flex-col gap-1.5"
const LABEL_STYLE = "text-sm font-semibold text-foreground px-1"
const INPUT_STYLE = "px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
const SELECT_STYLE = "px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
const BUTTON_GROUP = "flex items-center gap-3 mt-4"
const SAVE_BUTTON = "flex-1 px-4 py-3 bg-primary text-white rounded-xl font-semibold shadow-sm hover:bg-primary/90 active:brightness-90 transition-all cursor-pointer"
const CANCEL_BUTTON = "flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold border border-border hover:bg-secondary/80 active:bg-secondary/90 transition-all cursor-pointer text-center"

interface CategoryFormProps {
  category?: Category
}

export const CategoryForm: FC<CategoryFormProps> = ({ category }) => {
  const isEdit = !!category
  const action = isEdit ? `/api/admin/categories/${category.id}` : '/api/admin/categories'
  const method = isEdit ? 'hx-put' : 'hx-post'

  return (
    <form 
      {...{ [method]: action }}
      hx-target="#admin-content"
      hx-push-url="/admin"
      class={FORM_STYLE}
    >
      <h3 class="text-lg font-bold text-foreground mb-2">
        {isEdit ? `Edit Category: ${category.name}` : 'Create New Category'}
      </h3>

      <div class={FIELD_GROUP}>
        <label class={LABEL_STYLE} for="name">Category Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={category?.name || ''} 
          placeholder="e.g. Student Life"
          required 
          class={INPUT_STYLE}
        />
      </div>

      <div class={FIELD_GROUP}>
        <label class={LABEL_STYLE} for="sort_order">Sort Order</label>
        <input 
          type="number" 
          id="sort_order" 
          name="sort_order" 
          value={category?.sort_order?.toString() || '0'} 
          required 
          class={INPUT_STYLE}
        />
        <p class="text-[10px] text-muted-foreground px-1">Lower numbers appear first.</p>
      </div>

      <div class={FIELD_GROUP}>
        <label class={LABEL_STYLE} for="icon_name">Icon Name</label>
        <div class="relative">
          <select id="icon_name_select" class={SELECT_STYLE + " w-full mb-2"} onchange="document.getElementById('icon_name').value = this.value">
            <option value="Service" selected={category?.icon_name === 'Service'}>Service (Default)</option>
            <option value="BookOpen" selected={category?.icon_name === 'BookOpen'}>BookOpen (Academics)</option>
            <option value="Coffee" selected={category?.icon_name === 'Coffee'}>Coffee (Campus Life)</option>
            <option value="DollarSign" selected={category?.icon_name === 'DollarSign'}>DollarSign (Finance)</option>
            <option value="Monitor" selected={category?.icon_name === 'Monitor'}>Monitor (IT Resources)</option>
            <option value="Briefcase" selected={category?.icon_name === 'Briefcase'}>Briefcase (Career Services)</option>
            <option value="Building2" selected={category?.icon_name === 'Building2'}>Building2 (Campus Resources)</option>
            <option value="Link" selected={category?.icon_name === 'Link'}>Link (General)</option>
            <option value="Search" selected={category?.icon_name === 'Search'}>Search</option>
            <option value="Plus" selected={category?.icon_name === 'Plus'}>Plus</option>
            <option value="Edit" selected={category?.icon_name === 'Edit'}>Edit</option>
            <option value="Trash" selected={category?.icon_name === 'Trash'}>Trash</option>
            <option value="User" selected={category?.icon_name === 'User'}>User</option>
            <option value="Shield" selected={category?.icon_name === 'Shield'}>Shield (Admin)</option>
            <option value="History" selected={category?.icon_name === 'History'}>History (Recents)</option>
            <option value="Star" selected={category?.icon_name === 'Star'}>Star (Favorites)</option>
            <option value="LogOut" selected={category?.icon_name === 'LogOut'}>Logout</option>
            <option value="">Custom...</option>
          </select>
          <input 
            type="text" 
            id="icon_name" 
            name="icon_name" 
            value={category?.icon_name || 'Service'} 
            placeholder="Icon identifier (e.g. Service)"
            class={INPUT_STYLE}
          />
        </div>
        <p class="text-[10px] text-muted-foreground px-1">Choose a preset or enter a name from Icons.tsx</p>
      </div>

      <div class={BUTTON_GROUP}>
        <button type="submit" class={SAVE_BUTTON}>
          {isEdit ? 'Save Changes' : 'Create Category'}
        </button>
        <a 
          hx-get="/api/admin/categories" 
          hx-target="#admin-content" 
          class={CANCEL_BUTTON}
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
