-- ==============================================================================
-- US4 : TROC - ÉCHANGES SIMPLES
-- ==============================================================================

-- 1. STATUT DES PRODUITS TROC
ALTER TABLE public.product_troc
ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE';

-- Valeurs possibles :
-- AVAILABLE
-- PENDING_EXCHANGE
-- EXCHANGED


-- 2. TABLE DES ÉCHANGES
CREATE TABLE public.exchanges (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    proposer_product_id BIGINT NOT NULL
        REFERENCES public.product_troc(product_id)
        ON DELETE CASCADE,

    receiver_product_id BIGINT NOT NULL
        REFERENCES public.product_troc(product_id)
        ON DELETE CASCADE,

    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT different_products
        CHECK (proposer_product_id <> receiver_product_id)
);

-- Valeurs possibles pour status :
-- PENDING
-- CONFIRMED
-- REFUSED



-- ==============================================================================
-- ROW LEVEL SECURITY
-- ==============================================================================

ALTER TABLE public.exchanges ENABLE ROW LEVEL SECURITY;