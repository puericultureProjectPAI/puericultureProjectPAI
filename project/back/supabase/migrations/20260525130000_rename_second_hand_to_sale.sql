-- Supprimer l'ancienne table de seconde main
DROP TABLE IF EXISTS public.product_second_hand CASCADE;

-- Créer la table de vente normalisée avec uniquement le prix
CREATE TABLE public.product_sale
(
    product_id BIGINT PRIMARY KEY REFERENCES public.products (id) ON DELETE CASCADE,
    price      BIGINT NOT NULL
);
