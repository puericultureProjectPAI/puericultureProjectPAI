-- ============================================================
-- SEED EXTRA : Fiche Produit "Chaussons" & Avis Figma
-- ============================================================

-- 1. Insérer les personnes Lina et Marthe dans public.person
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
        'lina@test.local',
        '', NOW(), NOW(), NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"name":"Lina"}'::jsonb,
        false
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated',
        'marthe@test.local',
        '', NOW(), NOW(), NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"name":"Marthe"}'::jsonb,
        false
    )
ON CONFLICT (id) DO NOTHING;

-- 2. Insérer le produit "Chaussons" conforme à Figma avec OVERRIDING SYSTEM VALUE
INSERT INTO public.products (
    id, author_id, post_title, description, category, city, condition,
    brand, dimensions, min_age_months, max_age_months, max_weight_kg
) OVERRIDING SYSTEM VALUE VALUES (
    999, -- ID fixe pour s'y référer facilement
    '00000000-0000-0000-0000-000000000001',
    'Chaussons',
    'Chaussons motricité 3 "1ers pas" - Kitchoun - Beige Premiers pas assurés ! Confort, souplesse et maintien',
    'Chaussure',
    'Paris',
    'Très bon état',
    'Kitchoun',
    '15 x 6 x 4 cm',
    0,
    36,
    15
) ON CONFLICT (id) DO NOTHING;

-- 3. Entrée leasing associée à 5.36€/mois (536 cents)
INSERT INTO public.product_leasing (product_id, price_per_day, price_per_month)
VALUES (999, 18, 536)
ON CONFLICT (product_id) DO NOTHING;

-- 4. Image associée à l'article
INSERT INTO public.product_images (product_id, image_url, image_position)
VALUES (999, '/leasing/chaussure.jpg', 1)
ON CONFLICT DO NOTHING;

-- 5. Commandes de location pour Lina et Marthe avec OVERRIDING SYSTEM VALUE
INSERT INTO public.client_products (id, client_id, product_id, order_id) OVERRIDING SYSTEM VALUE VALUES
    (9991, '00000000-0000-0000-0000-000000000003', 999, 1),
    (9992, '00000000-0000-0000-0000-000000000004', 999, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.leasing_orders (client_product_id, start_date, end_date) VALUES
    (9991, '2026-05-01', '2026-05-31'),
    (9992, '2026-04-01', '2026-04-30')
ON CONFLICT (client_product_id) DO NOTHING;

-- 6. Insérer les avis de Lina et Marthe conformes à Figma
INSERT INTO public.leasing_reviews (leasing_order_id, leasing_id, rating, comment, review_date) VALUES
    (9991, 999, 5, 'Cette chaussure de la marque Kitchoun est formidable, je l’ai prise pour mon fils qui faisais ses premiers pas. Il est très ... Plus', NOW() - INTERVAL '2 weeks'),
    (9992, 999, 4, 'Cette chaussure de la marque Kitchoun est formidable, je l’ai prise pour mon fils qui faisais ses premiers pas. Il est très ... Plus', NOW() - INTERVAL '1 month')
ON CONFLICT (leasing_order_id) DO NOTHING;

-- 7. Créer une commande de location éligible pour "Client Test" (00000000-0000-0000-0000-000000000002) afin de lui permettre d'ajouter son propre avis avec OVERRIDING SYSTEM VALUE
INSERT INTO public.client_products (id, client_id, product_id, order_id) OVERRIDING SYSTEM VALUE
VALUES (9993, '00000000-0000-0000-0000-000000000002', 999, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.leasing_orders (client_product_id, start_date, end_date) 
VALUES (9993, '2026-05-15', '2026-06-15')
ON CONFLICT (client_product_id) DO NOTHING;
