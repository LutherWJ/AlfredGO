import type { FC } from 'hono/jsx'
import type { Service, Category } from '../../models/schemas'

const FORM_STYLE = "flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300"
const FIELD_GROUP = "flex flex-col gap-1.5"
const LABEL_STYLE = "text-sm font-semibold text-foreground px-1"
const INPUT_STYLE = "px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
const TEXTAREA_STYLE = "px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px] resize-none"
const SELECT_STYLE = "px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
const BUTTON_GROUP = "flex items-center gap-3 mt-4"
const SAVE_BUTTON = "flex-1 px-4 py-3 bg-primary text-white rounded-xl font-semibold shadow-sm hover:bg-primary/90 active:brightness-90 transition-all cursor-pointer"
const CANCEL_BUTTON = "flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold border border-border hover:bg-secondary/80 active:bg-secondary/90 transition-all cursor-pointer text-center"

interface ServiceFormProps {
  service?: Service
  categories: Category[]
}

export const ServiceForm: FC<ServiceFormProps> = ({ service, categories }) => {
  const isEdit = !!service
  const action = isEdit ? `/api/admin/services/${service.id}` : '/api/admin/services'
  const method = isEdit ? 'hx-put' : 'hx-post'

  return (
    <form 
      {...{ [method]: action }}
      hx-target="#admin-content"
      hx-push-url="/admin"
      class={FORM_STYLE}
    >
      <h3 class="text-lg font-bold text-foreground mb-2">
        {isEdit ? `Edit Service: ${service.name}` : 'Create New Service'}
      </h3>

      <div class={FIELD_GROUP}>
        <label class={LABEL_STYLE} for="name">Service Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={service?.name || ''} 
          placeholder="e.g. Banner Web"
          required 
          class={INPUT_STYLE}
        />
      </div>

      <div class={FIELD_GROUP}>
        <label class={LABEL_STYLE} for="url">URL</label>
        <input 
          type="url" 
          id="url" 
          name="url" 
          value={service?.url || ''} 
          placeholder="https://..."
          required 
          class={INPUT_STYLE}
        />
      </div>

      <div class={FIELD_GROUP}>
        <label class={LABEL_STYLE} for="description">Description (Optional)</label>
        <textarea 
          id="description" 
          name="description" 
          placeholder="Briefly describe what this service does..."
          class={TEXTAREA_STYLE}
        >{service?.description || ''}</textarea>
      </div>

      <div class={FIELD_GROUP}>
        <label class={LABEL_STYLE} for="category_id">Category</label>
        <div class="relative">
          <select id="category_id" name="category_id" class={SELECT_STYLE + " w-full"}>
            <option value="">Uncategorized</option>
            {categories.map(cat => (
              <option value={cat.id.toString()} selected={service?.category_id === cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div class={BUTTON_GROUP}>
        <button type="submit" class={SAVE_BUTTON}>
          {isEdit ? 'Save Changes' : 'Create Service'}
        </button>
        <a 
          hx-get="/api/admin/services" 
          hx-target="#admin-content" 
          class={CANCEL_BUTTON}
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
