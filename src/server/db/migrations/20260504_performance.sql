-- Performance Optimization Migration
-- Adds indexes for common query patterns

-- Index for category lookups (used on the home page and category detail pages)
CREATE INDEX IF NOT EXISTS idx_services_category_id ON services(category_id);

-- Index for name searching (used by the search bar)
CREATE INDEX IF NOT EXISTS idx_services_name ON services(name);

-- Index for sorting categories
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);
