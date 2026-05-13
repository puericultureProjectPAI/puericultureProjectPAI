ALTER TABLE IF EXISTS public.products
    ADD COLUMN IF NOT EXISTS city VARCHAR(255);

UPDATE public.products
SET city = 'Lille'
WHERE city IS NULL;

ALTER TABLE IF EXISTS public.products
    ALTER COLUMN city SET NOT NULL;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'product_troc'
          AND column_name = 'product_id'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'product_troc'
          AND column_name = 'id'
    ) THEN
        ALTER TABLE public.product_troc RENAME COLUMN product_id TO id;
    END IF;
END $$;
