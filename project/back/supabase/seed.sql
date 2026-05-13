-- ============================================================
-- SEED : Données de test leasing (PUE-67)
-- Ordre FK : auth.users → (trigger → person) → products
--            → product_leasing → product_images
--            → client_products → leasing_orders
-- ============================================================

-- 1. Utilisateurs auth
--    Le trigger on_auth_user_created insère automatiquement dans public.person
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

-- 2. Produits (6 articles leasing, auteur = utilisateur 1)
INSERT INTO public.products (id, author_id, post_title, description, category, city, condition)
OVERRIDING SYSTEM VALUE VALUES
    (1, '00000000-0000-0000-0000-000000000001', 'Poussette Yoyo légère',         'Poussette pliable idéale pour voyager, cadre aluminium, excellent état.',              'Poussette', 'Paris',      'Très bon état'),
    (2, '00000000-0000-0000-0000-000000000001', 'Siège auto groupe 0+',           'Siège auto homologué ECE R44/04, coque rigide, harnais 5 points.',                    'Siège auto', 'Lyon',       'Bon état'),
    (3, '00000000-0000-0000-0000-000000000001', 'Berceau co-dodo',                'Berceau fixable au lit parental, matelas inclus, structure bois.',                     'Couchage',   'Bordeaux',   'Excellent état'),
    (4, '00000000-0000-0000-0000-000000000001', 'Transat vibrant Fisher-Price',   'Transat à vibrations douces, arche de jeux amovible, 3 positions.',                   'Transat',    'Paris',      'Bon état'),
    (5, '00000000-0000-0000-0000-000000000001', 'Trotteur évolutif',              'Trotteur réglable en hauteur, plateau d''activités, roues antidérapantes.',            'Éveil',      'Marseille',  'État correct'),
    (6, '00000000-0000-0000-0000-000000000001', 'Baignoire bébé ergonomique',     'Baignoire avec support antidérapant et thermomètre intégré, 0-24 mois.',              'Bain',       'Nantes',     'Excellent état')
ON CONFLICT (id) DO NOTHING;

-- 3. Entrées leasing (prix en euros entiers)
INSERT INTO public.product_leasing (product_id, price_per_day, price_per_month) VALUES
    (1, 5,  90),
    (2, 4,  70),
    (3, 3,  55),
    (4, 2,  35),
    (5, 2,  30),
    (6, 1,  18)
ON CONFLICT (product_id) DO NOTHING;

-- 4. Images produits (produit 1 intentionnellement sans image)
INSERT INTO public.product_images (id, product_id, image_url, position)
OVERRIDING SYSTEM VALUE VALUES
    (1, 2, 'https://placehold.co/400x300?text=Siege+auto', 1),
    (2, 3, 'https://placehold.co/400x300?text=Berceau',    1),
    (3, 4, 'https://placehold.co/400x300?text=Transat',    1),
    (4, 5, 'https://placehold.co/400x300?text=Trotteur',   1),
    (5, 6, 'https://placehold.co/400x300?text=Baignoire',  1)
ON CONFLICT (id) DO NOTHING;

-- 5. Commande active sur produit 6 → le rend indisponible dans la liste
INSERT INTO public.client_products (id, user_id, product_id)
OVERRIDING SYSTEM VALUE VALUES
    (1, '00000000-0000-0000-0000-000000000002', 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.leasing_orders (id, client_product_id, start_date, end_date)
OVERRIDING SYSTEM VALUE VALUES
    (1, 1, '2026-05-01', '2026-05-31')
ON CONFLICT (id) DO NOTHING;
