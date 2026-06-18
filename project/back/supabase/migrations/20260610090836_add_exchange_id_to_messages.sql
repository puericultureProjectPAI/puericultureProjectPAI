ALTER TABLE public.messages
    ADD COLUMN exchange_id BIGINT REFERENCES public.exchanges(id) ON DELETE CASCADE;

-- receiver_id is now redundant (derived from exchange), drop the NOT NULL constraint
ALTER TABLE public.messages
    ALTER COLUMN receiver_id DROP NOT NULL;