import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { initDb } from './db'
import { PATHS } from './util/paths'
import { rateLimiter } from './middleware/rateLimiter'
import { authRoutes } from './routes/auth'
import { Home } from './views/Home'
import { renderer } from './middleware/renderer'
import { CONFIG } from './util/config'

const app = new Hono();

await initDb();

// Apply Global Middleware
app.use('*', renderer);
app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', rateLimiter({ limit: 100, windowMs: 60 * 1000 }));

app.route('/auth', authRoutes);

app.use('/*', serveStatic({ root: PATHS.PUBLIC }));

app.get('/', (c) => {
  return c.render(<Home />, { title: 'AlfredGo Directory' });
});

app.get('/api/health', (c) => {
  return c.html(`<span class="text-green-600 font-semibold">Server is running and healthy!</span>`);
});

app.onError((err, c) => {
    console.error(`[ERROR] ${err}`);

  return c.json({
    success: false,
    message: 'Internal Server Error',
  }, 500);
})

export default {
  port: CONFIG.PORT,
  fetch: app.fetch,
}
