-- ============================================================
-- SEED EXTRA : Produits Figma & Avis Clients Multiples
-- Ce script est isolé et dédié à la validation de la feature
-- ============================================================

-- 1. Nettoyer les anciennes données de test figma pour éviter les conflits (idempotence)
DELETE FROM public.leasing_reviews WHERE leasing_id IN (999, 998, 997, 996);
DELETE FROM public.leasing_orders WHERE client_product_id IN (9991, 9992, 9993, 9981, 9982, 9983, 9971, 9972, 9973, 9961, 9962, 9963);
DELETE FROM public.client_products WHERE id IN (9991, 9992, 9993, 9981, 9982, 9983, 9971, 9972, 9973, 9961, 9962, 9963);
DELETE FROM public.product_images WHERE product_id IN (999, 998, 997, 996);
DELETE FROM public.product_leasing WHERE product_id IN (999, 998, 997, 996);
DELETE FROM public.products WHERE id IN (999, 998, 997, 996);

-- 2. S'assurer de la présence des utilisateurs auth de test
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

-- 3. Insérer les produits de test spécifiques avec OVERRIDING SYSTEM VALUE
INSERT INTO public.products (
    id, author_id, post_title, description, category, city, condition,
    brand, dimensions, min_age_months, max_age_months, max_weight_kg
) OVERRIDING SYSTEM VALUE VALUES 
    (
        999,
        '00000000-0000-0000-0000-000000000001',
        'Chaussons motricité',
        'Chaussons motricité 3 "1ers pas" - Kitchoun - Beige. Premiers pas assurés ! Confort, souplesse et maintien idéal pour les pieds en pleine croissance.',
        'Chaussure',
        'Paris',
        'Très bon état',
        'Kitchoun',
        '15 x 6 x 4 cm',
        0,
        36,
        15
    ),
    (
        998,
        '00000000-0000-0000-0000-000000000001',
        'Poussette Yoyo légère figma',
        'Poussette pliable ultra-compacte, idéale pour voyager en cabine d''avion. Cadre en aluminium haute performance, maniable d''une main.',
        'Poussette',
        'Paris',
        'Excellent état',
        'Babyzen',
        '52 x 44 x 18 cm',
        6,
        48,
        22
    ),
    (
        997,
        '00000000-0000-0000-0000-000000000001',
        'Siège auto Cybex',
        'Siège auto homologué ECE R44/04 pour nourrissons. Coque à absorption d''énergie et appui-tête réglable sur plusieurs positions.',
        'Siège auto',
        'Lyon',
        'Très bon état',
        'Cybex',
        '65 x 44 x 38 cm',
        0,
        18,
        13
    ),
    (
        996,
        '00000000-0000-0000-0000-000000000001',
        'Berceau co-dodo Chicco',
        'Berceau évolutif permettant de dormir près de bébé en toute sécurité. Matelas respirant inclus, structure en bois léger.',
        'Couchage',
        'Bordeaux',
        'Excellent état',
        'Chicco',
        '93 x 69 x 66 cm',
        0,
        9,
        9
    );

-- 4. Associer les prix de leasing en euros entiers (même convention que seed.sql)
INSERT INTO public.product_leasing (product_id, price_per_day, price_per_month) VALUES 
    (999, 1, 5),    -- 5€/mois
    (998, 3, 45),   -- 45€/mois
    (997, 2, 30),   -- 30€/mois
    (996, 1, 24);   -- 24€/mois

-- 5. Associer les images pour le carrousel
INSERT INTO public.product_images (product_id, image_url, image_position) VALUES
    (999, '/leasing/chaussure.jpg', 1),
    (998, 'https://placehold.co/400x300?text=Poussette+Yoyo+Figma', 1),
    (997, 'https://placehold.co/400x300?text=Siege+Auto+Figma', 1),
    (996, 'https://placehold.co/400x300?text=Berceau+Figma', 1);

-- 6. Créer les commandes de location terminées pour Lina et Marthe (permet d'attacher des avis)
INSERT INTO public.client_products (id, client_id, product_id, order_id) OVERRIDING SYSTEM VALUE VALUES
    -- Commandes pour Chaussons (999)
    (9991, '00000000-0000-0000-0000-000000000003', 999, 1),
    (9992, '00000000-0000-0000-0000-000000000004', 999, 2),
    -- Commandes pour Poussette (998)
    (9981, '00000000-0000-0000-0000-000000000003', 998, 3),
    (9982, '00000000-0000-0000-0000-000000000004', 998, 4),
    -- Commandes pour Siège auto (997)
    (9971, '00000000-0000-0000-0000-000000000003', 997, 5),
    (9972, '00000000-0000-0000-0000-000000000004', 997, 6),
    -- Commandes pour Berceau (996)
    (9961, '00000000-0000-0000-0000-000000000003', 996, 7),
    (9962, '00000000-0000-0000-0000-000000000004', 996, 8);

-- Valider les périodes de location terminées
INSERT INTO public.leasing_orders (client_product_id, start_date, end_date) VALUES
    (9991, '2026-05-01', '2026-05-31'),
    (9992, '2026-04-01', '2026-04-30'),
    (9981, '2026-05-01', '2026-05-31'),
    (9982, '2026-04-01', '2026-04-30'),
    (9971, '2026-05-01', '2026-05-31'),
    (9972, '2026-04-01', '2026-04-30'),
    (9961, '2026-05-01', '2026-05-31'),
    (9962, '2026-04-01', '2026-04-30');

-- 7. Insérer plusieurs avis par produit pour Lina et Marthe (Date il y a 2 semaines / 1 mois)
INSERT INTO public.leasing_reviews (leasing_order_id, leasing_id, rating, comment, review_date) VALUES
    -- Avis pour Chaussons
    (9991, 999, 5, 'Cette chaussure de la marque Kitchoun est formidable, je l’ai prise pour mon fils qui faisais ses premiers pas. Il est très à l''aise dedans.', NOW() - INTERVAL '2 weeks'),
    (9992, 999, 4, 'Chaussons de très bonne qualité, le beige est joli et s''accorde avec tout. Semelle bien souple.', NOW() - INTERVAL '1 month'),
    -- Avis pour Poussette Yoyo
    (9981, 998, 5, 'Indispensable pour voyager ! Elle se plie en un clin d''oeil et passe en cabine sans aucun problème.', NOW() - INTERVAL '10 days'),
    (9982, 998, 5, 'Très légère et maniable dans les petites rues. La location nous a évité un achat coûteux.', NOW() - INTERVAL '3 weeks'),
    -- Avis pour Siège auto
    (9971, 997, 5, 'Très robuste et très bien noté aux tests ADAC. Bébé est bien installé et dort paisiblement.', NOW() - INTERVAL '1 week'),
    (9972, 997, 4, 'Facile à installer avec la base. Un peu lourd à porter à bout de bras, mais la sécurité est au top.', NOW() - INTERVAL '2 weeks'),
    -- Avis pour Berceau Chicco
    (9961, 996, 5, 'Le co-dodo a changé nos nuits ! Bébé dort tout près et l''allaitement nocturne est grandement facilité.', NOW() - INTERVAL '5 days'),
    (9962, 996, 4, 'Très pratique et spacieux. Se fixe solidement à notre lit double. Matelas confortable.', NOW() - INTERVAL '12 days');

-- 8. Créer une commande de location éligible pour "Client Test" (00000000-0000-0000-0000-000000000002) afin de lui permettre d'ajouter son propre avis avec OVERRIDING SYSTEM VALUE
INSERT INTO public.client_products (id, client_id, product_id, order_id) OVERRIDING SYSTEM VALUE VALUES 
    (9993, '00000000-0000-0000-0000-000000000002', 999, 9),
    (9983, '00000000-0000-0000-0000-000000000002', 998, 10),
    (9973, '00000000-0000-0000-0000-000000000002', 997, 11),
    (9963, '00000000-0000-0000-0000-000000000002', 996, 12);

INSERT INTO public.leasing_orders (client_product_id, start_date, end_date) VALUES 
    (9993, '2026-05-15', '2026-06-15'),
    (9983, '2026-05-15', '2026-06-15'),
    (9973, '2026-05-15', '2026-06-15'),
    (9963, '2026-05-15', '2026-06-15');
