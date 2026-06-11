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
        '{"last_name":"Auteur Test","first_name":"Heisenberg","birth_date":"1958-09-07"}'::jsonb,
        false
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated',
        'client@test.local',
        '', NOW(), NOW(), NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"last_name":"Client Test","first_name":"Crazy8","birth_date":"1973-01-01"}'::jsonb,
        false
    )
ON CONFLICT (id) DO NOTHING;

-- 2. Produits (6 articles leasing, IDs générés par PostgreSQL)
INSERT INTO public.products (author_id, post_title, description, category, city, condition, brand, dimensions, min_age_months, max_age_months, max_weight_kg) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Poussette Yoyo légère',       'Poussette pliable idéale pour voyager, cadre aluminium, excellent état.',              'Poussette',  'Paris',     'Très bon état',  'Babyzen',      '52x44x18 cm',  0,  48, 22),
    ('00000000-0000-0000-0000-000000000001', 'Siège auto groupe 0+',         'Siège auto homologué ECE R44/04, coque rigide, harnais 5 points.',                    'Siège auto', 'Lyon',      'Etat correct',   'Maxi-Cosi',    '64x43x60 cm',  0,  12, 13),
    ('00000000-0000-0000-0000-000000000001', 'Berceau co-dodo',              'Berceau fixable au lit parental, matelas inclus, structure bois.',                     'Couchage',   'Bordeaux',  'Très bon état',  'Chicco',       '93x43x78 cm',  0,   6, NULL),
    ('00000000-0000-0000-0000-000000000001', 'Transat vibrant Fisher-Price', 'Transat à vibrations douces, arche de jeux amovible, 3 positions.',                   'Transat',    'Paris',     'Etat correct',   'Fisher-Price', '75x53x58 cm',  0,   6, 11),
    ('00000000-0000-0000-0000-000000000001', 'Trotteur évolutif',            'Trotteur réglable en hauteur, plateau d''activités, roues antidérapantes.',            'Éveil',      'Marseille', 'Usé',            'Chicco',       '68x46x52 cm',  6,  15, 11),
    ('00000000-0000-0000-0000-000000000001', 'Baignoire bébé ergonomique',   'Baignoire avec support antidérapant et thermomètre intégré, 0-24 mois.',              'Bain',       'Nantes',    'Très bon état',  'Thermobaby',   '82x46x23 cm',  0,  24, NULL);

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
-- (order_id = 0 réservé pour cette commande active)
WITH cp AS (
    INSERT INTO public.client_products (client_id, product_id, order_id)
    SELECT '00000000-0000-0000-0000-000000000002', p.id, 0
    FROM public.products p
    WHERE p.post_title = 'Baignoire bébé ergonomique'
    RETURNING id
)
INSERT INTO public.leasing_orders (client_product_id, start_date, end_date)
SELECT id, '2026-05-01', '2026-05-31' FROM cp;

-- 6. Utilisateurs reviewers (raw_user_meta_data->>'name' est utilisé par le trigger → public.person.name)
INSERT INTO auth.users (
    id, instance_id, aud, role, email,
    encrypted_password, email_confirmed_at,
    created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin
) VALUES
    (
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated',
        'reviewer1@test.local',
        '', NOW(), NOW(), NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"name":"Sophie M."}'::jsonb,
        false
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated',
        'reviewer2@test.local',
        '', NOW(), NOW(), NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"name":"Thomas R."}'::jsonb,
        false
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated',
        'reviewer3@test.local',
        '', NOW(), NOW(), NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"name":"Marie L."}'::jsonb,
        false
    )
ON CONFLICT (id) DO NOTHING;

-- 7. Commandes passées + avis (order_id >= 1 pour ne pas entrer en conflit avec la commande active)

-- 7a. Sophie M. — Poussette Yoyo légère (mars 2026) — 5 étoiles
WITH cp AS (
    INSERT INTO public.client_products (client_id, product_id, order_id)
    SELECT '00000000-0000-0000-0000-000000000003', p.id, 1 FROM public.products p WHERE p.post_title = 'Poussette Yoyo légère'
    RETURNING id AS cp_id, product_id
), lo AS (
    INSERT INTO public.leasing_orders (client_product_id, start_date, end_date)
    SELECT cp.cp_id, '2026-03-01', '2026-03-14' FROM cp
    RETURNING client_product_id AS order_id
)
INSERT INTO public.leasing_reviews (leasing_order_id, leasing_id, rating, comment, review_date)
SELECT lo.order_id, cp.product_id, 5, 'Super poussette, légère et pliable en quelques secondes. Parfaite pour les voyages !', '2026-03-15 10:00:00+00'
FROM lo, cp;

-- 7b. Thomas R. — Poussette Yoyo légère (janvier 2026) — 4 étoiles
WITH cp AS (
    INSERT INTO public.client_products (client_id, product_id, order_id)
    SELECT '00000000-0000-0000-0000-000000000004', p.id, 2 FROM public.products p WHERE p.post_title = 'Poussette Yoyo légère'
    RETURNING id AS cp_id, product_id
), lo AS (
    INSERT INTO public.leasing_orders (client_product_id, start_date, end_date)
    SELECT cp.cp_id, '2026-01-05', '2026-01-25' FROM cp
    RETURNING client_product_id AS order_id
)
INSERT INTO public.leasing_reviews (leasing_order_id, leasing_id, rating, comment, review_date)
SELECT lo.order_id, cp.product_id, 4, 'Très bonne qualité, roues un peu rigides au début mais ça se rôde. Bon rapport qualité/prix.', '2026-01-26 14:30:00+00'
FROM lo, cp;

-- 7c. Marie L. — Poussette Yoyo légère (février 2026) — 5 étoiles
WITH cp AS (
    INSERT INTO public.client_products (client_id, product_id, order_id)
    SELECT '00000000-0000-0000-0000-000000000005', p.id, 3 FROM public.products p WHERE p.post_title = 'Poussette Yoyo légère'
    RETURNING id AS cp_id, product_id
), lo AS (
    INSERT INTO public.leasing_orders (client_product_id, start_date, end_date)
    SELECT cp.cp_id, '2026-02-10', '2026-02-20' FROM cp
    RETURNING client_product_id AS order_id
)
INSERT INTO public.leasing_reviews (leasing_order_id, leasing_id, rating, comment, review_date)
SELECT lo.order_id, cp.product_id, 5, 'Impeccable pour un séjour à l''étranger, le pliage est vraiment rapide. Très satisfaite !', '2026-02-21 09:15:00+00'
FROM lo, cp;

-- 7d. Sophie M. — Siège auto groupe 0+ (décembre 2025) — 4 étoiles
WITH cp AS (
    INSERT INTO public.client_products (client_id, product_id, order_id)
    SELECT '00000000-0000-0000-0000-000000000003', p.id, 4 FROM public.products p WHERE p.post_title = 'Siège auto groupe 0+'
    RETURNING id AS cp_id, product_id
), lo AS (
    INSERT INTO public.leasing_orders (client_product_id, start_date, end_date)
    SELECT cp.cp_id, '2025-12-01', '2025-12-31' FROM cp
    RETURNING client_product_id AS order_id
)
INSERT INTO public.leasing_reviews (leasing_order_id, leasing_id, rating, comment, review_date)
SELECT lo.order_id, cp.product_id, 4, 'Siège conforme à la description, installation facile. Je recommande.', '2026-01-02 11:00:00+00'
FROM lo, cp;

-- 7e. Thomas R. — Siège auto groupe 0+ (octobre 2025) — 3 étoiles
WITH cp AS (
    INSERT INTO public.client_products (client_id, product_id, order_id)
    SELECT '00000000-0000-0000-0000-000000000004', p.id, 5 FROM public.products p WHERE p.post_title = 'Siège auto groupe 0+'
    RETURNING id AS cp_id, product_id
), lo AS (
    INSERT INTO public.leasing_orders (client_product_id, start_date, end_date)
    SELECT cp.cp_id, '2025-10-01', '2025-10-28' FROM cp
    RETURNING client_product_id AS order_id
)
INSERT INTO public.leasing_reviews (leasing_order_id, leasing_id, rating, comment, review_date)
SELECT lo.order_id, cp.product_id, 3, 'Correct mais la sangle d''entrejambe était un peu usée. Service client réactif.', '2025-10-29 16:45:00+00'
FROM lo, cp;

-- 7f. Marie L. — Trotteur évolutif (avril 2026) — 5 étoiles
WITH cp AS (
    INSERT INTO public.client_products (client_id, product_id, order_id)
    SELECT '00000000-0000-0000-0000-000000000005', p.id, 6 FROM public.products p WHERE p.post_title = 'Trotteur évolutif'
    RETURNING id AS cp_id, product_id
), lo AS (
    INSERT INTO public.leasing_orders (client_product_id, start_date, end_date)
    SELECT cp.cp_id, '2026-04-01', '2026-04-30' FROM cp
    RETURNING client_product_id AS order_id
)
INSERT INTO public.leasing_reviews (leasing_order_id, leasing_id, rating, comment, review_date)
SELECT lo.order_id, cp.product_id, 5, 'Mon fils a adoré ! Très stable et les activités sont bien pensées.', '2026-05-01 08:30:00+00'
FROM lo, cp;
