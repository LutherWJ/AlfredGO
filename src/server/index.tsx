import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { secureHeaders } from 'hono/secure-headers'
import { csrf } from 'hono/csrf'
import { initDb } from './db'
import { PATHS } from './util/paths'
import { authRoutes } from './routes/auth'
import { apiRoutes } from './routes/api.tsx'
import { uiRoutes } from './routes/ui.tsx'
import { renderer } from './middleware/renderer'
import { CONFIG } from './util/config'
import { rateLimiter } from 'hono-rate-limiter'
import { logger } from './util/logger'

const app = new Hono();
await initDb();

// Apply Global Middleware
app.use('*', renderer);

// Structured Request Logging
app.use('*', async (c, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    logger.info({
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
        duration: `${ms}ms`,
    }, 'Request completed');
});

app.use('*', secureHeaders());
app.use('*', csrf());
app.use('*', rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 500,
    standardHeaders: 'draft-7',
    keyGenerator: (c) => c.req.header('x-forwarded-for') || c.env?.remoteAddr || 'anonymous'
}));

// Route Modules
app.route('/auth', authRoutes);
app.route('/api', apiRoutes);
app.route('/', uiRoutes);

// Static Assets
app.use('/*', serveStatic({ root: PATHS.PUBLIC }));

app.onError((err, c) => {
    logger.error(err, 'Unhandled Exception');

    return c.json({
        success: false,
        message: 'Internal Server Error',
    }, 500);
})

export default {
    port: CONFIG.PORT,
    fetch: app.fetch,
}
