-- ==============================================================================
-- MASTER SCHEMA INITIALIZATION (CLEAN SLATE)
-- VERSION: 1.1
-- DESCRIPTION: Full schema with central 'person' table and basic RLS policies.
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- 1. SCORCHED EARTH (Clean old structures)
-- ==============================================================================
DROP TABLE IF EXISTS public.leasing_reviews CASCADE;
DROP TABLE IF EXISTS public.leasing_issue_reports CASCADE;
DROP TABLE IF EXISTS public.leasing_orders CASCADE;
DROP TABLE IF EXISTS public.exchanges CASCADE;
DROP TABLE IF EXISTS public.product_second_hand CASCADE;
DROP TABLE IF EXISTS public.product_troc CASCADE;
DROP TABLE IF EXISTS public.product_leasing CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.client_products CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.timeline_events CASCADE;
DROP TABLE IF EXISTS public.timelines CASCADE;
DROP TABLE IF EXISTS public.children CASCADE;
DROP TABLE IF EXISTS public.person CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ==============================================================================
-- 2. CORE TABLES
-- ==============================================================================

-- Identity Pivot
CREATE TABLE public.person
(
    id            UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    email         VARCHAR(255) UNIQUE NOT NULL,
    first_name    VARCHAR(255),
    name          VARCHAR(255),
    city          VARCHAR(255),
    street        VARCHAR(255),
    genre         VARCHAR(1),          -- 'F' or 'M'
    date_of_birth DATE,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Life Tracking
CREATE TABLE public.children
(
    id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id   UUID         NOT NULL REFERENCES public.person (id) ON DELETE CASCADE,
    name      VARCHAR(255) NOT NULL,
    birthdate DATE,
    genre     VARCHAR(1)
);

CREATE TABLE public.timelines
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    children_id BIGINT       NOT NULL REFERENCES public.children (id) ON DELETE CASCADE UNIQUE,
    name        VARCHAR(255)
);

CREATE TABLE public.timeline_events
(
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    timeline_id  BIGINT       NOT NULL REFERENCES public.timelines (id) ON DELETE CASCADE,
    type         VARCHAR(255) NOT NULL,
    article_name VARCHAR(255) NOT NULL
);

-- Inventory
CREATE TABLE public.products
(
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    author_id         UUID         NOT NULL REFERENCES public.person (id) ON DELETE CASCADE,
    post_title        VARCHAR(255) NOT NULL,
    post_date         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    city              VARCHAR(255),
    description       TEXT         NOT NULL,
    last_check_date   DATE,
    security_standard VARCHAR(255),
    max_weight_kg     INTEGER,
    dimensions        VARCHAR(255),
    min_age_months    INTEGER,
    max_age_months    INTEGER,
    brand             VARCHAR(255),
    model             VARCHAR(255),
    category          VARCHAR(255) NOT NULL
);

CREATE TABLE public.product_images
(
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id     BIGINT NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
    image_url      TEXT   NOT NULL,
    image_position INTEGER
);

-- Specializations
CREATE TABLE public.product_leasing
(
    product_id    BIGINT PRIMARY KEY REFERENCES public.products (id) ON DELETE CASCADE,
    price_per_month BIGINT NOT NULL,
    price_per_day   BIGINT NOT NULL
);

CREATE TABLE public.product_troc
(
    product_id      BIGINT PRIMARY KEY REFERENCES public.products (id) ON DELETE CASCADE,
    estimated_price BIGINT,
    status          VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE'
);

CREATE TABLE public.product_second_hand
(
    product_id       BIGINT PRIMARY KEY REFERENCES public.products (id) ON DELETE CASCADE,
    price            BIGINT NOT NULL,
    confidence_score INTEGER,
    condition        VARCHAR(255)
);

-- ==============================================================================
-- 3. TRANSACTIONS & MESSAGING
-- ==============================================================================

CREATE TABLE public.client_products
(
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES public.products (id),
    client_id  UUID   NOT NULL REFERENCES public.person (id),
    order_id BIGINT NOT NULL
);

CREATE TABLE public.leasing_orders
(
    client_product_id BIGINT PRIMARY KEY REFERENCES public.client_products (id) ON DELETE CASCADE,
    start_date        DATE NOT NULL,
    end_date          DATE NOT NULL,
    CONSTRAINT leasing_orders_dates_check CHECK (end_date >= start_date)
);

CREATE TABLE public.exchanges
(
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    proposer_product_id BIGINT      NOT NULL REFERENCES public.product_troc (product_id) ON DELETE CASCADE,
    receiver_product_id BIGINT      NOT NULL REFERENCES public.product_troc (product_id) ON DELETE CASCADE,
    status              VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT different_products CHECK (proposer_product_id <> receiver_product_id)
);

CREATE TABLE public.messages
(
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sender_id    UUID   NOT NULL REFERENCES public.person (id) ON DELETE CASCADE,
    receiver_id  UUID   NOT NULL REFERENCES public.person (id) ON DELETE CASCADE,
    product_id   BIGINT REFERENCES public.products (id) ON DELETE SET NULL,
    content      TEXT   NOT NULL,
    message_read BOOLEAN     DEFAULT FALSE,
    message_time TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.leasing_issue_reports
(
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    leasing_order_id BIGINT       NOT NULL REFERENCES public.leasing_orders (client_product_id) ON DELETE CASCADE,
    description      TEXT         NOT NULL,
    image_url        TEXT,
    report_date      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    status           VARCHAR(255) NOT NULL DEFAULT 'OPEN' -- OPEN, RESOLVED, CLOSED
);

CREATE TABLE public.leasing_reviews
(
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    leasing_order_id BIGINT      NOT NULL REFERENCES public.leasing_orders (client_product_id) ON DELETE CASCADE UNIQUE,
    leasing_id       BIGINT      NOT NULL REFERENCES public.product_leasing (product_id) ON DELETE CASCADE,
    rating           INTEGER     NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment          TEXT,
    review_date      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ==============================================================================
-- Toutes les tables ont le RLS activé = DENY ALL par défaut pour les clés
-- anon et authenticated (frontend). Aucune policy = aucun accès possible,
-- même avec la clé anon publique intégrée au frontend.
--
-- Le backend utilise service_role → bypass natif du RLS, aucune policy requise.
--
-- Seule exception : person, qui reçoit 2 policies pour permettre au trigger
-- on_auth_user_created de créer le profil et à l'utilisateur de le lire.
--
-- Pour exposer une table directement au frontend à l'avenir (ex: Realtime),
-- ajouter une policy explicite sur cette table uniquement.
-- ==============================================================================


ALTER TABLE public.person                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timelines             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_leasing       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_troc          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_second_hand   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leasing_orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchanges             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leasing_issue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leasing_reviews       ENABLE ROW LEVEL SECURITY;

-- Les 2 seules policies nécessaires (trigger auth → person)
CREATE POLICY "person_insert_own" ON public.person FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "person_select_own" ON public.person FOR SELECT USING (auth.uid() = id);

-- ==============================================================================
-- 5. AUTH SYNC (Trigger)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
INSERT INTO public.person (id, email, name)
VALUES (new.id, new.email, new.raw_user_meta_data ->>'name');
RETURN new;
END;
$$
LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT
    ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

COMMIT;