-- ============================================================
-- SEED : Données de test leasing (PUE-67)
-- Usage : tests manuels / visuels uniquement.
-- IDs numériques laissés à PostgreSQL (tables IDENTITY).
-- UUIDs auth.users fixes pour simplifier la chaîne FK.
-- ============================================================

-- 1. Utilisateurs auth
INSERT INTO auth.users (
    id, instance_id, aud, role, email,
    encrypted_password, email_confirmed_at,
    created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin
) VALUES
    (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated',
        'auteur@test.local',
        '', NOW(), NOW(), NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"name":"Auteur Test"}'::jsonb,
        false
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated',
        'client@test.local',
        '', NOW(), NOW(), NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"name":"Client Test"}'::jsonb,
        false
    )
ON CONFLICT (id) DO NOTHING;

-- 2. Produits (6 articles leasing, IDs générés par PostgreSQL)
INSERT INTO public.products (author_id, post_title, description, category, city, condition) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Poussette Yoyo légère',       'Poussette pliable idéale pour voyager, cadre aluminium, excellent état.',              'Poussette', 'Paris',     'Très bon état'),
    ('00000000-0000-0000-0000-000000000001', 'Siège auto groupe 0+',         'Siège auto homologué ECE R44/04, coque rigide, harnais 5 points.',                    'Siège auto', 'Lyon',     'Bon état'),
    ('00000000-0000-0000-0000-000000000001', 'Berceau co-dodo',              'Berceau fixable au lit parental, matelas inclus, structure bois.',                     'Couchage',  'Bordeaux',  'Excellent état'),
    ('00000000-0000-0000-0000-000000000001', 'Transat vibrant Fisher-Price', 'Transat à vibrations douces, arche de jeux amovible, 3 positions.',                   'Transat',   'Paris',     'Bon état'),
    ('00000000-0000-0000-0000-000000000001', 'Trotteur évolutif',            'Trotteur réglable en hauteur, plateau d''activités, roues antidérapantes.',            'Éveil',     'Marseille', 'État correct'),
    ('00000000-0000-0000-0000-000000000001', 'Baignoire bébé ergonomique',   'Baignoire avec support antidérapant et thermomètre intégré, 0-24 mois.',              'Bain',      'Nantes',    'Excellent état');

-- 3. Entrées leasing (prix en euros entiers, liées par post_title)
INSERT INTO public.product_leasing (product_id, price_per_day, price_per_month)
SELECT p.id, pl.price_per_day, pl.price_per_month
FROM public.products p
JOIN (VALUES
    ('Poussette Yoyo légère',       5, 90),
    ('Siège auto groupe 0+',         4, 70),
    ('Berceau co-dodo',              3, 55),
    ('Transat vibrant Fisher-Price', 2, 35),
    ('Trotteur évolutif',            2, 30),
    ('Baignoire bébé ergonomique',   1, 18)
) AS pl(post_title, price_per_day, price_per_month) ON p.post_title = pl.post_title;

-- 4. Images produits (Poussette Yoyo intentionnellement sans image → teste le fallback)
INSERT INTO public.product_images (product_id, image_url, image_position)
SELECT p.id, img.image_url, img.image_position
FROM public.products p
JOIN (VALUES
    ('Siège auto groupe 0+',         'https://placehold.co/400x300?text=Siege+auto', 1),
    ('Berceau co-dodo',              'https://placehold.co/400x300?text=Berceau',    1),
    ('Transat vibrant Fisher-Price', 'https://placehold.co/400x300?text=Transat',    1),
    ('Trotteur évolutif',            'https://placehold.co/400x300?text=Trotteur',   1),
    ('Baignoire bébé ergonomique',   'https://placehold.co/400x300?text=Baignoire',  1)
) AS img(post_title, image_url, image_position) ON p.post_title = img.post_title;

-- 5. Commande active sur "Baignoire bébé ergonomique" → la rend indisponible dans la liste
WITH cp AS (
    INSERT INTO public.client_products (client_id, product_id, order_id)
    SELECT '00000000-0000-0000-0000-000000000002', p.id, 0
    FROM public.products p
    WHERE p.post_title = 'Baignoire bébé ergonomique'
    RETURNING id
)
INSERT INTO public.leasing_orders (client_product_id, start_date, end_date)
SELECT id, '2026-05-01', '2026-05-31' FROM cp;
