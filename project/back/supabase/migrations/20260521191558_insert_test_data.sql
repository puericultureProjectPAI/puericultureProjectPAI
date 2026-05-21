-- 1. Insertion dans le schéma AUTH de Supabase (Obligatoire pour la clé étrangère)
-- On crée un utilisateur fictif dans la table interne
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES (
           '00000000-0000-0000-0000-000000000000',
           '550e8400-e29b-41d4-a716-446655440000',
           'authenticated',
           'authenticated',
           'aymen.test@example.com',
           crypt('password123', gen_salt('bf')),
           NOW(),
           NOW(),
           NOW(),
           '{"provider":"email","providers":["email"]}',
           '{}',
           NOW(),
           NOW(),
           '',
           '',
           '',
           ''
       )
    ON CONFLICT (id) DO NOTHING;

-- 2. Insertion de l'auteur (Ta table publique Person)
INSERT INTO public.person (id, first_name, name, email, city)
VALUES (
           '550e8400-e29b-41d4-a716-446655440000',
           'Aymen',
           'Messikh',
           'aymen.test@example.com',
           'Lille'
       )
    ON CONFLICT (id) DO NOTHING;

-- 3. Insertion du produit de base (Table Products)
INSERT INTO public.products (id, post_title, post_date, city, description, category, author_id, brand, model, condition, confidence_score)
VALUES (
           100,
           'Poussette Chicco Trio',
           NOW(),
           'Lille',
           'Excellent état, très peu servie.',
           'TRANSPORT_BEBE',
           '550e8400-e29b-41d4-a716-446655440000',
           'Chicco',
           'Trio',
           'EXCELLENT',
           95
       );

-- 4. Insertion du détail Occasion (Second Hand)
INSERT INTO public.second_hand_products (id, ean, price, new_price, condition, status)
VALUES (100, '3661781300254', 150.0, 320.0, 'Très bon état', 'AVAILABLE');

-- 5. Insertion du produit Neuf de référence (External)
INSERT INTO public.external_products (ean, name, brand, category, price, image_url)
VALUES ('3661781300254', 'Poussette Chicco Trio Neuf', 'Chicco', 'TRANSPORT_BEBE', 319.99, 'http://example.com/poussette.jpg');