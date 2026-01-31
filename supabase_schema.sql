-- Supabase Schema for Portfolio with Multi-language and Live Editing support

-- ⚠️ 기존 테이블 삭제 (재실행 시 필요)
-- 주의: 기존 데이터가 모두 삭제됩니다!
DROP TABLE IF EXISTS testimonials_i18n CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS projects_i18n CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS site_data CASCADE;
DROP TABLE IF EXISTS careers CASCADE;
DROP TABLE IF EXISTS careers_i18n CASCADE;

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

-- 3. Testimonials (현재 비활성화됨)
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  order_index INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT false, -- 비활성화 플래그
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
CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (is_visible = true); -- 비활성화된 항목은 조회 불가
CREATE POLICY "Public Read Testimonials i18n" ON testimonials_i18n FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON skills FOR SELECT USING (true);

-- Policies: Authenticated Update (Admin)
CREATE POLICY "Admin Update Site Data" ON site_data FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Projects i18n" ON projects_i18n FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Testimonials i18n" ON testimonials_i18n FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Skills" ON skills FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- SAMPLE DATA: 주순태 (Joo Soontae) Portfolio
-- 위치: 경기도, 대한민국
-- 소속: 유스콘(YUSCON) 웹 개발자
-- GitHub: https://github.com/Stjoo0925
-- 포트폴리오: https://stjoo0925portfolio.vercel.app
-- ============================================

-- =========================================
-- Projects (프로젝트)
-- =========================================

INSERT INTO projects (id, order_index, image_url, link, github_link, tags) VALUES
  -- 1. YUSCON WEB (Terra Survey) - 메인 프로젝트
  ('11111111-1111-1111-1111-111111111111', 1, '/images/terra-survey.png', 'https://terra-survey.com/', NULL, 
   ARRAY['Next.js 15', 'React 19', 'TailwindCSS', 'Zustand', 'Fastify 5', 'Prisma', 'PostgreSQL', 'Redis', 'Socket.IO', 'Docker', 'Nginx']),
  
  -- 2. TerraLink - CAD/측량 데이터 시각화
  ('22222222-2222-2222-2222-222222222222', 2, '/images/terra-link.png', 'https://terra-link.co.kr/', 'https://github.com/Stjoo0925/TerraLinkPortfolio', 
   ARRAY['Vite 6', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Radix UI', 'Three.js', 'MxCAD', 'DXF Viewer', 'SWR', 'GSAP', 'proj4']),
  
  -- 3. Email Service (로그인 및 이차인증 시스템)
  ('33333333-3333-3333-3333-333333333333', 3, '/images/email-service.png', NULL, 'https://github.com/Stjoo0925/email-service', 
   ARRAY['Next.js 15', 'Spring Boot', 'Docker', 'MySQL', '2FA']),
  
  -- 4. Contribase (GitHub 기여도 분석 도구)
  ('44444444-4444-4444-4444-444444444444', 4, '/images/contribase.png', 'https://contribase.vercel.app', 'https://github.com/Stjoo0925/Contribase', 
   ARRAY['TypeScript', 'React', 'GitHub API', 'Analytics']),
  
  -- 5. Please README (GitHub 프로필 이미지 생성기)
  ('55555555-5555-5555-5555-555555555555', 5, '/images/please-readme.png', 'https://please-readme.vercel.app', 'https://github.com/Stjoo0925/please_readme', 
   ARRAY['TypeScript', 'React', 'SVG', 'GitHub']),
  
  -- 6. Afterburner (팀 프로젝트 프론트엔드)
  ('66666666-6666-6666-6666-666666666666', 6, '/images/afterburner.png', 'https://afterburner-khaki.vercel.app/', 'https://github.com/Afterburner2024/Afterburner-Front', 
   ARRAY['TypeScript', 'React', 'Team Project']),
  
  -- 7. WebSocket 실시간 통신 프로젝트
  ('77777777-7777-7777-7777-777777777777', 7, '/images/websocket.png', 'https://websocket2.vercel.app', 'https://github.com/Stjoo0925/websocket2', 
   ARRAY['TypeScript', 'WebSocket', 'Real-time']),
  
  -- 8. 개인 포트폴리오 (현재)
  ('88888888-8888-8888-8888-888888888888', 8, '/images/portfolio.png', 'https://stjoo0925portfolio.vercel.app', 'https://github.com/Stjoo0925/portfolio_new', 
   ARRAY['TypeScript', 'Next.js', 'Portfolio', 'Vercel']);

-- =========================================
-- Projects i18n (한국어)
-- =========================================

INSERT INTO projects_i18n (project_id, locale, title, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'ko', 'YUSCON WEB (Terra Survey)', 
   'Terra Survey 제품군(웹·데스크톱·오피스 시스템) 소개 및 고객 지원을 담당하는 공식 웹 애플리케이션입니다.

**프론트엔드**: Next.js 15, React 19, TailwindCSS, ReactBits, Zustand
**백엔드**: Fastify 5, Prisma ORM, PostgreSQL, Redis, Socket.IO
**인프라**: Docker, Docker Compose, Nginx

모노레포 구조로 프론트엔드/백엔드가 분리되어 있으며, Docker 기반 운영 환경으로 구성됩니다. 주요 기능으로 제품 소개, 자료실(다운로드), 공지사항, 고객지원(FAQ/문의), 관리자 기능(파일 업로드, 콘텐츠 관리)을 포함합니다.'),

  ('22222222-2222-2222-2222-222222222222', 'ko', 'TerraLink', 
   'React + Vite 기반의 TerraLink 프론트엔드 프로젝트입니다. 기존 시스템을 현대화하며 DX, 성능, 유지보수성을 강화했습니다.

**런타임/빌드**: Vite 6, React 19, TypeScript
**스타일**: Tailwind CSS v4, Tailwind Merge
**UI 컴포넌트**: Radix UI, 자체 컴포넌트
**시각화/도면**: Three.js, MxCAD, DXF Viewer, three-dxf-viewer
**유틸**: SWR, axios, dayjs, exceljs, mathjs, proj4, GSAP

SOAP/ASMX 백엔드와 통신하며 XML↔JSON 변환을 처리합니다. CAD 도면 시각화 및 측량 데이터 편집 기능을 제공합니다.'),

  ('33333333-3333-3333-3333-333333333333', 'ko', 'Email Service', 
   'Spring Boot와 Next.js 15를 활용한 로그인 및 이차인증(2FA) 시스템입니다. Docker와 MySQL을 사용한 컨테이너 기반 아키텍처로 구현했습니다.'),

  ('44444444-4444-4444-4444-444444444444', 'ko', 'Contribase', 
   'GitHub API를 활용한 기여도 분석 도구입니다. 저장소별 커밋 통계, 코드 기여 현황, 활동 히트맵 등을 시각화합니다.'),

  ('55555555-5555-5555-5555-555555555555', 'ko', 'Please README', 
   'GitHub 프로필에 사용할 수 있는 커스텀 이미지를 생성하는 도구입니다. SVG 기반의 동적 이미지 생성을 지원합니다.'),

  ('66666666-6666-6666-6666-666666666666', 'ko', 'Afterburner', 
   'Afterburner 프로젝트의 프론트엔드 파트를 담당했습니다. TypeScript와 React 기반으로 개발했으며, Vercel을 통해 배포되었습니다.'),

  ('77777777-7777-7777-7777-777777777777', 'ko', 'WebSocket 실시간 통신', 
   'WebSocket을 활용한 실시간 양방향 통신 프로젝트입니다. 채팅, 실시간 알림 등의 기능을 구현했습니다.'),

  ('88888888-8888-8888-8888-888888888888', 'ko', '개인 포트폴리오', 
   'Next.js와 TypeScript로 제작한 개인 포트폴리오 웹사이트입니다. 반응형 디자인과 다국어 지원을 적용했습니다.');

-- =========================================
-- Projects i18n (영어)
-- =========================================

INSERT INTO projects_i18n (project_id, locale, title, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'en', 'YUSCON WEB (Terra Survey)', 
   'Official web application for Terra Survey product line (Web, Desktop, Office System) introduction and customer support.

**Frontend**: Next.js 15, React 19, TailwindCSS, ReactBits, Zustand
**Backend**: Fastify 5, Prisma ORM, PostgreSQL, Redis, Socket.IO
**Infrastructure**: Docker, Docker Compose, Nginx

Built as a monorepo with separated frontend/backend, running on Docker-based production environment. Features include product introduction, downloads, announcements, customer support (FAQ/inquiries), and admin functions (file upload, content management).'),

  ('22222222-2222-2222-2222-222222222222', 'en', 'TerraLink', 
   'React + Vite based TerraLink frontend project. Modernized legacy system with improved DX, performance, and maintainability.

**Runtime/Build**: Vite 6, React 19, TypeScript
**Styling**: Tailwind CSS v4, Tailwind Merge
**UI Components**: Radix UI, Custom components
**Visualization/CAD**: Three.js, MxCAD, DXF Viewer, three-dxf-viewer
**Utilities**: SWR, axios, dayjs, exceljs, mathjs, proj4, GSAP

Communicates with SOAP/ASMX backend with XML↔JSON conversion. Provides CAD drawing visualization and survey data editing features.'),

  ('33333333-3333-3333-3333-333333333333', 'en', 'Email Service', 
   'Login and two-factor authentication (2FA) system built with Spring Boot and Next.js 15. Implemented with container-based architecture using Docker and MySQL.'),

  ('44444444-4444-4444-4444-444444444444', 'en', 'Contribase', 
   'GitHub contribution analysis tool using GitHub API. Visualizes commit statistics by repository, code contribution status, and activity heatmaps.'),

  ('55555555-5555-5555-5555-555555555555', 'en', 'Please README', 
   'Tool for generating custom images for GitHub profiles. Supports dynamic SVG-based image generation.'),

  ('66666666-6666-6666-6666-666666666666', 'en', 'Afterburner', 
   'Led the frontend development for the Afterburner project. Built with TypeScript and React, deployed via Vercel.'),

  ('77777777-7777-7777-7777-777777777777', 'en', 'WebSocket Real-time Communication', 
   'Real-time bidirectional communication project using WebSocket. Implemented features like chat and real-time notifications.'),

  ('88888888-8888-8888-8888-888888888888', 'en', 'Personal Portfolio', 
   'Personal portfolio website built with Next.js and TypeScript. Features responsive design and multi-language support.');

-- =========================================
-- Skills (기술 스택) - 실제 프로젝트 기반
-- =========================================

INSERT INTO skills (category, name, icon_name, proficiency, order_index) VALUES
  -- Frontend (실제 사용 기술)
  ('frontend', 'React 19', 'Atom', 95, 1),
  ('frontend', 'Next.js 15', 'Layers', 95, 2),
  ('frontend', 'TypeScript', 'FileCode2', 90, 3),
  ('frontend', 'Vite 6', 'Zap', 90, 4),
  ('frontend', 'Tailwind CSS v4', 'Palette', 90, 5),
  ('frontend', 'Radix UI', 'Component', 85, 6),
  ('frontend', 'Three.js / MxCAD', 'Box', 80, 7),
  ('frontend', 'Zustand / SWR', 'Database', 85, 8),
  ('frontend', 'GSAP', 'Sparkles', 75, 9),
  
  -- Backend
  ('backend', 'Fastify 5', 'Rocket', 85, 1),
  ('backend', 'Prisma ORM', 'Database', 90, 2),
  ('backend', 'PostgreSQL', 'Database', 85, 3),
  ('backend', 'Redis', 'Zap', 80, 4),
  ('backend', 'Socket.IO', 'Radio', 85, 5),
  ('backend', 'Spring Boot', 'Coffee', 70, 6),
  ('backend', 'Python', 'Terminal', 75, 7),
  
  -- DevOps & Infrastructure
  ('devops', 'Docker / Compose', 'Container', 90, 1),
  ('devops', 'Nginx', 'Server', 85, 2),
  ('devops', 'GitHub Actions', 'GitBranch', 80, 3),
  ('devops', 'Vercel', 'Cloud', 90, 4),
  ('devops', 'ITEasy Object Storage', 'HardDrive', 75, 5),
  
  -- Tools
  ('tools', 'Git', 'GitBranch', 95, 1),
  ('tools', 'GitHub', 'Github', 95, 2),
  ('tools', 'VS Code', 'Code', 95, 3),
  ('tools', 'ESLint / Prettier', 'CheckCircle', 90, 4),
  ('tools', 'Swagger', 'FileText', 85, 5);

-- =========================================
-- Testimonials (동료/거래처 평가 - 비활성화됨)
-- is_visible = false로 설정하여 공개하지 않음
-- =========================================

-- 현재 동료 및 거래처 평가는 잠금 처리됨
-- 필요 시 is_visible을 true로 변경하여 활성화 가능

-- =========================================
-- Instructions
-- =========================================
-- 1. Supabase 프로젝트를 생성합니다.
-- 2. Supabase SQL Editor에서 이 SQL을 실행합니다.
-- 3. 본인 계정으로 Auth 설정을 합니다 (Admin 사용자).
-- 4. URL과 Anon Key를 .env.local에 설정합니다.
--
-- =========================================
-- 5. Careers (경력 및 이력사항)
-- =========================================
CREATE TABLE careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE, -- NULL이면 현재 재직 중
  is_current BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE careers_i18n (
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT, -- 주요 업무 및 성과 (Markdown 지원 가능)
  PRIMARY KEY (career_id, locale)
);

-- RLS for Careers
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers_i18n ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Careers" ON careers FOR SELECT USING (true);
CREATE POLICY "Public Read Careers i18n" ON careers_i18n FOR SELECT USING (true);
CREATE POLICY "Admin Update Careers" ON careers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Careers i18n" ON careers_i18n FOR ALL USING (auth.role() = 'authenticated');

-- =========================================
-- Sample Data for Careers
-- =========================================
INSERT INTO careers (id, company_name, start_date, end_date, is_current, order_index) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'YUSCON', '2023-01-01', NULL, true, 1);

INSERT INTO careers_i18n (career_id, locale, role, description) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ko', '웹 개발자 (Web Developer)', 
   '**주요 업무:**
- Terra Survey 제품군 웹 애플리케이션 개발 및 유지보수
- 사내 업무 효율화를 위한 백오피스 시스템 구축
- 레거시 시스템의 현대화 및 성능 최적화 주도
- Docker 기반의 CI/CD 파이프라인 구축 및 운영'),
  
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'en', 'Web Developer', 
   '**Key and Responsibilities:**
- Develop and maintain web applications for Terra Survey product line
- Build back-office systems for internal efficiency
- Lead modernization and performance optimization of legacy systems
- Establish and operate Docker-based CI/CD pipelines');

-- =========================================
-- 6. Site Data (UI 텍스트 및 레이블) - messages/ko.json, en.json 내용 포함
-- =========================================

INSERT INTO site_data (locale, section, key, value) VALUES
  -- Korean (ko)
  ('ko', 'Hero', 'greeting', '{"content": "Portfolio"}'),
  ('ko', 'Hero', 'intro', '{"content": "Innovative Web Experiences"}'),
  ('ko', 'Hero', 'name', '{"content": "주순태"}'),
  ('ko', 'Hero', 'role', '{"content": "Full-Stack Developer"}'),
  ('ko', 'Hero', 'description', '{"content": "복잡한 문제를 간결한 코드로 해결하고 사용자 중심의 가치를 설계합니다."}'),
  ('ko', 'Hero', 'viewWork', '{"content": "작업물 보기"}'),
  ('ko', 'Hero', 'contact', '{"content": "연락하기"}'),
  ('ko', 'Hero', 'scroll', '{"content": "SCROLL"}'),
  
  ('ko', 'About', 'title', '{"content": "창의적인 해결책으로 비즈니스 가치를 높이는 개발자"}'),
  ('ko', 'About', 'philosophy', '{"content": "단순히 돌아가는 코드가 아닌, 누구나 읽기 좋고 유지보수가 쉬운 시스템을 구축하는 것을 최우선으로 생각합니다."}'),
  ('ko', 'About', 'approach', '{"content": "사용자의 목소리에 귀를 기울이고, 기술적 한계를 뛰어넘는 최적의 UX를 제공하기 위해 항상 끊임없이 탐구합니다."}'),
  
  ('ko', 'Projects', 'title', '{"content": "Projects"}'),
  ('ko', 'Projects', 'viewSite', '{"content": "사이트"}'),
  ('ko', 'Projects', 'viewCode', '{"content": "코드"}'),
  
  ('ko', 'Skills', 'title', '{"content": "Skills"}'),
  ('ko', 'Skills', 'subtitle', '{"content": "경험이 있는 기술들"}'),
  
  ('ko', 'Contact', 'title', '{"content": "Contact"}'),
  ('ko', 'Contact', 'available', '{"content": "새로운 프로젝트를 찾고 있습니다"}'),
  
  ('ko', 'Footer', 'copyright', '{"content": "© 2025 stjoo0925"}'),
  
  ('ko', 'Nav', 'projects', '{"content": "Projects"}'),
  ('ko', 'Nav', 'skills', '{"content": "Skills"}'),
  ('ko', 'Nav', 'contact', '{"content": "Contact"}'),
  
  ('ko', 'Toast', 'saveSuccess', '{"content": "저장됨"}'),
  ('ko', 'Toast', 'saveFailed', '{"content": "실패: "}'),
  
  ('ko', 'Experience', 'title', '{"content": "EXPERIENCE"}'),

  -- English (en)
  ('en', 'Hero', 'greeting', '{"content": "Portfolio"}'),
  ('en', 'Hero', 'intro', '{"content": "Designing the Future of Web"}'),
  ('en', 'Hero', 'name', '{"content": "Soontae Joo"}'),
  ('en', 'Hero', 'role', '{"content": "Full-Stack Developer"}'),
  ('en', 'Hero', 'description', '{"content": "Solving complex problems with elegant code and designing user-centric values."}'),
  ('en', 'Hero', 'viewWork', '{"content": "View Work"}'),
  ('en', 'Hero', 'contact', '{"content": "Get in Touch"}'),
  ('en', 'Hero', 'scroll', '{"content": "SCROLL"}'),

  ('en', 'About', 'title', '{"content": "A developer who enhances business value with creative solutions"}'),
  ('en', 'About', 'philosophy', '{"content": "I prioritize building systems that are readable and easy to maintain, not just code that works."}'),
  ('en', 'About', 'approach', '{"content": "I listen directly to users and constantly explore to provide optimal UX beyond technical limits."}'),

  ('en', 'Projects', 'title', '{"content": "Projects"}'),
  ('en', 'Projects', 'viewSite', '{"content": "Site"}'),
  ('en', 'Projects', 'viewCode', '{"content": "Code"}'),

  ('en', 'Skills', 'title', '{"content": "Skills"}'),
  ('en', 'Skills', 'subtitle', '{"content": "Technologies I work with"}'),

  ('en', 'Contact', 'title', '{"content": "Contact"}'),
  ('en', 'Contact', 'available', '{"content": "Available for new projects"}'),

  ('en', 'Footer', 'copyright', '{"content": "© 2025 stjoo0925"}'),

  ('en', 'Nav', 'projects', '{"content": "Projects"}'),
  ('en', 'Nav', 'skills', '{"content": "Skills"}'),
  ('en', 'Nav', 'contact', '{"content": "Contact"}'),

  ('en', 'Toast', 'saveSuccess', '{"content": "Saved"}'),
  ('en', 'Toast', 'saveFailed', '{"content": "Failed: "}'),

  ('en', 'Experience', 'title', '{"content": "EXPERIENCE"}')
ON CONFLICT (locale, section, key) 
DO UPDATE SET value = EXCLUDED.value;

