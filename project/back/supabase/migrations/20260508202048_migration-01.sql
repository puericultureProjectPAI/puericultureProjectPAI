-- ==============================================================================
-- PHASE 1 : DESTRUCTION DE L'ANCIENNE ARCHITECTURE (SCORCHED EARTH)
-- ==============================================================================
DROP TABLE IF EXISTS public.forward_trading CASCADE;
DROP TABLE IF EXISTS public.leasing CASCADE;
DROP TABLE IF EXISTS public.troc CASCADE;
DROP TABLE IF EXISTS public.second_hand CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;


-- ==============================================================================
-- PHASE 2 : DÉPLOIEMENT DE L'ARCHITECTURE DÉFINITIVE
-- ==============================================================================

-- 1. PROFILS (Extension 1:1 stricte de auth.users)
CREATE TABLE public.profiles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    street VARCHAR(255),
    genre VARCHAR(1)
);

-- 2. ENFANTS
CREATE TABLE public.children (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    birthdate DATE,
    genre VARCHAR(1)
);

-- 3. TIMELINES & ÉVÉNEMENTS
CREATE TABLE public.timelines (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE public.timeline_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    timeline_id BIGINT NOT NULL REFERENCES public.timelines(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL
);

-- 4. PRODUITS (Base)
CREATE TABLE public.products (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    post_title VARCHAR(255) NOT NULL,
    post_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description TEXT NOT NULL,
    last_check_date DATE,
    security_standard VARCHAR(255),
    max_weight_kg INTEGER,
    dimensions VARCHAR(255),
    min_age_months INTEGER,
    max_age_months INTEGER,
    brand VARCHAR(255),
    model VARCHAR(255),
    category VARCHAR(255) NOT NULL
);

-- 5. IMAGES DE PRODUITS
CREATE TABLE public.product_images (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    position INTEGER NOT NULL
);

-- 6. EXTENSIONS PRODUITS (Héritage exclusif via Primary Key = Foreign Key)
CREATE TABLE public.product_leasing (
    product_id BIGINT PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
    price_per_month BIGINT NOT NULL,
    price_per_day BIGINT NOT NULL
);

CREATE TABLE public.product_troc (
    product_id BIGINT PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
    estimated_price BIGINT NOT NULL
);

CREATE TABLE public.product_second_hand (
    product_id BIGINT PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
    price BIGINT NOT NULL,
    confidence_score INTEGER,
    condition VARCHAR(255)
);

-- 7. MESSAGERIE
CREATE TABLE public.messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES public.products(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. GESTION DES COMMANDES (LEASING)
CREATE TABLE public.client_products (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE
);

CREATE TABLE public.leasing_orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    client_product_id BIGINT NOT NULL REFERENCES public.client_products(id) ON DELETE CASCADE UNIQUE,
    duration_days INTEGER NOT NULL
);

CREATE TABLE public.leasing_issue_reports (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    leasing_order_id BIGINT NOT NULL REFERENCES public.leasing_orders(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    image_url TEXT,
    report_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(255) NOT NULL
);

CREATE TABLE public.leasing_reviews (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    leasing_order_id BIGINT NOT NULL REFERENCES public.leasing_orders(id) ON DELETE CASCADE UNIQUE,
    leasing_id BIGINT NOT NULL REFERENCES public.product_leasing(product_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    review_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- PHASE 3 : SÉCURISATION (ROW LEVEL SECURITY)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_leasing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_troc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_second_hand ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leasing_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leasing_issue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leasing_reviews ENABLE ROW LEVEL SECURITY;