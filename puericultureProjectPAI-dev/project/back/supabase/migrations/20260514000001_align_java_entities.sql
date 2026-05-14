-- ==============================================================================
-- Alignement du schéma DB avec les entités Java (Person, Product, ProductLeasing)
-- ==============================================================================

-- PHASE 1 : Suppression des tables concernées
DROP TABLE IF EXISTS public.product_leasing CASCADE;
DROP TABLE IF EXISTS public.product_troc CASCADE;
DROP TABLE IF EXISTS public.product_second_hand CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- PHASE 2 : Recréation alignée sur les entités Java

-- 1. TABLE person (correspond à Person.java)
CREATE TABLE public.person (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email          VARCHAR(255) UNIQUE NOT NULL,
    first_name     VARCHAR(255)        NOT NULL,
    name           VARCHAR(255)        NOT NULL,
    city           VARCHAR(255),
    street         VARCHAR(255),
    genre          VARCHAR(255),
    date_of_birth  DATE
);

-- 2. TABLE product_leasing (correspond à ProductLeasing.java — id auto-généré)
CREATE TABLE public.product_leasing (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    price_per_month BIGINT NOT NULL,
    price_per_day   BIGINT NOT NULL
);

-- 3. TABLE products (correspond à Product.java)
CREATE TABLE public.products (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    author_id          BIGINT       NOT NULL REFERENCES public.person (id) ON DELETE CASCADE,
    post_title         VARCHAR(255) NOT NULL,
    post_date          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    city               VARCHAR(255),
    description        TEXT         NOT NULL,
    last_check_date    DATE,
    security_standard  VARCHAR(255),
    max_weight_kg      INTEGER,
    dimensions         VARCHAR(255),
    min_age_months     INTEGER,
    max_age_months     INTEGER,
    brand              VARCHAR(255),
    model              VARCHAR(255),
    category           VARCHAR(255) NOT NULL,
    product_leasing_id BIGINT REFERENCES public.product_leasing (id) ON DELETE SET NULL
);
