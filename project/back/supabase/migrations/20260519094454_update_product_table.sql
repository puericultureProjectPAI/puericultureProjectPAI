-- ==============================================================================
-- UPDATE TABLE product WITH NEW COLUMNS
-- ==============================================================================

ALTER TABLE public.products
ADD COLUMN confidence_score INTEGER;

ALTER TABLE public.products
ADD COLUMN condition VARCHAR(255);