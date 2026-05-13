-- ===============================================================================
-- US2 : TROC - AJOUTER DES PHOTOS (post_images)
-- ===============================================================================

CREATE TABLE public.post_images (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour accélérer la recherche des images par post
CREATE INDEX idx_post_images_post_id ON public.post_images(post_id);
