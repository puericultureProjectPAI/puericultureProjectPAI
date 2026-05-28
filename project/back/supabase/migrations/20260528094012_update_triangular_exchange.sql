-- =============================================================================
-- TRIANGULAR EXCHANGES
-- =============================================================================

CREATE TABLE public.triangular_exchanges
(
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    status     VARCHAR(50) NOT NULL DEFAULT 'PENDING',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TRIANGULAR EXCHANGE PARTICIPANTS
-- =============================================================================

CREATE TABLE public.triangular_exchange_participants
(
    triangular_exchange_id BIGINT NOT NULL
        REFERENCES public.triangular_exchanges(id)
        ON DELETE CASCADE,

    proposer_product_id BIGINT NOT NULL
        REFERENCES public.product_troc(product_id)
        ON DELETE CASCADE,

    receiver_product_id BIGINT NOT NULL
        REFERENCES public.product_troc(product_id)
        ON DELETE CASCADE,

    step_order INTEGER NOT NULL,

    receiver_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (
        triangular_exchange_id,
        proposer_product_id,
        receiver_product_id
    ),

    CONSTRAINT different_products
        CHECK (proposer_product_id <> receiver_product_id),

    CONSTRAINT unique_step_order
        UNIQUE (triangular_exchange_id, step_order)
);

ALTER TABLE public.triangular_exchanges
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.triangular_exchange_participants
    ENABLE ROW LEVEL SECURITY;