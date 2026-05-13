
INSERT INTO public.products (
    author_id,
    person_id,
    post_title,
    description,
    category
)
VALUES
(
    '773e24e8-6303-4fba-a4cd-f59d4e1ec2f0',
    '773e24e8-6303-4fba-a4cd-f59d4e1ec2f0',
    'Jouets',
    'Très bon état',
    'TROC'
)
returning id
