-- ==============================================================================
-- CREATE TABLE troc_suggestions
-- Stores automatic suggestions already displayed to users so that the same product
-- pair is not generated repeatedly and users can ignore or accept suggestions.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.troc_suggestions
(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    connected_user_id UUID NOT NULL REFERENCES public.person (id) ON DELETE CASCADE,
    requester_product_id BIGINT NOT NULL REFERENCES public.product_troc (product_id) ON DELETE CASCADE,
    suggested_product_id BIGINT NOT NULL REFERENCES public.product_troc (product_id) ON DELETE CASCADE,
    compatibility_score INTEGER NOT NULL,
    compatibility_reason VARCHAR(500),
    distance_km DOUBLE PRECISION,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT different_suggestion_products CHECK (requester_product_id <> suggested_product_id),
    CONSTRAINT uk_troc_suggestion_user_products UNIQUE (connected_user_id, requester_product_id, suggested_product_id)
);

ALTER TABLE public.troc_suggestions ENABLE ROW LEVEL SECURITY;
