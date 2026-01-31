-- Supabase Schema for Portfolio with Multi-language and Live Editing support

-- 1. Site Metadata & General Content
CREATE TABLE site_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale TEXT NOT NULL,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(locale, section, key)
);

-- 2. Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_index INT DEFAULT 0,
  image_url TEXT,
  link TEXT,
  github_link TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects_i18n (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (project_id, locale)
);

-- 3. Testimonials
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE testimonials_i18n (
  testimonial_id UUID REFERENCES testimonials(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  content TEXT NOT NULL,
  PRIMARY KEY (testimonial_id, locale)
);

-- 4. Skills
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- e.g., 'frontend', 'backend', 'tools'
  name TEXT NOT NULL,
  icon_name TEXT, -- Lucide icon name
  proficiency INT DEFAULT 0, -- 0-100
  order_index INT DEFAULT 0
);

-- Security: Enable RLS
ALTER TABLE site_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Policies: Public Read
CREATE POLICY "Public Read Site Data" ON site_data FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read Projects i18n" ON projects_i18n FOR SELECT USING (true);
CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public Read Testimonials i18n" ON testimonials_i18n FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON skills FOR SELECT USING (true);

-- Policies: Authenticated Update (Admin)
CREATE POLICY "Admin Update Site Data" ON site_data FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Projects i18n" ON projects_i18n FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Testimonials i18n" ON testimonials_i18n FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Skills" ON skills FOR ALL USING (auth.role() = 'authenticated');

-- Instructions:
-- 1. Create a Supabase project.
-- 2. Run this SQL in the Supabase SQL Editor.
-- 3. Set up Auth for yourself (Admin user).
-- 4. Get URL and Anon Key and put them in .env.local.
