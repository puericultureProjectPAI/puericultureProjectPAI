CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
INSERT INTO public.person (id, email, name, first_name, date_of_birth)
VALUES (new.id, new.email, new.raw_user_meta_data ->>'last_name', new.raw_user_meta_data ->>'first_name', (new.raw_user_meta_data ->> 'birth_date')::date);
RETURN new;
END;
$$
LANGUAGE plpgsql SECURITY DEFINER;