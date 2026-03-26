-- Create Blog Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    excerpt_en TEXT,
    excerpt_ar TEXT,
    content_en TEXT NOT NULL,
    content_ar TEXT NOT NULL,
    image_url TEXT,
    category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    display_order INTEGER DEFAULT 0,
    meta_title_en TEXT,
    meta_title_ar TEXT,
    meta_description_en TEXT,
    meta_description_ar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policies for blog_categories
CREATE POLICY "Categories are viewable by everyone" 
ON blog_categories FOR SELECT USING (true);

CREATE POLICY "Categories are manageable by admins" 
ON blog_categories FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' IN ('admin@newstarsports.com', 'duraimurugan84@gmail.com'))
WITH CHECK (auth.jwt() ->> 'email' IN ('admin@newstarsports.com', 'duraimurugan84@gmail.com'));

-- Policies for blogs
CREATE POLICY "Published blogs are viewable by everyone" 
ON blogs FOR SELECT USING (is_published = true);

CREATE POLICY "All blogs are viewable by admins" 
ON blogs FOR SELECT TO authenticated 
USING (auth.jwt() ->> 'email' IN ('admin@newstarsports.com', 'duraimurugan84@gmail.com'));

CREATE POLICY "Blogs are manageable by admins" 
ON blogs FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' IN ('admin@newstarsports.com', 'duraimurugan84@gmail.com'))
WITH CHECK (auth.jwt() ->> 'email' IN ('admin@newstarsports.com', 'duraimurugan84@gmail.com'));

-- Functions for updated_at
CREATE TRIGGER set_blog_categories_updated_at
BEFORE UPDATE ON blog_categories
FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER set_blogs_updated_at
BEFORE UPDATE ON blogs
FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category_id);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published);
