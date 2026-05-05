import { Hono } from 'hono'
import { CategoryModel } from '../models/category'
import { UserModel } from '../models/user'
import { ServiceModel } from '../models/service'
import { Home } from '../views/Home'
import { CategoryList } from '../views/components/CategoryList'
import { ServiceList } from '../views/components/ServiceList'
import { AdminDashboard } from '../views/components/AdminDashboard'
import { requireAuth, requireAdmin } from '../middleware/auth'
import type { User } from '../models/schemas'

const uiRoutes = new Hono<{ Variables: { user: User } }>();

// Main directory page
uiRoutes.get('/', requireAuth, (c) => {
    const user = c.get('user');
    const categories = CategoryModel.findAll();
    const favoritesCount = UserModel.getFavorites(user.id).length;
    const recentsCount = UserModel.getRecentServices(user.id).length;

    return c.render(
        <Home>
            <CategoryList
                categories={categories}
                user={user}
                favoritesCount={favoritesCount}
                recentsCount={recentsCount}
            />
        </Home>,
        { title: 'AlfredGo Directory' }
    );
});

// Category detail page
uiRoutes.get('/category/:id', requireAuth, (c) => {
    const id = c.req.param('id');
    const user = c.get('user');
    const category = CategoryModel.findById(id);

    if (!category) {
        return c.redirect('/');
    }

    const services = ServiceModel.findByCategory(id);
    const favoriteIds = UserModel.getFavorites(user.id).map(s => s.id);

    return c.render(
        <Home>
            <ServiceList title={category.name} services={services} favoriteIds={favoriteIds} />
        </Home>,
        { title: `${category.name} - AlfredGo` }
    );
});

// Favorites page
uiRoutes.get('/favorites', requireAuth, (c) => {
    const user = c.get('user');
    const services = UserModel.getFavorites(user.id);
    const favoriteIds = services.map(s => s.id);

    return c.render(
        <Home>
            <ServiceList title="My Favorites" services={services} favoriteIds={favoriteIds} />
        </Home>,
        { title: 'My Favorites - AlfredGo' }
    );
});

// Recents page
uiRoutes.get('/recents', requireAuth, (c) => {
    const user = c.get('user');
    const services = UserModel.getRecentServices(user.id);
    const favoriteIds = UserModel.getFavorites(user.id).map(s => s.id);

    return c.render(
        <Home>
            <ServiceList title="Recently Accessed" services={services} favoriteIds={favoriteIds} />
        </Home>,
        { title: 'Recent Services - AlfredGo' }
    );
});

// Admin Dashboard page
uiRoutes.get('/admin', requireAuth, requireAdmin, (c) => {
    return c.render(
        <Home>
            <AdminDashboard />
        </Home>,
        { title: 'Admin Dashboard - AlfredGo' }
    );
});

export { uiRoutes };
