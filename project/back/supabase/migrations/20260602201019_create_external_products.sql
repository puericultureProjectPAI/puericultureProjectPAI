-- =============================================================================
-- EXTERNAL PRODUCTS TABLE
-- =============================================================================

CREATE TABLE public.external_products
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ean VARCHAR(13) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    category VARCHAR(255),
    image_url TEXT,
    price DECIMAL(10, 2)
);

-- Enable Row Level Security
ALTER TABLE public.external_products
    ENABLE ROW LEVEL SECURITY;
