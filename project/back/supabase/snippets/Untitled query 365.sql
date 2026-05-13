
INSERT INTO public.products (
    author_id,
    post_title,
    description,
    category
)
VALUES
(
    '6f3ecfc7-fb2c-43a3-861d-9e84b48e5709',
    'Jouets',
    'Très bon état',
    'TROC'
)
returning id
