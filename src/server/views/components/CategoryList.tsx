import type { FC } from 'hono/jsx'
import { CategoryItem } from './CategoryItem'
import type { Category, User } from '../../models/schemas'

interface CategoryListProps {
  categories: Category[];
  user: User;
  favoritesCount: number;
  recentsCount: number;
}

const SECTION_STYLE = "mb-6 animate-in fade-in duration-300"
const HEADING_STYLE = "mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
const CONTAINER_STYLE = "mx-4 overflow-hidden rounded-xl border border-border divide-y divide-border"

export const CategoryList: FC<CategoryListProps> = ({ categories, user, favoritesCount, recentsCount }) => {
  // Define static special categories
  const specialCategories: { id: string; name: string; count: number; icon: string }[] = [];
  
  if (user.role === 'admin') {
    specialCategories.push({ id: 'admin', name: 'Admin Panel', count: 0, icon: 'Shield' });
  }
  specialCategories.push({ id: 'favorites', name: 'Favorites', count: favoritesCount, icon: 'Star' });
  specialCategories.push({ id: 'recents', name: 'Recents', count: recentsCount, icon: 'History' });

  const hasCategories = categories.length > 0;

  return (
    <>
      {/* Categories Section */}
      <section class={SECTION_STYLE}>
        <h2 class={HEADING_STYLE}>
          Categories
        </h2>
        <div class={CONTAINER_STYLE}>
          {/* Render Special Categories */}
          {specialCategories.map((cat, index) => (
            <CategoryItem
              id={cat.id}
              name={cat.name}
              serviceCount={cat.count}
              iconName={cat.icon}
              isFirst={index === 0}
              isLast={!hasCategories && index === specialCategories.length - 1}
            />
          ))}

          {/* Render Database Categories */}
          {hasCategories && categories.map((category, index) => (
            <CategoryItem
              id={category.id}
              name={category.name}
              serviceCount={(category as any).service_count || 0}
              iconName={category.icon_name}
              isFirst={false} // Special categories always come first
              isLast={index === categories.length - 1}
            />
          ))}
        </div>
      </section>
    </>
  )
}
