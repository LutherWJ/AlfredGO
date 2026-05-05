import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { ServiceModel } from '../models/service'
import { CategoryModel } from '../models/category'
import { UserModel } from '../models/user'
import { requireAuth, requireAdmin } from '../middleware/auth'
import { ServiceList } from '../views/components/ServiceList'
import { ServiceItem } from '../views/components/ServiceItem'
import { CategoryList } from '../views/components/CategoryList'
import { AdminDashboard } from '../views/components/AdminDashboard'
import { AdminCategoryList } from '../views/components/AdminCategoryList'
import { AdminServiceList } from '../views/components/AdminServiceList'
import { CategoryForm } from '../views/components/CategoryForm'
import { ServiceForm } from '../views/components/ServiceForm'
import { SearchResults } from '../views/components/SearchResults'
import type { User } from '../models/schemas'

const apiRoutes = new Hono<{ Variables: { user: User } }>();

// All API routes require authentication
apiRoutes.use('*', requireAuth);

const HEALTH_CHECK_STYLE = "text-green-600 font-semibold"

apiRoutes.get('/health', (c) => {
    return c.html(<span class={HEALTH_CHECK_STYLE}>Server is running and healthy!</span>);
});

// HTMX Endpoint for the main category list fragment
apiRoutes.get('/categories', (c) => {
    const user = c.get('user');
    const categories = CategoryModel.findAll();
    const favoritesCount = UserModel.getFavorites(user.id).length;
    const recentsCount = UserModel.getRecentServices(user.id).length;

    return c.html(
        <CategoryList
            categories={categories}
            user={user}
            favoritesCount={favoritesCount}
            recentsCount={recentsCount}
        />
    );
});

// Endpoint for real-time searching
apiRoutes.get(
    '/search',
    zValidator('query', z.object({
        q: z.string().optional().default('')
    })),
    (c) => {
        const { q: query } = c.req.valid('query');
        
        if (!query || query.trim() === '') {
            return c.html(<></>);
        }

        const results = ServiceModel.search(query);
        const user = c.get('user');
        const favoriteIds = UserModel.getFavorites(user.id).map(s => s.id);
        
        return c.html(<SearchResults query={query} results={results} favoriteIds={favoriteIds} />);
    }
);

// Favorite toggle endpoint
apiRoutes.post(
    '/favorite/:id',
    zValidator('param', z.object({
        id: z.string().transform(Number)
    })),
    (c) => {
        const { id: serviceId } = c.req.valid('param');
        const user = c.get('user');
        
        const isFavorite = UserModel.isFavorite(user.id, serviceId);
        
        if (isFavorite) {
            UserModel.removeFavorite(user.id, serviceId);
        } else {
            UserModel.addFavorite(user.id, serviceId);
        }
        
        const service = ServiceModel.findById(serviceId);
        if (!service) return c.text('Not Found', 404);
        
        return c.html(
            <ServiceItem 
                id={service.id}
                name={service.name}
                description={service.description}
                url={service.url}
                isFavorite={!isFavorite}
            />
        );
    }
);

// --- Admin CRUD Routes ---

// Categories Management
apiRoutes.get('/admin/categories', requireAdmin, (c) => {
    const categories = CategoryModel.findAll();
    return c.html(<AdminCategoryList categories={categories} />);
});

apiRoutes.get('/admin/categories/new', requireAdmin, (c) => {
    return c.html(<CategoryForm />);
});

apiRoutes.get('/admin/categories/:id/edit', requireAdmin, (c) => {
    const id = c.req.param('id');
    const category = CategoryModel.findById(id);
    if (!category) return c.text('Not Found', 404);
    return c.html(<CategoryForm category={category} />);
});

apiRoutes.post('/admin/categories', requireAdmin, zValidator('form', z.object({
    name: z.string().min(1),
    icon_name: z.string().optional(),
    sort_order: z.string().transform(Number)
})), (c) => {
    const data = c.req.valid('form');
    CategoryModel.create(data);
    const categories = CategoryModel.findAll();
    return c.html(<AdminCategoryList categories={categories} />);
});

apiRoutes.put('/admin/categories/:id', requireAdmin, zValidator('form', z.object({
    name: z.string().min(1),
    icon_name: z.string().optional(),
    sort_order: z.string().transform(Number)
})), (c) => {
    const id = c.req.param('id');
    const data = c.req.valid('form');
    CategoryModel.update(id, data);
    const categories = CategoryModel.findAll();
    return c.html(<AdminCategoryList categories={categories} />);
});

apiRoutes.delete('/admin/categories/:id', requireAdmin, (c) => {
    const id = c.req.param('id');
    CategoryModel.delete(id);
    const categories = CategoryModel.findAll();
    return c.html(<AdminCategoryList categories={categories} />);
});

// Services Management
apiRoutes.get('/admin/services', requireAdmin, (c) => {
    const services = ServiceModel.findAll();
    const categories = CategoryModel.findAll();
    return c.html(<AdminServiceList services={services} categories={categories} />);
});

apiRoutes.get('/admin/services/new', requireAdmin, (c) => {
    const categories = CategoryModel.findAll();
    return c.html(<ServiceForm categories={categories} />);
});

apiRoutes.get('/admin/services/:id/edit', requireAdmin, (c) => {
    const id = c.req.param('id');
    const service = ServiceModel.findById(id);
    if (!service) return c.text('Not Found', 404);
    const categories = CategoryModel.findAll();
    return c.html(<ServiceForm service={service} categories={categories} />);
});

apiRoutes.post('/admin/services', requireAdmin, zValidator('form', z.object({
    name: z.string().min(1),
    url: z.string().url(),
    description: z.string().optional(),
    category_id: z.string().optional().transform(v => v ? Number(v) : undefined)
})), (c) => {
    const data = c.req.valid('form');
    ServiceModel.create({
        name: data.name,
        url: data.url,
        description: data.description || null,
        category_id: data.category_id || null
    });
    const services = ServiceModel.findAll();
    const categories = CategoryModel.findAll();
    return c.html(<AdminServiceList services={services} categories={categories} />);
});

apiRoutes.put('/admin/services/:id', requireAdmin, zValidator('form', z.object({
    name: z.string().min(1),
    url: z.string().url(),
    description: z.string().optional(),
    category_id: z.string().optional().transform(v => v ? Number(v) : undefined)
})), (c) => {
    const id = c.req.param('id');
    const data = c.req.valid('form');
    ServiceModel.update(id, {
        name: data.name,
        url: data.url,
        description: data.description || null,
        category_id: data.category_id || null
    });
    const services = ServiceModel.findAll();
    const categories = CategoryModel.findAll();
    return c.html(<AdminServiceList services={services} categories={categories} />);
});

apiRoutes.delete('/admin/services/:id', requireAdmin, (c) => {
    const id = c.req.param('id');
    ServiceModel.delete(id);
    const services = ServiceModel.findAll();
    const categories = CategoryModel.findAll();
    return c.html(<AdminServiceList services={services} categories={categories} />);
});

// --- End Admin CRUD Routes ---

// HTMX Endpoint for category details (and special categories)
apiRoutes.get(
    '/category/:id',
    zValidator('param', z.object({
        id: z.string()
    })),
    (c) => {
        const { id: categoryId } = c.req.valid('param');
        const user = c.get('user');

        // Handle special categories
        if (categoryId === 'admin') {
            const user = c.get('user');
            if (user.role !== 'admin') {
                return c.text('Forbidden - Admins only', 403);
            }
            return c.html(<AdminDashboard />);
        }

        if (categoryId === 'favorites') {
            const services = UserModel.getFavorites(user.id);
            const favoriteIds = services.map(s => s.id);
            return c.html(<ServiceList title="My Favorites" services={services} favoriteIds={favoriteIds} />);
        }

        if (categoryId === 'recents') {
            const services = UserModel.getRecentServices(user.id);
            const favoriteIds = UserModel.getFavorites(user.id).map(s => s.id);
            return c.html(<ServiceList title="Recently Accessed" services={services} favoriteIds={favoriteIds} />);
        }

        // Handle database categories
        const category = CategoryModel.findById(categoryId);
        if (!category) {
            return c.text('Category not found', 404);
        }

        const services = ServiceModel.findByCategory(categoryId);
        const favoriteIds = UserModel.getFavorites(user.id).map(s => s.id);
        return c.html(<ServiceList title={category.name} services={services} favoriteIds={favoriteIds} />);
    }
);

// Outbound link tracking and redirect
apiRoutes.get(
    '/go/:id',
    requireAuth,
    zValidator('param', z.object({
        id: z.string().regex(/^\d+$/).transform(Number)
    })),
    (c) => {
        const { id: serviceId } = c.req.valid('param');
        const user = c.get('user');
        const service = ServiceModel.findById(serviceId);

        if (!service) {
            return c.text('Service not found', 404);
        }

        // Track access
        UserModel.recordAccess(user.id, serviceId);

        return c.redirect(service.url);
    }
);

export { apiRoutes };
